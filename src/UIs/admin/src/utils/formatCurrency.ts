export function formatVND(value: number) {
  if (!value) return '';
  if (value === 0) return '0đ';
  return Number(value).toLocaleString('vi-VN') + ' ₫';
}

export function formatUSD(value: number) {
  if (!value) return '';
  if (value === 0) return '0$';
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}
