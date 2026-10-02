"use server";

import { getActiveLearner } from "@/server/active-learner";
import { getSessionUser } from "@/server/session";
import { getStudyStatusFor, recordStudyMinute, type StudyStatus } from "@/server/study-time";

// Hai hàm cho đồng hồ học (StudyClock). Không có hồ sơ đang chọn thì trả null; không bao giờ ném lỗi ra màn của bé.

/** Giờ học hôm nay của hồ sơ đang chọn. */
export async function getStudyStatusAction(): Promise<StudyStatus | null> {
  try {
    const learner = await getActiveLearner();
    return learner ? await getStudyStatusFor(learner) : null;
  } catch {
    return null;
  }
}

/** Ghi một phút học của hồ sơ đang chọn và trả giờ học mới. */
export async function recordStudyMinuteAction(): Promise<StudyStatus | null> {
  try {
    const user = await getSessionUser();
    const learner = user ? await getActiveLearner() : null;
    return user && learner ? await recordStudyMinute(user.id, learner.id) : null;
  } catch {
    return null;
  }
}
