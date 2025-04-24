import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ProductDetailDto } from '../../types';
import { getProductDetailBySlugFn as getProductDetailBySlug } from '../../services/productDetail';
import { FaEdit, FaEye } from 'react-icons/fa';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';

const ProductDetailLayout: React.FC = () => {
  const { slug } = useParams();
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Fetch product data
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<ProductDetailDto, Error>({
    queryKey: ['productDetail', slug],
    queryFn: () => getProductDetailBySlug(slug as string),
    enabled: !!slug,
  });

  const toggleMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      if (
        !confirm(
          'Are you sure you want to exit edit mode? Any unsaved changes will be lost.',
        )
      ) {
        return;
      }
    }
    setIsEditMode(!isEditMode);
    // Reset unsaved changes when exiting edit mode
    if (isEditMode) {
      setHasUnsavedChanges(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading product details...</div>
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">
          Error loading product: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Admin Controls - Add mode toggle */}
      <div className="relative bg-white shadow-md dark:bg-gray-800 rounded-lg p-4">
        <div className="container mx-auto flex items-center w-full justify-center">
          <label className="relative inline-flex cursor-pointer select-none items-center">
            <input
              type="checkbox"
              checked={isEditMode}
              onChange={toggleMode}
              className="sr-only"
            />

            <div className="flex h-10 w-20 items-center p-1 justify-center rounded-md border border-gray-300 shadow-sm">
              <span
                className={`flex h-full w-full items-center justify-center rounded transition-all duration-200 ease-in-out ${
                  !isEditMode ? 'bg-primary text-white' : 'text-body-color'
                }`}
              >
                <FaEye className="w-4 h-4" />
              </span>
              <span
                className={`flex h-full w-full items-center justify-center rounded transition-all duration-200 ease-in-out ${
                  isEditMode ? 'bg-primary text-white' : 'text-body-color'
                }`}
              >
                <FaEdit className="w-4 h-4" />
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Product Images Component - Now manages its own CRUD operations */}
          <ProductImages product={product} isEditMode={isEditMode} />

          {/* Product Info Component - Now manages its own CRUD operations */}
          <ProductInfo product={product} isEditMode={isEditMode} />
        </div>
      </main>
    </div>
  );
};

export default ProductDetailLayout;
