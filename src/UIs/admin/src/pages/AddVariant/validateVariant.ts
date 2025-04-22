import { CreateVariantDto } from '../../types';

export const validateVariant = (
  variant: CreateVariantDto,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Check product ID
  if (!variant.productId) {
    errors.productId = 'Product is required';
  }

  // Check SKU
  if (!variant.sku || variant.sku.trim().length === 0) {
    errors.sku = 'SKU is required';
  } else if (variant.sku.length < 3) {
    errors.sku = 'SKU must be at least 3 characters';
  }

  // Check price
  if (!variant.price || variant.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  // Check attributes
  if (!variant.attributes || variant.attributes.length === 0) {
    errors.attributes = 'At least one attribute is required';
  } else {
    variant.attributes.forEach((attr) => {
      if (!attr.value || attr.value.trim().length === 0) {
        errors[`attribute_${attr.attributeId}`] = 'Attribute value is required';
      }
    });
  }

  return errors;
};
