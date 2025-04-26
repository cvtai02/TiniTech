import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProductAttributeDto,
  ProductAttributeValueDto,
  ProductDetailDto,
  UpdateProductInfoDto,
  VariantDto,
} from '../../types';
import { updateProductInfoFn } from '../../services/productDetail';
import { FaSpinner } from 'react-icons/fa';
import AttributeModal from './AttributeModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ProductInfoProps {
  product: ProductDetailDto;
  isEditMode: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, isEditMode }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Create a clone of the product for edit mode
  const [productClone, setProductClone] = useState<ProductDetailDto>({
    ...product,
  });

  // Additional states
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const [selectedVariant, setSelectedVariant] = useState<VariantDto | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Modal state
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isAddingPrimaryAttribute, setIsAddingPrimaryAttribute] =
    useState(false);
  const [isAttributeValueModalOpen, setIsAttributeValueModalOpen] =
    useState(false);
  const [currentEditingAttribute, setCurrentEditingAttribute] =
    useState<ProductAttributeDto | null>(null);
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  // Update product clone when product data changes
  useEffect(() => {
    if (product) {
      setProductClone({ ...product });
    }
  }, [product]);

  // Watch attribute picks and find matching variant
  useEffect(() => {
    const keys = Object.keys(selectedAttributes);
    if (keys.length === product.attributes.length) {
      const found = product.variants.find((v) =>
        v.variantAttributes.every((va) => {
          const attrName = product.attributes.find(
            (a) => a.attributeId.toString() === va.attributeId,
          )?.name;
          return attrName && selectedAttributes[attrName] === va.value;
        }),
      );
      setSelectedVariant(found || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedAttributes, product.attributes, product.variants]);

  // Mutation for updating product info
  const updateProductInfoMutation = useMutation({
    mutationFn: updateProductInfoFn,
    onSuccess: (result) => {
      if (result !== product.slug) navigate(`/products/${result}`);
      toast('Product information updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating product info:', error);
      toast('Failed to update product information. Please try again.');
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Update productClone
    setProductClone((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleAttributeSelect = (
    attributeName: string,
    value: string,
  ): void => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const saveChanges = async () => {
    if (!isEditMode) return;

    setIsSaving(true);

    try {
      // Use new UpdateProductInfoDto structure
      const productInfoData: UpdateProductInfoDto = {
        new: productClone,
      };
      await updateProductInfoMutation.mutateAsync(productInfoData);
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const openAttributeModal = (isPrimary: boolean) => {
    setIsAddingPrimaryAttribute(isPrimary);
    setIsAttributeModalOpen(true);
  };

  const closeAttributeModal = () => {
    setIsAttributeModalOpen(false);
  };

  const handleAddAttributeValue = (
    attribute: ProductAttributeDto,
    value: ProductAttributeValueDto,
  ) => {
    closeAttributeModal();

    // Update the productClone with new attribute value
    setProductClone((prev) => {
      const attrIndex = prev.attributes.findIndex(
        (attr) => attr.name === attribute.name,
      );
      if (attrIndex !== -1) {
        const updatedAttributes = [...prev.attributes];
        updatedAttributes[attrIndex] = {
          ...updatedAttributes[attrIndex],
          values: [...updatedAttributes[attrIndex].values, value],
        };
        return { ...prev, attributes: updatedAttributes };
      }
      return prev;
    });
  };

  const handleAddAttribute = (attribute: ProductAttributeDto) => {
    // Handle adding a new attribute to the clone
    if (productClone.attributes.length >= 5) {
      toast.error('You can only add up to 5 attributes.');
      return;
    }
    if (productClone.attributes.some((attr) => attr.name === attribute.name)) {
      toast.error(`Attribute ${attribute.name} already exists`);
      return;
    }

    setProductClone((prev) => ({
      ...prev,
      attributes: [...prev.attributes, attribute],
    }));

    toast.success(`Added ${attribute.name} attribute`);
    closeAttributeModal();
  };

  const openAttributeValueModal = (attribute: ProductAttributeDto) => {
    setCurrentEditingAttribute(attribute);
    setNewAttributeValue('');
    setSelectedImageUrl('');
    setIsAttributeValueModalOpen(true);
  };

  const closeAttributeValueModal = () => {
    setIsAttributeValueModalOpen(false);
    setCurrentEditingAttribute(null);
    setSelectedImageUrl('');
  };

  const handleAddNewAttributeValue = () => {
    if (!currentEditingAttribute || !newAttributeValue.trim()) return;

    // Check if the value already exists in the attribute's values
    const valueExists = currentEditingAttribute.values.some(
      (val) =>
        val.value.toLowerCase() === newAttributeValue.trim().toLowerCase(),
    );

    if (valueExists) {
      toast.warn(
        `Value "${newAttributeValue}" already exists for this attribute.`,
      );
      return;
    }

    const newValue: ProductAttributeValueDto = {
      value: newAttributeValue.trim(),
      imageUrl: currentEditingAttribute.isPrimary
        ? selectedImageUrl
        : undefined,
    };

    handleAddAttributeValue(currentEditingAttribute, newValue);
    setNewAttributeValue('');
    setSelectedImageUrl('');
    closeAttributeValueModal();
  };

  // Sort attributes by orderPriority - use productClone in edit mode, otherwise use product
  // const displayProduct = isEditMode ? productClone : product;
  const displayProduct = productClone;
  const sortedAttributes = [...displayProduct.attributes].sort(
    (a, b) => a.orderPriority - b.orderPriority,
  );

  return (
    <div className="md:col-span-6">
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Product Title */}
        <div className="mb-4 flex items-center">
          {isEditMode ? (
            <input
              type="text"
              name="name"
              value={displayProduct.name}
              onChange={handleFormChange}
              className="text-2xl font-bold w-full border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none pb-1"
            />
          ) : (
            <h1 className="text-2xl font-bold">{displayProduct.name}</h1>
          )}
        </div>

        {/* SKU */}
        <div className="flex items-center gap-4 mb-4">
          <label className="block text-sm text-gray-600 mb-1">SKU</label>
          {isEditMode ? (
            <input
              type="text"
              name="sku"
              value={displayProduct.sku}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <span className="text-gray-800">
              {selectedVariant?.sku ?? displayProduct.sku}
            </span>
          )}
        </div>

        {/* Rating */}
        {!isEditMode && (
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(displayProduct.rating)
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
              {displayProduct.rating} ({displayProduct.ratingCount} reviews)
            </span>
          </div>
        )}

        {/* Product Description */}
        {!isEditMode && (
          <div className="mb-6 prose max-w-none">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="text-gray-600 whitespace-pre-line">
              {displayProduct.description}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-6">
          {isEditMode ? (
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
              <input
                type="number"
                name="price"
                value={displayProduct.price}
                onChange={handleFormChange}
                step="0.01"
                min="0"
                className="text-2xl font-bold text-blue-600 w-32 border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none pb-1"
              />
            </div>
          ) : (
            <div className="text-2xl font-bold text-blue-600">
              ${selectedVariant?.price ?? displayProduct.price}
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
                      <div
                        className="bg-red-500 text-white rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent button click
                          // Remove the attribute value from productClone
                          setProductClone((prev) => {
                            const updatedAttributes = [...prev.attributes];
                            const attrIndex = updatedAttributes.findIndex(
                              (attr) => attr.name === attribute.name,
                            );

                            if (attrIndex !== -1) {
                              updatedAttributes[attrIndex] = {
                                ...updatedAttributes[attrIndex],
                                values: updatedAttributes[
                                  attrIndex
                                ].values.filter(
                                  (val) => val.value !== item.value,
                                ),
                              };
                            }

                            return { ...prev, attributes: updatedAttributes };
                          });
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
                      </div>
                    </div>
                  )}
                </button>
              ))}
              {isEditMode && (
                <button
                  className="py-2 border border-dashed border-gray-300 rounded-full text-gray-500 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center"
                  onClick={() => {
                    const attributeToEdit =
                      sortedAttributes[sortedAttributes.indexOf(attribute)];
                    openAttributeValueModal(attributeToEdit);
                  }}
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
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add new attribute */}
        {isEditMode && (
          <div className="grid grid-cols-2 gap-8 mb-6">
            {!displayProduct.attributes.find((x) => x.isPrimary) && (
              <button
                className="px-4 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center mb-4"
                onClick={() => openAttributeModal(true)}
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
                Add Primary Attribute
              </button>
            )}

            <button
              className="px-4 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center mb-4"
              onClick={() => openAttributeModal(false)}
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
          </div>
        )}

        {!isEditMode && (
          <div className="text-gray-600 mb-4">
            <span className="font-medium">{displayProduct.sold}</span> items
            sold
          </div>
        )}

        {/* Stock information */}
        <div className="mb-4">
          <span className="font-medium text-gray-700">Stock: </span>
          <span
            className={
              (selectedVariant ? selectedVariant.stock : displayProduct.stock) >
              0
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {selectedVariant ? selectedVariant.stock : displayProduct.stock}{' '}
            {(selectedVariant
              ? selectedVariant.stock
              : displayProduct.stock) === 1
              ? 'item'
              : 'items'}
          </span>
        </div>

        {isEditMode && (
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={displayProduct.description}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
            ></textarea>
          </div>
        )}

        {/* Save Button - only show in edit mode */}
        {isEditMode && (
          <button
            onClick={saveChanges}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        )}

        {/* Attribute Modal */}
        <AttributeModal
          isOpen={isAttributeModalOpen}
          onClose={closeAttributeModal}
          onAddAttribute={handleAddAttribute}
          imageUrls={
            isAddingPrimaryAttribute
              ? displayProduct.images.map((img) => img.imageUrl)
              : undefined
          }
        />

        {/* Attribute Value Modal */}
        {isAttributeValueModalOpen && currentEditingAttribute && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Add Value to "{currentEditingAttribute.name}"
                </h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={newAttributeValue}
                    onChange={(e) => setNewAttributeValue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter attribute value"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddNewAttributeValue();
                      }
                    }}
                  />
                </div>

                {/* Image selection for primary attributes */}
                {currentEditingAttribute.isPrimary && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Select Image
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {displayProduct.images.map((img) => (
                        <div
                          key={img.imageUrl}
                          onClick={() => setSelectedImageUrl(img.imageUrl)}
                          className={`border p-1 rounded cursor-pointer ${selectedImageUrl === img.imageUrl ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'}`}
                        >
                          <img
                            src={img.imageUrl}
                            alt="Option"
                            className="w-full h-16 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeAttributeValueModal}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewAttributeValue}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={
                      !newAttributeValue.trim() ||
                      (currentEditingAttribute.isPrimary && !selectedImageUrl)
                    }
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
