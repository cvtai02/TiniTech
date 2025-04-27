import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ProductAttributeDto, ProductAttributeValueDto } from '../../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttributesFn, createAttributeFn } from '../../services/attribute';
import { toast } from 'react-toastify';

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttribute: (attribute: ProductAttributeDto) => void;
  imageUrls?: string[];
}

const AttributeModal: React.FC<AttributeModalProps> = ({
  isOpen,
  onClose,
  onAddAttribute,
  imageUrls,
}) => {
  const queryClient = useQueryClient();
  const [attributeName, setAttributeName] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [attributeValues, setAttributeValues] = useState<
    ProductAttributeValueDto[]
  >([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Query for fetching attributes
  const {
    data: existingAttributes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['attributes'],
    queryFn: getAttributesFn,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mutation for creating new attribute
  const createAttributeMutation = useMutation({
    mutationFn: createAttributeFn,
    onSuccess: () => {
      // Invalidate and refetch attributes after creating a new one
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      setIsCreatingNew(false);
    },
    onError: (err) => {
      console.error('Error creating attribute:', err);
    },
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setAttributeName('');
      setAttributeValue('');
      setAttributeValues([]);
      setSelectedAttributeId(0);
      setIsCreatingNew(false);

      // Automatically select the first image if available
      if (imageUrls && imageUrls.length > 0) {
        setSelectedImage(imageUrls[0]);
      } else {
        setSelectedImage(null);
      }
    }
  }, [isOpen, imageUrls]);

  // Update fields when an existing attribute is selected
  useEffect(() => {
    if (selectedAttributeId) {
      const selected = existingAttributes.find(
        (attr) => attr.id == selectedAttributeId,
      );
      if (selected) {
        setAttributeName(selected.name);
      }
    }
  }, [selectedAttributeId, existingAttributes]);

  const handleSelectExistingAttribute = (attributeId: string) => {
    const id = parseInt(attributeId, 10);
    setSelectedAttributeId(id);
  };

  const handleCreateNewAttribute = () => {
    setAttributeName('');
    setSelectedAttributeId(0);
    setAttributeValues([]);
    setIsCreatingNew(true);
  };

  const handleSaveNewAttribute = async () => {
    if (!attributeName.trim()) return;

    await createAttributeMutation.mutateAsync({ name: attributeName.trim() });

    // Find the newly created attribute and select it
    const refreshedAttributes = await queryClient.fetchQuery({
      queryKey: ['attributes'],
      queryFn: getAttributesFn,
    });

    const newAttr = refreshedAttributes.find(
      (attr) => attr.name === attributeName.trim(),
    );

    if (newAttr) {
      setSelectedAttributeId(newAttr.id);
    }
  };

  // Updated to directly set the selected image
  const handleImageSelection = (imageUrl: string) => {
    // Toggle selection - if already selected, deselect it
    setSelectedImage(imageUrl);
  };

  // Updated to add both image and value
  const addValue = () => {
    if (attributeValue.trim() || selectedImage) {
      // Check if this value already exists - only checking the text value
      const isDuplicate = attributeValues.some(
        (item) => item.value === attributeValue.trim(),
      );

      if (!isDuplicate) {
        setAttributeValues((prev) => [
          ...prev,
          {
            value: attributeValue.trim(),
            imageUrl: selectedImage || undefined,
          },
        ]);
        setAttributeValue('');
        setSelectedImage(imageUrls ? imageUrls[0] : null); // Reset to first image if available
      } else {
        // Provide feedback about duplicate
        toast.warn('This attribute value text has already been added.');
      }
    }
  };

  const removeValue = (index: number) => {
    setAttributeValues((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setAttributeName('');
    setAttributeValue('');
    setAttributeValues([]);
    setSelectedAttributeId(0);
    setIsCreatingNew(false);
    setSelectedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-lg max-h-screen overflow-auto shadow-xl w-full max-w-md transform transition-all duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {imageUrls ? 'Add Primary Attribute' : 'Add Attribute'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {isLoading && (
            <p className="text-base text-center text-gray-600 animate-pulse">
              Loading...
            </p>
          )}
          {error && (
            <p className="text-base text-red-500 text-center mb-3 font-medium">
              Failed to load attributes
            </p>
          )}
          {createAttributeMutation.isError && (
            <p className="text-base text-red-500 text-center mb-3 font-medium">
              Failed to create attribute
            </p>
          )}

          <form className="space-y-4">
            <div>
              {existingAttributes.length > 0 && (
                <div className="mb-4">
                  <div className="flex border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(false)}
                      className={`py-2 px-4 text-sm font-medium transition-colors ${
                        !isCreatingNew
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Select Existing Attribute
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateNewAttribute}
                      className={`py-2 px-4 text-sm font-medium transition-colors ${
                        isCreatingNew
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Create New Attribute
                    </button>
                  </div>
                </div>
              )}

              {!(existingAttributes.length > 0) && (
                <button
                  type="button"
                  onClick={handleCreateNewAttribute}
                  className="w-full py-2 text-sm rounded-lg font-medium transition-colors bg-blue-600 text-white mb-4"
                >
                  Create New Attribute
                </button>
              )}

              {!isCreatingNew && existingAttributes.length > 0 && (
                <>
                  <label className="flex">
                    <label className="block border-b font-medium text-gray-700 mb-1">
                      Attribute
                    </label>
                  </label>
                  <select
                    value={selectedAttributeId}
                    onChange={(e) =>
                      handleSelectExistingAttribute(e.target.value)
                    }
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select one</option>
                    {existingAttributes.map((attr, index) => (
                      <option key={index} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {isCreatingNew && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Attribute Name
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={attributeName}
                      onChange={(e) => setAttributeName(e.target.value)}
                      className="flex-1 p-2 text-sm border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Color, Size, Material"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNewAttribute}
                      disabled={
                        !attributeName.trim() ||
                        createAttributeMutation.isPending
                      }
                      className="bg-green-600 text-white px-3 py-2 text-sm rounded-r-lg hover:bg-green-700 disabled:bg-gray-300 transition"
                    >
                      {createAttributeMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!isCreatingNew && (
              <>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold mb-2 border-b text-gray-800">
                      Values {selectedAttributeId ? `for ${attributeName}` : ''}
                    </span>
                  </div>

                  {/* Display image grid if we have images */}
                  {imageUrls && imageUrls.length > 0 && (
                    <div className="mb-2 border-gray-200">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-semibold text-gray-800 ">
                          Image for value
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        {imageUrls.map((img, index) => (
                          <div
                            key={index}
                            onClick={() => handleImageSelection(img)}
                            className={`border p-1 rounded-lg cursor-pointer transform transition-all duration-200 ${
                              selectedImage === img
                                ? 'border-blue-600 ring-2 ring-blue-300 scale-105 shadow-md'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <img
                              src={img}
                              alt="Option"
                              className="w-full object-cover rounded-md aspect-square"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-semibold text-gray-800 ">
                      Value
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                      disabled={!selectedAttributeId}
                      className="flex-1 p-2 text-sm border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                      placeholder={
                        selectedAttributeId
                          ? 'e.g. Red, Blue, Large'
                          : 'Select an attribute first'
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addValue}
                    disabled={!selectedAttributeId || !attributeValue.trim()}
                    className="bg-blue-600  text-white px-3 py-2 text-sm rounded-lg mt-4 w-full hover:bg-blue-700 disabled:bg-gray-300 transition"
                  >
                    Add
                  </button>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Added Values:
                  </label>
                  <div className="flex flex-wrap gap-3 p-2 bg-gray-50 rounded-lg min-h-[50px]">
                    {attributeValues.map((value, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-100 px-3 py-2 rounded-full flex items-center text-sm shadow-sm hover:bg-blue-100 transition-colors"
                      >
                        {value.imageUrl && (
                          <img
                            src={value.imageUrl}
                            alt="Attribute"
                            className="h-6 w-6 mr-2 object-cover rounded-full border border-blue-200"
                          />
                        )}
                        <span className="font-medium text-gray-700">
                          {value.value}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeValue(index)}
                          className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 mt-4 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              {!isCreatingNew && (
                <button
                  type="button"
                  onClick={() => {
                    if (attributeValues.length > 0 && selectedAttributeId) {
                      const attributeToAdd: ProductAttributeDto = {
                        attributeId: selectedAttributeId,
                        name: attributeName,
                        values: attributeValues,
                        isPrimary: imageUrls ? true : false,
                        orderPriority: 0,
                      };
                      console.log('Adding attribute:', attributeToAdd);
                      onAddAttribute(attributeToAdd);
                      resetForm();
                    }
                  }}
                  className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                  disabled={
                    !selectedAttributeId || attributeValues.length === 0
                  }
                >
                  Add Attribute
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttributeModal;
