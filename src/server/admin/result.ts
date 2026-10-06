// Kết quả chung của các hàm ghi trong khu quản trị: thành công (kèm id mới nếu có) hoặc lỗi nhẹ nhàng gắn vào một ô.

export type AdminResult = { ok: true; id?: number } | { ok: false; field?: string; message: string };

export const fail = (message: string, field?: string): AdminResult => ({ ok: false, message, field });

/** Lỗi đầu tiên của Zod, gắn vào ô đầu của đường dẫn. */
export function firstIssue(error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] }): AdminResult {
  const issue = error.issues[0];
  return fail(issue?.message ?? "Dữ liệu chưa hợp lệ.", typeof issue?.path[0] === "string" ? issue.path[0] : undefined);
}
