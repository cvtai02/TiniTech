export function toSku(
  rootCategoryName: string,
  leafCategoryName: string,
  productName: string,
  variantValues: string[] = [],
): string {
  const getInitials = (str: string) =>
    str
      .trim()
      .toUpperCase()
      .split(/\s+/)
      .map((word) => word[0])
      .join('');

  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yy}${mm}${dd}`;

  if (variantValues.length > 0) {
    const variantPart = variantValues
      .map((value) => value.trim().toUpperCase().replace(/\s+/g, ''))
      .join('');
    return `${getInitials(rootCategoryName)}-${getInitials(leafCategoryName)}-${getInitials(productName)}-${variantPart}-${datePart}`;
  }
  const sku = `${getInitials(rootCategoryName)}-${getInitials(leafCategoryName)}-${getInitials(productName)}-${datePart}`;
  return sku;
}
