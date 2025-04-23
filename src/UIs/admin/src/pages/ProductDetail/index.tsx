import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ProductDetailDto } from '../../types';
import { getProductDetailBySlug } from '../../services/product';
import { FaEdit, FaEye } from 'react-icons/fa';

const ProductDetailLayout: React.FC = () => {
  const { slug } = useParams();
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState<number>(1);
  // Add a new state for edit mode
  const [isEditMode, setIsEditMode] = useState<boolean>(true);

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

  const handleUpdateImage = () => {
    if (!isEditMode) {
      alert('Please switch to edit mode to update images');
      return;
    }
    // Implement the update functionality here
    console.log('Update image clicked');
    // For example: trigger a modal to upload a new image or edit the current one
    alert('Update image functionality will be implemented here');
  };

  // Toggle between edit and view modes
  const toggleMode = () => {
    setIsEditMode(!isEditMode);
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
      {/* Admin Controls - Add mode toggle */}
      <div className="relative bg-white shadow-md dark:bg-gray-800 rounded-lg p-4">
        <div className="container mx-auto flex items-center w-full justify-center">
          <label className=" relative inline-flex cursor-pointer select-none items-center">
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
                {/* <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_3128_692)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 0C8.36819 0 8.66667 0.298477 8.66667 0.666667V2C8.66667 2.36819 8.36819 2.66667 8 2.66667C7.63181 2.66667 7.33333 2.36819 7.33333 2V0.666667C7.33333 0.298477 7.63181 0 8 0ZM8 5.33333C6.52724 5.33333 5.33333 6.52724 5.33333 8C5.33333 9.47276 6.52724 10.6667 8 10.6667C9.47276 10.6667 10.6667 9.47276 10.6667 8C10.6667 6.52724 9.47276 5.33333 8 5.33333ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8ZM8.66667 14C8.66667 13.6318 8.36819 13.3333 8 13.3333C7.63181 13.3333 7.33333 13.6318 7.33333 14V15.3333C7.33333 15.7015 7.63181 16 8 16C8.36819 16 8.66667 15.7015 8.66667 15.3333V14ZM2.3411 2.3424C2.60145 2.08205 3.02356 2.08205 3.28391 2.3424L4.23057 3.28906C4.49092 3.54941 4.49092 3.97152 4.23057 4.23187C3.97022 4.49222 3.54811 4.49222 3.28776 4.23187L2.3411 3.28521C2.08075 3.02486 2.08075 2.60275 2.3411 2.3424ZM12.711 11.7682C12.4506 11.5078 12.0285 11.5078 11.7682 11.7682C11.5078 12.0285 11.5078 12.4506 11.7682 12.711L12.7148 13.6577C12.9752 13.918 13.3973 13.918 13.6577 13.6577C13.918 13.3973 13.918 12.9752 13.6577 12.7148L12.711 11.7682ZM0 8C0 7.63181 0.298477 7.33333 0.666667 7.33333H2C2.36819 7.33333 2.66667 7.63181 2.66667 8C2.66667 8.36819 2.36819 8.66667 2 8.66667H0.666667C0.298477 8.66667 0 8.36819 0 8ZM14 7.33333C13.6318 7.33333 13.3333 7.63181 13.3333 8C13.3333 8.36819 13.6318 8.66667 14 8.66667H15.3333C15.7015 8.66667 16 8.36819 16 8C16 7.63181 15.7015 7.33333 15.3333 7.33333H14ZM4.23057 11.7682C4.49092 12.0285 4.49092 12.4506 4.23057 12.711L3.28391 13.6577C3.02356 13.918 2.60145 13.918 2.3411 13.6577C2.08075 13.3973 2.08075 12.9752 2.3411 12.7148L3.28776 11.7682C3.54811 11.5078 3.97022 11.5078 4.23057 11.7682ZM13.6577 3.28521C13.918 3.02486 13.918 2.60275 13.6577 2.3424C13.3973 2.08205 12.9752 2.08205 12.7148 2.3424L11.7682 3.28906C11.5078 3.54941 11.5078 3.97152 11.7682 4.23187C12.0285 4.49222 12.4506 4.49222 12.711 4.23187L13.6577 3.28521Z"
                          fill="currentColor"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_3128_692">
                          <rect width="16" height="16" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg> */}
                <FaEye className="w-4 h-4" />
              </span>
              <span
                className={`flex  h-full w-full  items-center justify-center rounded transition-all duration-200 ease-in-out ${
                  isEditMode ? 'bg-primary text-white' : 'text-body-color'
                }`}
              >
                {/* <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.0547 1.67334C8.18372 1.90227 8.16622 2.18562 8.01003 2.39693C7.44055 3.16737 7.16651 4.11662 7.23776 5.07203C7.30901 6.02744 7.72081 6.92554 8.39826 7.60299C9.07571 8.28044 9.97381 8.69224 10.9292 8.76349C11.8846 8.83473 12.8339 8.5607 13.6043 7.99122C13.8156 7.83502 14.099 7.81753 14.3279 7.94655C14.5568 8.07556 14.6886 8.32702 14.6644 8.58868C14.5479 9.84957 14.0747 11.0512 13.3002 12.053C12.5256 13.0547 11.4818 13.8152 10.2909 14.2454C9.09992 14.6756 7.81108 14.7577 6.57516 14.4821C5.33925 14.2065 4.20738 13.5846 3.312 12.6892C2.41661 11.7939 1.79475 10.662 1.51917 9.42608C1.24359 8.19017 1.32569 6.90133 1.75588 5.71038C2.18606 4.51942 2.94652 3.47561 3.94828 2.70109C4.95005 1.92656 6.15168 1.45335 7.41257 1.33682C7.67423 1.31264 7.92568 1.44442 8.0547 1.67334ZM6.21151 2.96004C5.6931 3.1476 5.20432 3.41535 4.76384 3.75591C3.96242 4.37553 3.35405 5.21058 3.00991 6.16334C2.66576 7.11611 2.60008 8.14718 2.82054 9.13591C3.04101 10.1246 3.5385 11.0301 4.25481 11.7464C4.97111 12.4627 5.87661 12.9602 6.86534 13.1807C7.85407 13.4012 8.88514 13.3355 9.8379 12.9913C10.7907 12.6472 11.6257 12.0388 12.2453 11.2374C12.5859 10.7969 12.8536 10.3081 13.0412 9.78974C12.3391 10.0437 11.586 10.1495 10.8301 10.0931C9.55619 9.99813 8.35872 9.44907 7.45545 8.5458C6.55218 7.64253 6.00312 6.44506 5.90812 5.17118C5.85174 4.4152 5.9575 3.66212 6.21151 2.96004Z"
                        fill="currentColor"
                      ></path>
                    </svg> */}
                <FaEdit className="w-4 h-4" />
              </span>
            </div>
          </label>
        </div>
      </div>

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
                [&::-webkit-scrollbar-thumb]:bg-neutral-500"
                id="thumbnailContainer"
              >
                <div className="flex flex-col gap-2">
                  {isEditMode && (
                    <div
                      className="cursor-pointer rounded-lg mr-2 aspect-square border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                      onClick={() => alert('Add new image')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  )}
                  {product.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      id={`thumbnail-${index}`}
                      className={`cursor-pointer rounded-lg mr-2 aspect-square ${
                        isEditMode ? 'relative group' : ''
                      }`}
                      onClick={() => {
                        setMainImageIndex(index);

                        // Auto scroll functionality
                        const container =
                          document.getElementById('thumbnailContainer');
                        const thumbnail = document.getElementById(
                          `thumbnail-${index}`,
                        );

                        if (container && thumbnail) {
                          // Calculate positioning to center the clicked thumbnail
                          const containerHeight = container.clientHeight;
                          const thumbnailTop = thumbnail.offsetTop;
                          const thumbnailHeight = thumbnail.clientHeight;

                          // Calculate the scroll position that centers the thumbnail
                          const scrollPosition =
                            thumbnailTop -
                            containerHeight / 2 +
                            thumbnailHeight / 2;

                          // Smooth scroll to the calculated position
                          container.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth',
                          });
                        }
                      }}
                    >
                      <img
                        src={url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className={`object-cover w-full h-full rounded-lg border-2 ${
                          index === mainImageIndex
                            ? 'border-blue-600'
                            : 'border-gray-200'
                        }`}
                      />
                      {isEditMode && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity">
                          <button
                            className="p-1 bg-red-500 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Remove image ${index + 1}`);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Main Product Image - Right side */}
            <div className="col-span-6 bg-white p-4 rounded-lg shadow aspect-square relative">
              <img
                src={product.imageUrls[mainImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
              {/* Update Button - only show in edit mode */}
              {isEditMode && (
                <button
                  onClick={handleUpdateImage}
                  className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg flex items-center justify-center"
                  title="Update image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span className="ml-1">Update</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="md:col-span-6">
            <div className="bg-white p-6 rounded-lg shadow">
              {/* Product Title */}
              <div className="mb-4 flex items-center">
                {isEditMode ? (
                  <input
                    type="text"
                    defaultValue={product.name}
                    className="text-2xl font-bold w-full border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none pb-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                )}
              </div>
              {/* Quantity & Stock Display */}
              {isEditMode && (
                <div className="flex items-center gap-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    defaultValue="SKU-12345"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              {/* Rating */}
              {!isEditMode && (
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
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
              )}

              {/* Product Description */}

              {/* Price */}
              <div className="mb-6">
                {isEditMode ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-700 mr-2">
                      $
                    </span>
                    <input
                      type="number"
                      defaultValue={product.price}
                      step="0.01"
                      min="0"
                      className="text-2xl font-bold text-blue-600 w-32 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none pb-1"
                    />
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </div>
                )}
              </div>

              {/* Product Attributes */}
              {sortedAttributes.map((attribute) => (
                <div key={attribute.name} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{attribute.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {attribute.values.map((item) => (
                      <button
                        key={item.value}
                        className={`px-4 py-2 border rounded relative ${
                          selectedAttributes[attribute.name] === item.value
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${isEditMode ? 'group' : ''}`}
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
                        {isEditMode && (
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100">
                            <button
                              className="bg-red-500 text-white rounded-full p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Remove ${item.value} option`);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </button>
                    ))}
                    {isEditMode && (
                      <button
                        className="px-4 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
                        onClick={() =>
                          alert(`Add new ${attribute.name} option`)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {/* add new attribute */}
              {isEditMode && (
                <button
                  className="px-4 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center mb-4"
                  onClick={() => alert('Add new attribute')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Attribute
                </button>
              )}

              {!isEditMode && (
                <div className="text-gray-600 mb-4">
                  <span className="font-medium">{product.sold}</span> items sold
                </div>
              )}

              {isEditMode && (
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    defaultValue={product.description}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Save Changes Button for Edit Mode */}
      {isEditMode && (
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={() => setIsEditMode(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => {
              alert('Changes saved successfully!');
              setIsEditMode(false);
            }}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailLayout;
