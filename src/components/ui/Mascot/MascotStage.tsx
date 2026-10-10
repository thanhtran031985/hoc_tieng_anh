"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Stage } from "./dragon-stages";

// Dáng rồng Bông theo cấp hiện tại của bé. Layout của bé đặt dáng một lần; mọi `Mascot` không truyền `stage` lấy dáng này,
// nên trang chủ, bài học, kết thúc bài… tự đổi theo cấp mà không phải truyền qua từng thành phần.

type Value = { stage: Stage | undefined; setStage: (stage: Stage) => void };

const MascotStageContext = createContext<Value>({ stage: undefined, setStage: () => {} });

/**
 * `stage` lấy từ cấp của hồ sơ đang chọn (server); bỏ trống thì rồng giữ dáng gốc. Layout vẽ lại với cấp mới thì dáng đổi theo.
 * Khi cấp đổi ngay trên máy mà layout chưa vẽ lại (vừa đạt bài thi lên cấp, vừa xếp lớp) dùng `useSetMascotStage` để đổi tức thì.
 */
export function MascotStageProvider({ stage, children }: { stage: Stage | undefined; children: React.ReactNode }) {
  const [state, setState] = useState<{ from: Stage | undefined; value: Stage | undefined }>({ from: stage, value: stage });
  let current = state;
  // Dáng từ server đổi (layout vẽ lại với hồ sơ hoặc cấp khác) thì bỏ dáng đặt tay.
  if (state.from !== stage) {
    current = { from: stage, value: stage };
    setState(current);
  }
  const value = useMemo<Value>(() => ({ stage: current.value, setStage: (next) => setState({ from: stage, value: next }) }), [current.value, stage]);
  return <MascotStageContext.Provider value={value}>{children}</MascotStageContext.Provider>;
}

/** Dáng rồng của hồ sơ đang chọn; undefined khi không có (rồng giữ dáng gốc). */
export function useMascotStage(): Stage | undefined {
  return useContext(MascotStageContext).stage;
}

/** Đổi dáng rồng ngay trên máy (sau khi lên cấp). */
export function useSetMascotStage(): (stage: Stage) => void {
  return useContext(MascotStageContext).setStage;
}
