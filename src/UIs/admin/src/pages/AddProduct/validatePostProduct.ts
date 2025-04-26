import { CreateProductDto } from '../../types';

/**
 * Validates a product form submission
 * @param product The product data to validate
 * @returns An object containing validation errors, or an empty object if valid
 */
export const validatePostProduct = (
  product: CreateProductDto,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!product.name.trim()) {
    errors.name = 'Tên sản phẩm là bắt buộc';
  } else if (product.name.trim().length < 3) {
    errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
  } else if (product.name.trim().length > 100) {
    errors.name = 'Tên sản phẩm không được vượt quá 100 ký tự';
  }

  // Validate category
  if (!product.categoryId) {
    errors.categoryId = 'Vui lòng chọn danh mục sản phẩm';
  }

  // Validate SKU
  if (!product.sku.trim()) {
    errors.sku = 'SKU là bắt buộc';
  } else if (product.sku.trim().length < 3) {
    errors.sku = 'SKU phải có ít nhất 3 ký tự';
  } else if (product.sku.trim().length > 50) {
    errors.sku = 'SKU không được vượt quá 50 ký tự';
  }

  // Validate price
  //chekc price is number
  // if (isNaN(product.price)) {
  //   errors.price = 'Giá sản phẩm không hợp lệ';
  // } else if (product.price < 0) {
  //   errors.price = 'Giá sản phẩm không được âm';
  // } else if (product.price > 1000000000) {
  //   errors.price = 'Giá sản phẩm không được vượt quá 1 tỷ đồng';
  // }

  // if (product.price % 1000 !== 0) {
  //   errors.price = 'Giá sản phẩm phải là bội số của 1.000đ';
  // }

  // Validate images
  if (!product.images.length) {
    // errors.images = 'Please upload at least one product image';
  } else {
    // Validate image types
    const invalidImages = product.images.filter(
      (img) =>
        !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(
          img.type,
        ),
    );

    if (invalidImages.length > 0) {
      errors.images =
        'Please upload only valid image files (JPEG, PNG, WebP, GIF)';
    }

    // Validate image sizes (max 5MB each)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const oversizedImages = product.images.filter((img) => img.size > MAX_SIZE);

    if (oversizedImages.length > 0) {
      errors.images = `Some images exceed the maximum size of 5MB`;
    }
  }

  return errors;
};
