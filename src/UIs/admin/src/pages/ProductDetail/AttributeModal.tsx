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
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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
      setSelectedAttributeId('');
      setIsCreatingNew(false);
      setSelectedImage(null);
    }
  }, [isOpen]);

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
    setSelectedAttributeId(attributeId);
  };

  const handleCreateNewAttribute = () => {
    setAttributeName('');
    setSelectedAttributeId('');
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

  // Updated to set the selected image instead of directly adding it to values
  const handleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(false);
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
        setSelectedImage(null);
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
    setSelectedAttributeId('');
    setIsCreatingNew(false);
    setSelectedImage(null);
    onClose();
  };

  const ImageSelectionModal = () => {
    if (!isImageModalOpen || !imageUrls || imageUrls.length === 0) return null;

    return (
      <div className=" fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300}>">
        <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Select an Image
            </h3>
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative border rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleImageSelection(url)}
              >
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-36 object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              className="px-5 py-2 text-lg border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Add Attribute
          </h2>
          <button
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {isLoading && (
          <p className="text-xl text-center text-gray-600 animate-pulse">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-xl text-red-500 text-center mb-4 font-medium">
            Failed to load attributes
          </p>
        )}
        {createAttributeMutation.isError && (
          <p className="text-xl text-red-500 text-center mb-4 font-medium">
            Failed to create attribute
          </p>
        )}

        <form className="space-y-6">
          <div>
            <div className="flex space-x-3 mb-4">
              {existingAttributes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className={`flex-1 py-3 text-lg rounded-lg font-medium transition-colors ${
                    !isCreatingNew
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Select Existing
                </button>
              )}
              <button
                type="button"
                onClick={handleCreateNewAttribute}
                className={`flex-1 py-3 text-lg rounded-lg font-medium transition-colors ${
                  isCreatingNew
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Create New
              </button>
            </div>

            {!isCreatingNew && existingAttributes.length > 0 && (
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Select Attribute
                </label>
                <select
                  value={selectedAttributeId}
                  onChange={(e) =>
                    handleSelectExistingAttribute(e.target.value)
                  }
                  className="w-full p-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select an attribute --</option>
                  {existingAttributes.map((attr, index) => (
                    <option key={index} value={attr.id}>
                      {attr.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isCreatingNew && (
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  New Attribute Name
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={attributeName}
                    onChange={(e) => setAttributeName(e.target.value)}
                    className="flex-1 p-3 text-lg border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Color, Size, Material"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNewAttribute}
                    disabled={
                      !attributeName.trim() || createAttributeMutation.isPending
                    }
                    className="bg-green-600 text-white px-4 py-3 text-lg rounded-r-lg hover:bg-green-700 disabled:bg-gray-300 transition"
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
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Attribute Values{' '}
                  {selectedAttributeId ? `for ${attributeName}` : ''}
                </label>

                <div className="flex gap-2">
                  {imageUrls && !selectedImage && (
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-400 transition"
                      onClick={() => {
                        if (imageUrls) {
                          setIsImageModalOpen(true);
                        }
                      }}
                      disabled={!selectedAttributeId}
                    >
                      <span className="text-lg">Add images</span>
                    </button>
                  )}

                  {selectedImage && (
                    <div className="flex items-center">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="h-10 w-10 object-cover rounded mr-2"
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setSelectedImage(null)}
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={attributeValue}
                    onChange={(e) => setAttributeValue(e.target.value)}
                    disabled={!selectedAttributeId}
                    className="flex-1 p-3 text-lg border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    placeholder={
                      selectedAttributeId
                        ? 'e.g. Red, Blue, Large'
                        : 'Select an attribute first'
                    }
                  />
                  <button
                    type="button"
                    onClick={addValue}
                    disabled={!selectedAttributeId || !attributeValue.trim()}
                    className="bg-blue-600 text-white px-4 py-3 text-lg rounded-r-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Added Values:
                </label>
                <div className="flex flex-wrap gap-2">
                  {attributeValues.map((value, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-3 py-2 rounded-full flex items-center text-base"
                    >
                      {value.imageUrl && (
                        <img
                          src={value.imageUrl}
                          alt="Attribute"
                          className="h-6 w-6 mr-2 object-cover rounded"
                        />
                      )}
                      <span>{value.value}</span>
                      <button
                        type="button"
                        onClick={() => removeValue(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 text-lg border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
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
                className="px-5 py-2 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                disabled={!selectedAttributeId || attributeValues.length === 0}
              >
                Add Attribute
              </button>
            )}
          </div>
        </form>
      </div>

      <ImageSelectionModal />
    </div>
  );
};

export default AttributeModal;
