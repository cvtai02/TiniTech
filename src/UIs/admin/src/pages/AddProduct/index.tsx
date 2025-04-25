import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import { fetchCategories } from '../../services/category';
import { CreateProductDto } from '../../types';
import { validatePostProduct } from './validatePostProduct';
import { formatVND } from '../../utils/formatCurrency';
import { toSku } from '../../utils/to-sku';
import { createProduct } from '../../services/product';

const AddProduct: React.FC = () => {
  // Form state
  const [product, setProduct] = useState<CreateProductDto>({
    name: '',
    description: '',
    categoryId: '',
    sku: '',
    price: 0,
    images: [],
  });

  // UI state
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>('');
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [defaultImageIndex, setDefaultImageIndex] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch categories and attributes
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: async (finalProduct: CreateProductDto) => {
      return await createProduct(finalProduct);
    },
  });

  // Derived state for subcategories
  const parentCategories = categories;
  const subcategories =
    categories.find((category) => category.id == selectedParentCategory)
      ?.subcategories || [];

  useEffect(() => {
    const parentName =
      categories.find((e) => e.id == selectedParentCategory)?.name || '';
    const subName =
      subcategories.find((e) => e.id == product.categoryId)?.name || '';

    const newSku = toSku(parentName, subName, product.name);
    setProduct((prev) => ({ ...prev, sku: newSku }));
  }, [product.categoryId, product.name]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'price') {
      // remove 0 at the start of the string
      const parsedValue = parseInt(value.replace(/^0+/, ''));
      if (isNaN(parsedValue)) {
        return;
      }
      setProduct((prev) => ({ ...prev, [name]: parsedValue }));
      return;
    }
    setProduct((prev) => ({ ...prev, [name]: value }));
    console.log(product);
  };

  // Handle category selection
  const handleParentCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setSelectedParentCategory(value);
    setProduct((prev) => ({ ...prev, categoryId: '' })); // Reset child category
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProduct((prev) => ({ ...prev, categoryId: value }));
  };

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Create preview URLs for the images
      const newImagePreviewUrls = newFiles.map((file) =>
        URL.createObjectURL(file),
      );

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));

      setImagePreviewUrls((prev) => [...prev, ...newImagePreviewUrls]);

      // If this is the first image, set it as default
      if (product.images.length === 0) {
        setDefaultImageIndex(0);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    // Create new arrays without the removed image
    const newImages = [...product.images];
    newImages.splice(index, 1);

    const newPreviewUrls = [...imagePreviewUrls];
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);

    setProduct((prev) => ({
      ...prev,
      images: newImages,
    }));

    setImagePreviewUrls(newPreviewUrls);

    // Update default image index if needed
    if (index === defaultImageIndex) {
      setDefaultImageIndex(0); // Reset to first image or 0 if no images left
    } else if (index < defaultImageIndex) {
      setDefaultImageIndex(defaultImageIndex - 1); // Adjust index if we removed an image before the default
    }
  };

  const handleSetDefaultImage = (index: number) => {
    setDefaultImageIndex(index);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validatePostProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // Prepare final product data
      const finalProduct = {
        ...product,
        // Move default image to the front
        images: [
          product.images[defaultImageIndex],
          ...product.images.filter((_, i) => i !== defaultImageIndex),
        ],
      };

      createProductMutation.mutate(finalProduct, {
        onSettled: () => {
          setIsSubmitting(false);
        },
        onSuccess: () => {
          console.log('Product submitted:', finalProduct);

          // Reset form
          setProduct({
            name: '',
            description: '',
            categoryId: '',
            sku: '',
            price: 0,
            images: [],
          });
          setSelectedParentCategory('');
          setImagePreviewUrls([]);
          setDefaultImageIndex(0);
          setErrors({});
        },
      });
    }
  };

  // Clean up image previews when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="max-w-4xl p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>

      <form onSubmit={handleSubmit} className="space-y-6 ">
        {/* Category Selection */}
        <div className="text-white p-6 rounded-lg shadow bg-gray-900 ">
          <h2 className="text-xl font-semibold mb-4 ">Chọn danh mục</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Danh mục gốc *
              </label>
              <select
                value={selectedParentCategory}
                onChange={handleParentCategoryChange}
                className=" border b te text-sm rounded-lg   block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn</option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Danh mục trực thuộc *
              </label>
              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleCategoryChange}
                disabled={!selectedParentCategory}
                className={` border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 
                  ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} 
                `}
              >
                {selectedParentCategory && <option value="">Chọn</option>}
                {subcategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
              )}
            </div>
          </div>
        </div>
        {/* Basic Information */}
        <div className="text-white p-6 rounded-lg shadow bg-gray-900">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tên sản phẩm*
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SKU*
              </label>
              <input
                type="text"
                name="sku"
                value={toSku(
                  categories.find((e) => e.id == selectedParentCategory)
                    ?.name || '',
                  subcategories.find((e) => e.id == product.categoryId)?.name ||
                    '',
                  product.name,
                )}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.sku ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="nhập SKU"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-500">{errors.sku}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Giá bán*
                {product.price ? (
                  <span className="text-sm text-white mt-1">
                    : {formatVND(product.price)}
                  </span>
                ) : (
                  <span className="text-sm text-white mt-1">
                    : {formatVND(0)}
                  </span>
                )}
              </label>
              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Nhập giá sản phẩm"
              />

              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Nhập mô tả sản phẩm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <label
                htmlFor="image-upload"
                className="px-4 py-2 w-full items-center flex bg-gray-100 text-black rounded-md justify-center cursor-pointer hover:bg-gray-300"
              >
                <FaPlus className="mr-2" />
                Thêm hình ảnh
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}

            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden border-2 ${
                      index === defaultImageIndex
                        ? 'border-yellow-400'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSetDefaultImage(index)}
                          className={`p-1.5 rounded-full ${
                            index === defaultImageIndex
                              ? 'bg-yellow-400 text-yellow-800'
                              : 'bg-white text-gray-700 hover:bg-yellow-100'
                          }`}
                          title={
                            index === defaultImageIndex
                              ? 'Default Image'
                              : 'Set as Default'
                          }
                        >
                          <FaImage className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-100"
                          title="Remove Image"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {index === defaultImageIndex && (
                      <div className="absolute top-0 left-0 bg-yellow-400 text-xs px-1.5 py-0.5 rounded-br">
                        Default
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative h-12 overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Chờ một tí ...' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
