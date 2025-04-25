import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttribute: (attributeName: string, attributeValues: string[]) => void;
}

const AttributeModal: React.FC<AttributeModalProps> = ({
  isOpen,
  onClose,
  onAddAttribute,
}) => {
  const [attributeName, setAttributeName] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [attributeValues, setAttributeValues] = useState<string[]>([]);

  const addValue = () => {
    if (attributeValue.trim()) {
      setAttributeValues((prev) => [...prev, attributeValue.trim()]);
      setAttributeValue('');
    }
  };

  const removeValue = (index: number) => {
    setAttributeValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attributeName.trim() && attributeValues.length > 0) {
      onAddAttribute(attributeName, attributeValues);
      resetForm();
    }
  };

  const resetForm = () => {
    setAttributeName('');
    setAttributeValue('');
    setAttributeValues([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Attribute</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attribute Name
            </label>
            <input
              type="text"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. Color, Size, Material"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attribute Values
            </label>
            <div className="flex">
              <input
                type="text"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l"
                placeholder="e.g. Red, Blue, Large"
              />
              <button
                type="button"
                onClick={addValue}
                className="bg-blue-600 text-white px-4 py-2 rounded-r"
              >
                Add
              </button>
            </div>
          </div>

          {attributeValues.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Added Values:
              </label>
              <div className="flex flex-wrap gap-2">
                {attributeValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{value}</span>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="ml-2 text-red-500"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={!attributeName.trim() || attributeValues.length === 0}
            >
              Add Attribute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttributeModal;
