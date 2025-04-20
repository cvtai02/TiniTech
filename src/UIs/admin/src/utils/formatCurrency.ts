export function formatVND(value: number) {
  if (!value) return '';
  if (value === 0) return '0đ';
  return Number(value).toLocaleString('vi-VN') + ' ₫';
}
