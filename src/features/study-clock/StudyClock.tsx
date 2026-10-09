"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { StudyStatus } from "@/server/study-time";
import { getStudyStatusAction, recordStudyMinuteAction } from "./actions";

// Đồng hồ giờ học của bé. Đếm từng giây khi tab đang hiện và bé vừa thao tác trong 60 giây gần nhất; đủ 60 giây thì gửi một nhịp,
// server ghi một phút học (study_sessions). Phần lẻ giữ trong localStorage để đổi trang không bị mất.
// Hết giờ thì chuyển về /time-up; riêng khi bé đang trong bài (bài học, ôn tập, xếp lớp) chỉ đặt cờ `exhausted`
// để trình chơi cho bé làm nốt câu đang dở rồi mới chuyển (xem `useTimeUpRedirect`).

const IDLE_MS = 60 * 1000;
const SECONDS_PER_MINUTE = 60;
const PERSIST_EVERY_SECONDS = 5;
const FLOW_PREFIXES = ["/lesson", "/review", "/placement"];
const NO_CLOCK_PREFIXES = ["/profiles", "/time-up"];

const startsWith = (path: string, prefixes: readonly string[]) => prefixes.some((p) => path === p || path.startsWith(`${p}/`));
const storageKey = (learnerId: number) => `edu:clock:${learnerId}`;

function readSeconds(learnerId: number): number {
  try {
    const value = Number(window.localStorage.getItem(storageKey(learnerId)));
    return Number.isFinite(value) && value > 0 && value < SECONDS_PER_MINUTE ? Math.trunc(value) : 0;
  } catch {
    return 0;
  }
}

function writeSeconds(learnerId: number, seconds: number): void {
  try {
    window.localStorage.setItem(storageKey(learnerId), String(seconds));
  } catch {
    // Không lưu được thì thôi, chỉ mất phần lẻ dưới 1 phút.
  }
}

type ClockValue = {
  exhausted: boolean;
  /** Phút đã học hôm nay và giới hạn bố mẹ đặt (null là không giới hạn); chưa tải xong thì cả hai null. */
  usedMinutes: number | null;
  limitMinutes: number | null;
};

const ClockContext = createContext<ClockValue>({ exhausted: false, usedMinutes: null, limitMinutes: null });

/** Giờ học hôm nay của bé: đã hết giờ chưa (trình chơi dùng để chuyển sang /time-up sau khi xong câu hiện tại) và số phút đã học. */
export const useStudyClock = () => useContext(ClockContext);

/**
 * Trình chơi (bài học, ôn tập, xếp lớp) gọi mỗi lần render với bước hiện tại: khi `step` đổi (bé vừa xong một câu) mà đã hết giờ
 * thì chuyển sang màn Hết giờ học. Hết giờ giữa lúc đang làm câu thì không ngắt, bé làm nốt câu rồi mới chuyển.
 * `enabled` tắt ở màn kết thúc để kết quả bài kịp được lưu.
 */
export function useTimeUpRedirect(step: unknown, enabled: boolean): void {
  const { exhausted } = useStudyClock();
  const router = useRouter();
  const latest = useRef({ exhausted, enabled });
  useEffect(() => {
    latest.current = { exhausted, enabled };
  });
  const previous = useRef(step);
  useEffect(() => {
    if (previous.current === step) return;
    previous.current = step;
    if (latest.current.exhausted && latest.current.enabled) router.replace("/time-up");
  }, [step, router]);
}

export function StudyClock({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<StudyStatus | null>(null);
  const pathRef = useRef(pathname);
  const lastInput = useRef(0);
  const seconds = useRef(0);
  const learnerRef = useRef<number | null>(null);
  const sending = useRef(false);
  const stopped = startsWith(pathname, NO_CLOCK_PREFIXES);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const apply = useCallback(
    (next: StudyStatus | null) => {
      setStatus(next);
      if (!next) {
        learnerRef.current = null;
        return;
      }
      if (learnerRef.current !== next.learnerId) {
        learnerRef.current = next.learnerId;
        seconds.current = readSeconds(next.learnerId);
      }
      if (next.exhausted && !startsWith(pathRef.current, FLOW_PREFIXES) && !startsWith(pathRef.current, NO_CLOCK_PREFIXES)) router.replace("/time-up");
    },
    [router],
  );

  // Ghi nhận bé còn thao tác.
  useEffect(() => {
    const touch = () => {
      lastInput.current = Date.now();
    };
    touch();
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;
    events.forEach((name) => window.addEventListener(name, touch, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, touch));
  }, []);

  // Mỗi lần đổi trang (có thể đã đổi hồ sơ) lấy lại giờ học từ server.
  useEffect(() => {
    if (stopped) return;
    let cancelled = false;
    void getStudyStatusAction().then((next) => {
      if (!cancelled) apply(next);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, stopped, apply]);

  // Đếm giây học; đủ một phút thì gửi nhịp.
  useEffect(() => {
    if (stopped) return;
    const timer = window.setInterval(() => {
      const learnerId = learnerRef.current;
      if (learnerId === null || document.visibilityState !== "visible" || Date.now() - lastInput.current > IDLE_MS) return;
      seconds.current += 1;
      if (seconds.current % PERSIST_EVERY_SECONDS === 0) writeSeconds(learnerId, seconds.current);
      if (seconds.current >= SECONDS_PER_MINUTE && !sending.current) {
        seconds.current -= SECONDS_PER_MINUTE;
        writeSeconds(learnerId, seconds.current);
        sending.current = true;
        void recordStudyMinuteAction()
          .then((next) => apply(next))
          .finally(() => {
            sending.current = false;
          });
      }
    }, 1000);
    return () => {
      window.clearInterval(timer);
      if (learnerRef.current !== null) writeSeconds(learnerRef.current, seconds.current);
    };
  }, [stopped, apply]);

  const exhausted = status?.exhausted ?? false;
  const usedMinutes = status?.usedMinutes ?? null;
  const limitMinutes = status?.limitMinutes ?? null;
  const value = useMemo(() => ({ exhausted, usedMinutes, limitMinutes }), [exhausted, usedMinutes, limitMinutes]);
  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}
