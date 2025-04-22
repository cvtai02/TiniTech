import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ProductDetailDto } from '../../types';
import { getProductDetailBySlug } from '../../services/product';

const ProductDetailLayout: React.FC = () => {
  const { slug } = useParams();
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState<number>(1);

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

  const handleAttributeSelect = (
    attributeName: string,
    value: string,
  ): void => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const handleQuantityChange = (value: number): void => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
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

  // Sort attributes by orderPriority
  const sortedAttributes = [...product.attributes].sort(
    (a, b) => a.orderPriority - b.orderPriority,
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - Product Images */}
          <div className="md:col-span-6 grid grid-cols-7">
            {/* Thumbnail Images - Left side */}
            <div className="col-span-1 relative">
              <div
                className="overflow-y-auto pr-2 scrollbar-thin rounded aspect-[1/6]
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-neutral-700
                    [&::-webkit-scrollbar-thumb]:bg-neutral-500
              "
              >
                <div className="flex flex-col gap-2">
                  {product.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-lg mr-2 aspect-square`}
                      onClick={() => setMainImageIndex(index)}
                    >
                      <img
                        src={url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className={`object-cover w-full h-full rounded-lg border-2 ${index === mainImageIndex ? 'border-blue-600' : 'border-gray-200'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Main Product Image - Right side */}
            <div className="col-span-6 bg-white p-4 rounded-lg shadow aspect-square">
              <img
                src={product.imageUrls[mainImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="md:col-span-6">
            <div className="bg-white p-6 rounded-lg shadow">
              {/* Product Title */}
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.ratingCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-blue-600 mb-6">
                ${product.price}
              </div>

              {/* Product Attributes */}
              {sortedAttributes.map((attribute) => (
                <div key={attribute.name} className="mb-6">
                  <h3 className="font-medium mb-2">{attribute.name}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {attribute.values.map((item) => (
                      <button
                        key={item.value}
                        className={`px-4 py-2 border rounded ${
                          selectedAttributes[attribute.name] === item.value
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() =>
                          handleAttributeSelect(attribute.name, item.value)
                        }
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl || '/api/placeholder/20/20'}
                            alt={item.value}
                            className="inline-block w-4 h-4 mr-2 rounded-full"
                          />
                        )}
                        {item.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-l"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b border-gray-300 min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-r"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                  <span className="ml-4 text-gray-600">
                    {product.stock} items available
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium mb-6">
                Add to Cart
              </button>

              {/* Sold */}
              <div className="text-gray-600 mb-4">
                <span className="font-medium">{product.sold}</span> items sold
              </div>
            </div>
          </div>
        </div>
        {/* Product Description Tabs */}
        <div className="bg-white mt-8 p-6 rounded-lg shadow">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 mb-4">
            <div className="py-2 px-4 border-b-2 border-blue-600 font-medium text-blue-600">
              Description
            </div>
            <div className="py-2 px-4 text-gray-500">Reviews</div>
            <div className="py-2 px-4 text-gray-500">Shipping</div>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailLayout;
