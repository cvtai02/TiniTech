import React, { useState, useEffect, ChangeEvent } from 'react';
import { toSlug } from '../../utils/to-slug';

// Types
interface Category {
  id: string;
  name: string;
}

interface Attribute {
  id: string;
  name: string;
}

const AddProductPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    slug: '',
    description: '',
    categoryId: '',
    primaryAttributeId: '',
    selectedAttributes: [] as string[],
    defaultImage: null as File | null,
  });

  // Options for select fields
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Generate slug from product name
    if (formData.name) {
      const slug = toSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name]);

  useEffect(() => {
    // Fetch categories and attributes
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        setTimeout(() => {
          const dummyCategories: Category[] = [
            { id: '1', name: 'Electronics' },
            { id: '2', name: 'Clothing' },
            { id: '3', name: 'Home & Garden' },
            { id: '4', name: 'Books' },
            { id: '5', name: 'Toys' },
          ];

          const dummyAttributes: Attribute[] = [
            { id: '1', name: 'Color' },
            { id: '2', name: 'Size' },
            { id: '3', name: 'Material' },
            { id: '4', name: 'Weight' },
            { id: '5', name: 'Capacity' },
          ];

          setCategories(dummyCategories);
          setAttributes(dummyAttributes);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const attributeId = e.target.value;
    if (attributeId && !formData.selectedAttributes.includes(attributeId)) {
      setFormData((prev) => ({
        ...prev,
        selectedAttributes: [...prev.selectedAttributes, attributeId],
      }));
    }
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAttributes: prev.selectedAttributes.filter(
        (id) => id !== attributeId,
      ),
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, defaultImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data submitted:', formData);
    // Implementation for form submission
    // You would typically send this data to your API
  };

  const getAttributeNameById = (id: string) => {
    return attributes.find((attr) => attr.id === id)?.name || '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="category"
                >
                  Category*
                </label>
                <select
                  id="category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Attributes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
              Product Attributes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="primaryAttribute"
                >
                  Primary Attribute
                </label>
                <select
                  id="primaryAttribute"
                  name="primaryAttributeId"
                  value={formData.primaryAttributeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select primary attribute</option>
                  {attributes.map((attribute) => (
                    <option key={attribute.id} value={attribute.id}>
                      {attribute.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  This will be the main attribute for product variants
                </p>
              </div>
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="otherAttributes"
                >
                  Other Attributes
                </label>
                <select
                  id="otherAttributes"
                  name="otherAttributes"
                  onChange={handleAttributeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Add another attribute</option>
                  {attributes
                    .filter(
                      (attr) =>
                        attr.id !== formData.primaryAttributeId &&
                        !formData.selectedAttributes.includes(attr.id),
                    )
                    .map((attribute) => (
                      <option key={attribute.id} value={attribute.id}>
                        {attribute.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Selected attributes tags */}
            {formData.selectedAttributes.length > 0 && (
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Selected Attributes
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedAttributes.map((attrId) => (
                    <span
                      key={attrId}
                      className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1"
                    >
                      {getAttributeNameById(attrId)}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attrId)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
              Default Image
            </h2>
            <div className="flex items-start space-x-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Product Image
                </label>
                <div className="flex items-center">
                  <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-gray-300 border-dashed rounded cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {!imagePreview ? (
                        <>
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or WEBP (max. 2MB)
                          </p>
                        </>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium mb-2">
                  Image Guidelines
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Use high-quality images (at least 800x800 pixels)</li>
                  <li>Use a white or transparent background</li>
                  <li>Show the product clearly without any text overlays</li>
                  <li>Maximum file size: 2MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
