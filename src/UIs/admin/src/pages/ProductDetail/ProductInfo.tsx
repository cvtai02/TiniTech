import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
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
import { toVariantSku } from '../../utils/to-sku';

interface ProductInfoProps {
  product: ProductDetailDto;
  isEditMode: boolean;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isEditMode,
  setDescription,
}) => {
  const navigate = useNavigate();
  const [productClone, setProductClone] = useState<ProductDetailDto>({
    ...product,
  });

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<number, string>
  >({});
  const [isNoneVariantProduct, setIsNoneVariantProduct] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantDto | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isAddingPrimaryAttribute, setIsAddingPrimaryAttribute] =
    useState(false);
  const [isAttributeValueModalOpen, setIsAttributeValueModalOpen] =
    useState(false);
  const [currentEditingAttribute, setCurrentEditingAttribute] =
    useState<ProductAttributeDto | null>(null);
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [newVariantPrice, setNewVariantPrice] = useState('');
  const [newVariantSku, setNewVariantSku] = useState('');

  useEffect(() => {
    if (product) {
      setProductClone({ ...product });
    }
  }, [product]);

  useEffect(() => {
    const keys = Object.keys(selectedAttributes);
    if (keys.length === productClone.attributes.length) {
      var found: VariantDto | null = null;

      productClone.variants.forEach((variant) => {
        if (variant.variantAttributes.length === keys.length) {
          const isMatch = variant.variantAttributes.every((attr) => {
            return (
              selectedAttributes[attr.attributeId] === attr.value &&
              productClone.attributes.some(
                (attribute) => attribute.attributeId === attr.attributeId,
              )
            );
          });

          if (isMatch) {
            found = variant;
          }
        }
      });

      setSelectedVariant(found || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedAttributes, productClone]);

  useEffect(() => {
    if (productClone && productClone.attributes.length > 0) {
      const newSelections = { ...selectedAttributes };
      let selectionChanged = false;

      productClone.attributes.forEach((attr) => {
        if (!newSelections[attr.attributeId] && attr.values.length > 0) {
          newSelections[attr.attributeId] = attr.values[0].value;
          selectionChanged = true;
        }
      });

      if (selectionChanged) {
        setSelectedAttributes(newSelections);
      }

      setIsNoneVariantProduct(false);
    } else {
      setIsNoneVariantProduct(true);
    }
  }, [productClone]);

  const updateProductInfoMutation = useMutation({
    mutationFn: updateProductInfoFn,
    onSuccess: (result) => {
      navigate(`/products/${result}`);
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

    setProductClone((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleAttributeSelect = (attributeId: number, value: string): void => {
    console.log(productClone);
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  const saveChanges = async () => {
    if (!isEditMode) return;

    setIsSaving(true);

    try {
      const productInfoData: UpdateProductInfoDto = {
        new: productClone,
      };
      await updateProductInfoMutation.mutateAsync(productInfoData);
    } catch (error) {}
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

    setProductClone((prev) => {
      const attrIndex = prev.attributes.findIndex(
        (attr) => attr.attributeId === attribute.attributeId,
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
    if (productClone.attributes.length >= 3) {
      toast.error('You can only add up to 3 attributes.');
      return;
    }
    if (
      productClone.attributes.some(
        (attr) => attr.attributeId === attribute.attributeId,
      )
    ) {
      toast.error(`Attribute ${attribute.name} already exists`);
      return;
    }

    setProductClone((prev) => ({
      ...prev,
      attributes: [...prev.attributes, attribute],
      variants: [],
    }));

    if (attribute.values.length > 0) {
      setSelectedAttributes((prev) => ({
        ...prev,
        [attribute.attributeId]: attribute.values[0].value,
      }));
    }

    toast.success(`Added ${attribute.name} attribute`);
    closeAttributeModal();
  };

  const openAttributeValueModal = (attribute: ProductAttributeDto) => {
    setCurrentEditingAttribute(attribute);
    setNewAttributeValue('');
    setSelectedImageUrl(productClone.images[0]?.imageUrl || '');
    setIsAttributeValueModalOpen(true);
  };

  const closeAttributeValueModal = () => {
    setIsAttributeValueModalOpen(false);
    setCurrentEditingAttribute(null);
    setSelectedImageUrl('');
  };

  const handleAddNewAttributeValue = () => {
    if (!currentEditingAttribute || !newAttributeValue.trim()) return;

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

  const handleRemoveAttribute = (attributeId: number) => {
    setProductClone((prev) => ({
      ...prev,
      attributes: prev.attributes.filter(
        (attr) => attr.attributeId !== attributeId,
      ),
      variants: [],
    }));

    if (selectedAttributes[attributeId]) {
      setSelectedAttributes((prev) => {
        const updated = { ...prev };
        delete updated[attributeId];

        return updated;
      });
    }
    toast.info(`Removed attribute`);
  };

  const handleRemoveAttributeValue = (
    e: React.MouseEvent,
    attribute: ProductAttributeDto,
    item: ProductAttributeValueDto,
  ) => {
    e.stopPropagation();
    const updatedAttributes = [...productClone.attributes];
    const attrIndex = updatedAttributes.findIndex(
      (attr) => attr.attributeId === attribute.attributeId,
    );

    if (attrIndex !== -1) {
      if (updatedAttributes[attrIndex].values.length == 1) {
        setTimeout(() => {
          handleRemoveAttribute(updatedAttributes[attrIndex].attributeId);
        }, 0);
      } else {
        updatedAttributes[attrIndex] = {
          ...updatedAttributes[attrIndex],
          values: updatedAttributes[attrIndex].values.filter(
            (val) => val.value !== item.value,
          ),
        };
      }
    }
    setProductClone((prev) => {
      return {
        ...prev,
        attributes: updatedAttributes,
      };
    });

    toast.info(
      `Removed value "${item.value}" from attribute "${attribute.name}"`,
    );
  };

  const openVariantModal = () => {
    setNewVariantPrice('');
    setNewVariantSku('');
    setIsVariantModalOpen(true);
  };

  const closeVariantModal = () => {
    setIsVariantModalOpen(false);
  };

  const handleAddVariant = () => {
    if (!newVariantPrice.trim() || !newVariantSku.trim()) return;

    const newVariant: VariantDto = {
      id: Date.now() % 10000000,
      price: parseFloat(newVariantPrice),
      sku: newVariantSku,
      stock: 0,
      variantAttributes: Object.entries(selectedAttributes).map(
        ([attributeId, value]) => {
          const attribute = productClone.attributes.find(
            (attr) => attr.attributeId === parseInt(attributeId),
          );
          return {
            attributeId: attribute?.attributeId || 0,
            value,
          };
        },
      ),
    };

    setProductClone((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));

    setSelectedVariant(newVariant);

    closeVariantModal();
    toast.success('New variant added successfully');
  };

  const handleVariantSkuChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductClone((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === selectedVariant?.id
          ? { ...variant, sku: e.target.value }
          : variant,
      ),
    }));
  };
  const handleVariantPriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductClone((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === selectedVariant?.id
          ? { ...variant, price: parseFloat(e.target.value) }
          : variant,
      ),
    }));
  };

  const handleRemoveVariant = () => {
    if (!selectedVariant) return;

    setProductClone((prev) => ({
      ...prev,
      variants: prev.variants.filter(
        (variant) => variant.id !== selectedVariant.id,
      ),
    }));

    toast.info('Variant removed successfully');
  };

  const displayProduct = productClone;
  const sortedAttributes = [...displayProduct.attributes].sort(
    (a, b) => a.orderPriority - b.orderPriority,
  );

  return (
    <div className="md:col-span-6">
      <div className="bg-white p-8 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
        {/* Name */}
        <div className="mb-6 flex items-center">
          {isEditMode ? (
            <input
              type="text"
              name="name"
              value={displayProduct.name}
              onChange={handleFormChange}
              className="text-3xl font-bold w-full border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none pb-1 transition-colors duration-300"
              placeholder="Product Name"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">
              {displayProduct.name}
            </h1>
          )}
        </div>

        {/* Inventory */}
        <div className="flex flex-wrap items-center gap-6 mb-6 pb-1 border-b  ">
          <div className="flex items-center w-full">
            <label className="block font-medium text-gray-700 mr-2">
              SKU:{' '}
            </label>
            {isEditMode ? (
              <>
                {isNoneVariantProduct ? (
                  <input
                    type="text"
                    name="sku"
                    value={displayProduct.sku}
                    onChange={handleFormChange}
                    className="p-1 px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="SKU"
                  />
                ) : (
                  <>
                    {selectedVariant !== null ? (
                      <div className="flex justify-between items-center w-full">
                        <input
                          type="text"
                          name="variant-sku"
                          value={selectedVariant?.sku || ''}
                          onChange={handleVariantSkuChange}
                          className="p-1 px-2 border grow border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
                          placeholder="SKU"
                        />
                        <button
                          onClick={handleRemoveVariant}
                          className="ml-3 px-4 py-1 border border-gray-300 shadow-sm bg-white hover:border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 flex items-center"
                        >
                          Remove Variant
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <span>This combination has no variant</span>
                        <button
                          onClick={() => {
                            openVariantModal();
                            setNewVariantSku(
                              toVariantSku(
                                productClone.sku,
                                Object.values(selectedAttributes),
                              ),
                            );
                          }}
                          className="px-4 py-1 bg-white shadow-sm border border-gray-300 text-blue-600 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        >
                          Add Variant
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="flex justify-between w-full gap-2 items-center">
                {isNoneVariantProduct ? (
                  <span className="text-gray-800 font-semibold">
                    {displayProduct.sku}
                  </span>
                ) : (
                  <span className="text-gray-800 font-semibold">
                    {selectedVariant?.sku ?? 'This combination has no variant'}
                  </span>
                )}

                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <span className="font-medium text-blue-700">
                    {displayProduct.sold}
                  </span>
                  <span className="text-blue-600 ml-1">items sold</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-1">
                    Stock:{' '}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      (selectedVariant
                        ? selectedVariant.stock
                        : displayProduct.stock) > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {selectedVariant
                      ? selectedVariant.stock
                      : displayProduct.stock}{' '}
                    {(selectedVariant
                      ? selectedVariant.stock
                      : displayProduct.stock) === 1
                      ? 'item'
                      : 'items'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rating */}
        {!isEditMode && (
          <div className="flex items-center mb-6 rounded-lg">
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
            <span className="ml-3 text-gray-600 font-medium">
              {displayProduct.rating}{' '}
              <span className="text-gray-500">
                ({displayProduct.ratingCount} reviews)
              </span>
            </span>
          </div>
        )}

        {/* Price  */}
        <div className="mb-8 rounded-r-lg w-full">
          {isEditMode ? (
            <div className="flex items-center w-full">
              {selectedVariant ? (
                <div className="flex items-center w-full border-blue-300 border-b-2 ">
                  <label
                    htmlFor="price"
                    className="text-3xl font-bold text-blue-600 mr-2"
                  >
                    $
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={selectedVariant.price}
                    onChange={handleVariantPriceChange}
                    step="0.01"
                    min="0"
                    className="text-3xl font-bold text-blue-600 w-full px-2  focus:border-blue-500 focus:outline-none bg-transparent transition-all duration-300"
                  />
                </div>
              ) : (
                <>
                  {!isNoneVariantProduct ? (
                    <div className="flex items-center gap-4 border-b-2">
                      <div className="text-3xl font-medium text-gray-500">
                        $
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center  border-b-2 border-blue-300 w-full">
                      <span className="text-3xl font-bold text-blue-600 mr-2">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={displayProduct.price}
                        onChange={handleFormChange}
                        step="0.01"
                        min="0"
                        className="text-3xl font-bold grow text-blue-600 focus:border-blue-500 focus:outline-none bg-transparent transition-all duration-300"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {!selectedVariant ? (
                <>
                  {isNoneVariantProduct ? (
                    <div className="text-3xl font-bold text-blue-600">
                      ${displayProduct.price}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-600">$</div>
                  )}
                </>
              ) : (
                <div className="text-3xl font-bold text-blue-600">
                  ${selectedVariant?.price}
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-8 mb-8">
          {sortedAttributes.map((attribute) => {
            return (
              <div
                key={attribute.name}
                className=" bg-white hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800 text-lg">
                    {attribute.name}
                  </h3>
                  {isEditMode && (
                    <button
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                      onClick={() =>
                        handleRemoveAttribute(attribute.attributeId)
                      }
                      title="Remove attribute"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex gap-4 flex-wrap">
                  {attribute.values.map((item) => (
                    <button
                      key={item.value}
                      className={`border rounded-lg flex gap-4 items-center h-12 min-w-12 p-2 relative transition-all duration-200 ${
                        selectedAttributes[attribute.attributeId] === item.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      } ${isEditMode ? 'group' : ''}`}
                      onClick={() =>
                        handleAttributeSelect(attribute.attributeId, item.value)
                      }
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl || '/api/placeholder/20/20'}
                          alt={item.value}
                          className="inline-block w-auto h-full aspect-square object-cover rounded"
                        />
                      )}
                      <span className="font-medium">{item.value}</span>
                      {isEditMode && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                            onClick={(e) =>
                              handleRemoveAttributeValue(e, attribute, item)
                            }
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
                      className="h-12 w-12 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
                      onClick={() => {
                        const attributeToEdit =
                          sortedAttributes[sortedAttributes.indexOf(attribute)];
                        openAttributeValueModal(attributeToEdit);
                      }}
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {!displayProduct.attributes.find((x) => x.isPrimary) && (
              <button
                className="px-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
                onClick={() => openAttributeModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
              className="px-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
              onClick={() => openAttributeModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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

        {isEditMode && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={displayProduct.description}
              onChange={(e) => {
                handleFormChange(e);
                setDescription(e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
              rows={4}
              placeholder="Enter product description..."
            ></textarea>
          </div>
        )}

        {isEditMode && (
          <button
            onClick={saveChanges}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center transition-colors duration-300 shadow-md hover:shadow-lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
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

        {isAttributeValueModalOpen && currentEditingAttribute && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800">
                  Add Value to "{currentEditingAttribute.name}"
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="text"
                    value={newAttributeValue}
                    onChange={(e) => setNewAttributeValue(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter attribute value"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddNewAttributeValue();
                      }
                    }}
                  />
                </div>

                {currentEditingAttribute.isPrimary && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Image
                    </label>
                    <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {displayProduct.images.map((img) => (
                        <div
                          key={img.imageUrl}
                          onClick={() => setSelectedImageUrl(img.imageUrl)}
                          className={`border p-1 rounded-lg cursor-pointer transform transition-all duration-200 ${
                            selectedImageUrl === img.imageUrl
                              ? 'border-blue-600 ring-2 ring-blue-300 scale-105'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          <img
                            src={img.imageUrl}
                            alt="Option"
                            className="w-full object-cover rounded-md aspect-square"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeAttributeValueModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewAttributeValue}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                    disabled={
                      !newAttributeValue.trim() ||
                      (currentEditingAttribute.isPrimary && !selectedImageUrl)
                    }
                  >
                    Add Value
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isVariantModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800">
                  Add New Variant
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant for:
                  </label>
                  <div className="text-blue-600">
                    {Object.entries(selectedAttributes)
                      .map(([attrId, value]) => {
                        const attribute = displayProduct.attributes.find(
                          (attr) => attr.attributeId === Number(attrId),
                        );
                        return attribute ? `${attribute.name}: ${value}` : '';
                      })
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newVariantPrice}
                    onChange={(e) => setNewVariantPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={newVariantSku}
                    onChange={(e) => setNewVariantSku(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter SKU"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeVariantModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVariant}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm disabled:bg-blue-300"
                    disabled={!newVariantPrice.trim() || !newVariantSku.trim()}
                  >
                    Add Variant
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
