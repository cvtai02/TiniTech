import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ProductDetailDto } from '../../types';
import { getProductDetailBySlugFn as getProductDetailBySlug } from '../../services/productDetail';
import { FaEdit, FaEye } from 'react-icons/fa';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import { updateProductStatus } from '../../services/product';

type ProductStatus = 'Active' | 'Draft' | 'Deleted' | 'Discontinued';

const ProductDetailLayout: React.FC = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus>('Active');
  const [description, setDescription] = useState<string>('');
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

  // Mutation for updating product status
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProductStatus }) =>
      updateProductStatus(id.toString(), status),
    onSuccess: () => {
      // Invalidate and refetch the product detail
      queryClient.invalidateQueries({ queryKey: ['productDetail', slug] });
    },
  });

  useEffect(() => {
    setDescription(product?.description || '');
    if (product) {
      setSelectedStatus(product.status as ProductStatus);
    }

    console.log(product?.status);
  }, [product]);

  const toggleMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Get appropriate status color
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Deleted':
        return 'bg-red-100 text-red-800';
      case 'Discontinued':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
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

  function handleSaveChangeStatus(): void {
    if (product && selectedStatus !== product.status) {
      updateStatus({
        id: product.id,
        status: selectedStatus,
      });
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Admin Controls - Add mode toggle */}
      <div className="relative bg-white shadow-md dark:bg-gray-800 p-4">
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
      <main className="container mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 ">
          {/* Product Images Component - Now manages its own CRUD operations */}
          <ProductImages product={product} isEditMode={isEditMode} />

          {/* Product Info Component - Now manages its own CRUD operations */}
          <ProductInfo
            product={product}
            isEditMode={isEditMode}
            setDescription={setDescription}
          />
        </div>
        {/* description */}
        {!isEditMode && (
          <div className="mt-8 p-4 bg-white shadow-mdrounded-lg">
            <h2 className="text-lg font-semibold text-gray-800  mb-4">
              Product Description
            </h2>
            <p className="text-gray-600 ">{description}</p>
          </div>
        )}
        {isEditMode && (
          <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Product Status
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    'Active',
                    'Draft',
                    'Discontinued',
                    'Deleted',
                  ] as ProductStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedStatus === status
                        ? `${getStatusColor(status)} ring-2 ring-offset-2 ring-gray-300`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center">
                <div className="mr-2">Current status:</div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                >
                  {product.status.charAt(0).toUpperCase() +
                    product.status.slice(1)}
                </span>

                {product.status.toLowerCase() !==
                  selectedStatus.toLowerCase() && (
                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={handleSaveChangeStatus}
                      disabled={isUpdating}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetailLayout;
