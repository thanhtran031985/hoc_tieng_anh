// Chọn con ở thanh trên khu bố mẹ: lấy từ `?kid=<id>`; id lạ (không có trong danh sách của tài khoản) thì dùng con đầu tiên.

export function pickKidId<T extends { id: number }>(list: readonly T[], param: string | string[] | null | undefined): number | null {
  if (list.length === 0) return null;
  const value = Array.isArray(param) ? param[0] : param;
  const id = Number(value);
  return list.find((k) => k.id === id)?.id ?? list[0].id;
}
