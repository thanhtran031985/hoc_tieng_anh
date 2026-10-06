"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AdultButton, AdultIconButton, AdultInput, AdultPinInput, AdultSegmented, adultStyles } from "@/components/adult";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { unlockParentAction } from "./actions";
import styles from "./gate.module.css";

type Props = {
  /** Tài khoản đã đặt PIN; chưa thì chỉ có ô mật khẩu và hướng dẫn tạo PIN. */
  hasPin: boolean;
  /** Tên các con, để chào ("Xem tiến độ của Minh và Khánh Linh…"). */
  kidNames: string[];
};

type Method = "pin" | "password";

function names(list: string[]): string {
  if (list.length === 0) return "của con";
  if (list.length === 1) return `của ${list[0]}`;
  return `của ${list.slice(0, -1).join(", ")} và ${list[list.length - 1]}`;
}

/**
 * Cổng vào khu bố mẹ (Adult01): thẻ Mã PIN / Mật khẩu tài khoản. Lỗi nằm ngay dưới ô kèm số lần thử còn lại;
 * sai 5 lần khóa 5 phút (đếm ở server). Mất mạng thì giữ nguyên thông tin đã nhập và cho Thử lại.
 */
export function GateForm({ hasPin, kidNames }: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<Method>(hasPin ? "pin" : "password");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const refocus = useRef(false);

  async function submit() {
    if (busy) return;
    if (method === "pin") {
      if (pin.length < 4) return setError(`Mã PIN cần ít nhất 4 số (bạn mới nhập ${pin.length}).`);
    } else if (!password) return setError("Nhập mật khẩu tài khoản gia đình.");

    setBusy(true);
    setError(undefined);
    setOffline(false);
    try {
      const result = await unlockParentAction(method === "pin" ? pin : password, method);
      if (result.ok) {
        router.push("/parent");
        router.refresh();
        return;
      }
      setError(result.message);
      if (method === "pin") setPin("");
      else setPassword("");
    } catch {
      setOffline(true);
    }
    refocus.current = true;
    setBusy(false);
  }

  // Ô nhập bị khóa trong lúc kiểm tra nên mất focus: khi mở khóa lại thì trả focus về để bố mẹ gõ lại ngay.
  useEffect(() => {
    if (busy || !refocus.current) return;
    refocus.current = false;
    formRef.current?.querySelector<HTMLElement>("input")?.focus();
  }, [busy]);

  return (
    <div className={styles.gate}>
      <div className={styles.back}>
        <AdultButton label="Về màn chọn hồ sơ" variant="secondary" icon="back" onClick={() => router.push("/profiles")} />
      </div>
      <form
        ref={formRef}
        className={styles.card}
        aria-labelledby="gate-title"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <span className={styles.lock}>
          <Icon name="lock" size={24} />
        </span>
        <div>
          <h1 className={adultStyles.h1} id="gate-title">
            Khu dành cho bố mẹ
          </h1>
          <p className={cn(adultStyles.body, adultStyles.muted, styles.intro)}>Xem tiến độ {names(kidNames)}, đặt giờ học và cài đặt tài khoản.</p>
        </div>

        {!hasPin && (
          <div className={styles.notice}>
            <Icon name="info" size={18} />
            <span className={adultStyles.body}>
              Bạn chưa đặt mã PIN. Sau khi mở khóa bằng mật khẩu, vào <b>Cài đặt › Mật khẩu &amp; mã PIN</b> để tạo PIN 4–6 số.
            </span>
          </div>
        )}
        {offline && (
          <div className={cn(styles.notice, styles.noticeError)} role="alert">
            <Icon name="wifi" size={18} />
            <span className={adultStyles.body}>Chưa kết nối được máy chủ để kiểm tra. Thông tin bạn nhập vẫn giữ nguyên.</span>
          </div>
        )}

        {hasPin && (
          <AdultSegmented
            label="Cách mở khóa"
            value={method}
            options={[["pin", "Mã PIN"], ["password", "Mật khẩu"]]}
            onChange={(next) => {
              setMethod(next);
              setError(undefined);
            }}
          />
        )}

        {method === "pin" ? (
          <AdultPinInput label="Mã PIN" value={pin} onChange={(v) => (setPin(v), setError(undefined))} hint="4–6 chữ số. Ô viền đứt là tùy chọn." error={error} disabled={busy} autoFocus />
        ) : (
          <AdultInput
            label="Mật khẩu tài khoản"
            type={show ? "text" : "password"}
            value={password}
            placeholder="Mật khẩu đăng nhập của bố mẹ"
            autoComplete="current-password"
            required
            disabled={busy}
            error={error}
            autoFocus
            onChange={(e) => (setPassword(e.target.value), setError(undefined))}
            suffix={<AdultIconButton icon="eye" label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShow((v) => !v)} />}
          />
        )}

        {offline ? (
          <AdultButton type="submit" label="Thử lại" icon="replay" size="l" block loading={busy} />
        ) : (
          <AdultButton type="submit" label="Mở khóa" size="l" block shortcut="Enter" loading={busy} />
        )}
        <div className={styles.foot}>
          <span className={cn(adultStyles.small, adultStyles.muted)}>Sai 5 lần sẽ khóa 5 phút</span>
        </div>
      </form>
    </div>
  );
}
