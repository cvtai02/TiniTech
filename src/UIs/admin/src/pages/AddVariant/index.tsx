import React, { useState, useEffect } from 'react';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  image?: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface AttributeValue {
  id: string;
  value: string;
}

interface SelectedAttribute {
  attributeId: string;
  valueId: string;
}

const AddProductVariantPage: React.FC = () => {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    SelectedAttribute[]
  >([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [showAddAttributeForm, setShowAddAttributeForm] = useState(false);
  const [newValueInputs, setNewValueInputs] = useState<{
    [key: string]: string;
  }>({});
  const [showNewValueInputs, setShowNewValueInputs] = useState<{
    [key: string]: boolean;
  }>({});
  const [variantPrice, setVariantPrice] = useState('');
  const [variantSku, setVariantSku] = useState('');
  const [variantStock, setVariantStock] = useState('');

  // Fetch recent products and attributes from cookies/localStorage or API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          // Dummy data for demonstration
          const dummyProducts: Product[] = [
            {
              id: '1',
              name: 'iPhone 14 Pro',
              slug: 'iphone-14-pro',
              brand: 'Apple',
              image: '/api/placeholder/80/80',
            },
            {
              id: '2',
              name: 'Galaxy S23',
              slug: 'galaxy-s23',
              brand: 'Samsung',
              image: '/api/placeholder/80/80',
            },
            {
              id: '3',
              name: 'MacBook Air M2',
              slug: 'macbook-air-m2',
              brand: 'Apple',
              image: '/api/placeholder/80/80',
            },
            {
              id: '4',
              name: 'Sony WH-1000XM5',
              slug: 'sony-wh-1000xm5',
              brand: 'Sony',
              image: '/api/placeholder/80/80',
            },
            {
              id: '5',
              name: 'iPad Pro 12.9',
              slug: 'ipad-pro-12-9',
              brand: 'Apple',
              image: '/api/placeholder/80/80',
            },
          ];

          const dummyAttributes: Attribute[] = [
            {
              id: '1',
              name: 'Color',
              values: [
                { id: '101', value: 'Black' },
                { id: '102', value: 'White' },
                { id: '103', value: 'Silver' },
                { id: '104', value: 'Gold' },
              ],
            },
            {
              id: '2',
              name: 'Storage',
              values: [
                { id: '201', value: '128GB' },
                { id: '202', value: '256GB' },
                { id: '203', value: '512GB' },
                { id: '204', value: '1TB' },
              ],
            },
            {
              id: '3',
              name: 'Size',
              values: [
                { id: '301', value: 'Small' },
                { id: '302', value: 'Medium' },
                { id: '303', value: 'Large' },
                { id: '304', value: 'X-Large' },
              ],
            },
          ];

          setProducts(dummyProducts);
          setFilteredProducts(dummyProducts);
          setAttributes(dummyAttributes);

          // Initialize show new value input states
          const initialShowStates: { [key: string]: boolean } = {};
          dummyAttributes.forEach((attr) => {
            initialShowStates[attr.id] = false;
          });
          setShowNewValueInputs(initialShowStates);

          // Initialize new value inputs
          const initialValueInputs: { [key: string]: string } = {};
          dummyAttributes.forEach((attr) => {
            initialValueInputs[attr.id] = '';
          });
          setNewValueInputs(initialValueInputs);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Check for recently viewed products in localStorage
    const getRecentProducts = () => {
      try {
        const recentProductsJson = localStorage.getItem('recentProducts');
        if (recentProductsJson) {
          const recentProducts = JSON.parse(recentProductsJson);
          // You could use this data to highlight or suggest products
          console.log('Recent products:', recentProducts);
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    };

    getRecentProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);

    // Store in recent products (localStorage)
    try {
      let recentProducts: string[] = [];
      const existingJson = localStorage.getItem('recentProducts');

      if (existingJson) {
        recentProducts = JSON.parse(existingJson);
      }

      // Add to beginning and ensure no duplicates
      recentProducts = [
        productId,
        ...recentProducts.filter((id) => id !== productId),
      ].slice(0, 5);
      localStorage.setItem('recentProducts', JSON.stringify(recentProducts));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  // Handle attribute value selection
  const handleAttributeValueChange = (attributeId: string, valueId: string) => {
    // Check if we already have this attribute in our selections
    const existingIndex = selectedAttributes.findIndex(
      (attr) => attr.attributeId === attributeId,
    );

    if (existingIndex > -1) {
      // Update existing attribute value
      const updatedAttributes = [...selectedAttributes];
      updatedAttributes[existingIndex] = { attributeId, valueId };
      setSelectedAttributes(updatedAttributes);
    } else {
      // Add new attribute value
      setSelectedAttributes([...selectedAttributes, { attributeId, valueId }]);
    }
  };

  // Add new attribute
  const handleAddAttribute = () => {
    if (!newAttributeName.trim()) return;

    const newAttributeId = `new-${Date.now()}`;
    const newAttribute: Attribute = {
      id: newAttributeId,
      name: newAttributeName,
      values: [],
    };

    setAttributes([...attributes, newAttribute]);
    setNewAttributeName('');
    setShowAddAttributeForm(false);

    // Update state for new value inputs
    setNewValueInputs({
      ...newValueInputs,
      [newAttributeId]: '',
    });

    setShowNewValueInputs({
      ...showNewValueInputs,
      [newAttributeId]: false,
    });
  };

  // Toggle new value input field
  const toggleNewValueInput = (attributeId: string) => {
    setShowNewValueInputs({
      ...showNewValueInputs,
      [attributeId]: !showNewValueInputs[attributeId],
    });
  };

  // Handle new value input change
  const handleNewValueInputChange = (attributeId: string, value: string) => {
    setNewValueInputs({
      ...newValueInputs,
      [attributeId]: value,
    });
  };

  // Add new value to attribute
  const handleAddValue = (attributeId: string) => {
    const value = newValueInputs[attributeId];
    if (!value.trim()) return;

    const updatedAttributes = attributes.map((attr) => {
      if (attr.id === attributeId) {
        return {
          ...attr,
          values: [
            ...attr.values,
            {
              id: `value-${Date.now()}`,
              value: value.trim(),
            },
          ],
        };
      }
      return attr;
    });

    setAttributes(updatedAttributes);

    // Reset input
    setNewValueInputs({
      ...newValueInputs,
      [attributeId]: '',
    });

    // Hide input field
    setShowNewValueInputs({
      ...showNewValueInputs,
      [attributeId]: false,
    });
  };

  // Get selected product details
  const getSelectedProduct = () => {
    return products.find((product) => product.id === selectedProductId);
  };

  // Submit form to create variant
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const variantData = {
      productId: selectedProductId,
      attributes: selectedAttributes,
      price: variantPrice,
      sku: variantSku,
      stock: variantStock,
    };

    console.log('Submitting variant data:', variantData);
    // Implement your API call to create the variant here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const selectedProduct = getSelectedProduct();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add Product Variant</h1>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* Product Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
              Select Product
            </h2>

            {/* Search Bar */}
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="product-search"
              >
                Search Products
              </label>
              <input
                type="text"
                id="product-search"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name, slug, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Product Listing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProductId === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleProductSelect(product.id)}
                >
                  <div className="flex items-center">
                    {product.image && (
                      <div className="mr-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.brand} •{' '}
                        <span className="text-gray-400">{product.slug}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No products found matching your search.
              </div>
            )}
          </div>

          {selectedProductId && (
            <>
              {/* Attributes Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Attributes & Values</h2>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() =>
                      setShowAddAttributeForm(!showAddAttributeForm)
                    }
                  >
                    {showAddAttributeForm ? 'Cancel' : '+ Add New Attribute'}
                  </button>
                </div>

                {/* Add New Attribute Form */}
                {showAddAttributeForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="new-attribute"
                    >
                      New Attribute Name
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="new-attribute"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Material, Pattern, Edition..."
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                        onClick={handleAddAttribute}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Attributes and Values */}
                {attributes.length > 0 ? (
                  <div className="space-y-6">
                    {attributes.map((attribute) => (
                      <div
                        key={attribute.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-800">
                            {attribute.name}
                          </h3>
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            onClick={() => toggleNewValueInput(attribute.id)}
                          >
                            {showNewValueInputs[attribute.id]
                              ? 'Cancel'
                              : '+ Add Value'}
                          </button>
                        </div>

                        {/* Add new value form */}
                        {showNewValueInputs[attribute.id] && (
                          <div className="mb-3 flex">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`New ${attribute.name} value...`}
                              value={newValueInputs[attribute.id] || ''}
                              onChange={(e) =>
                                handleNewValueInputChange(
                                  attribute.id,
                                  e.target.value,
                                )
                              }
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-blue-600 text-white rounded-r text-sm hover:bg-blue-700"
                              onClick={() => handleAddValue(attribute.id)}
                            >
                              Add
                            </button>
                          </div>
                        )}

                        {/* Values selection */}
                        <div className="flex flex-wrap gap-2">
                          {attribute.values.map((value) => {
                            const isSelected = selectedAttributes.some(
                              (attr) =>
                                attr.attributeId === attribute.id &&
                                attr.valueId === value.id,
                            );
                            return (
                              <button
                                key={value.id}
                                type="button"
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                                onClick={() =>
                                  handleAttributeValueChange(
                                    attribute.id,
                                    value.id,
                                  )
                                }
                              >
                                {value.value}
                              </button>
                            );
                          })}

                          {attribute.values.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                              No values yet. Add some to create variants.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No attributes found. Add some to create variants.
                  </div>
                )}
              </div>

              {/* Variant Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
                  Variant Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="variant-price"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id="variant-price"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={variantPrice}
                      onChange={(e) => setVariantPrice(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="variant-sku"
                    >
                      SKU
                    </label>
                    <input
                      type="text"
                      id="variant-sku"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Stock Keeping Unit"
                      value={variantSku}
                      onChange={(e) => setVariantSku(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="variant-stock"
                    >
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="variant-stock"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      value={variantStock}
                      onChange={(e) => setVariantStock(e.target.value)}
                      min="0"
                      step="1"
                    />
                  </div>
                </div>
              </div>

              {/* Summary and Submit */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Variant Summary</h3>
                <div className="text-sm">
                  <p className="mb-1">
                    <span className="font-medium">Product:</span>{' '}
                    {selectedProduct?.name}
                  </p>
                  {selectedAttributes.length > 0 && (
                    <p className="mb-1">
                      <span className="font-medium">Attributes:</span>{' '}
                      {selectedAttributes
                        .map((attr) => {
                          const attribute = attributes.find(
                            (a) => a.id === attr.attributeId,
                          );
                          const value = attribute?.values.find(
                            (v) => v.id === attr.valueId,
                          );
                          return `${attribute?.name}: ${value?.value}`;
                        })
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={
                    !selectedProductId || selectedAttributes.length === 0
                  }
                >
                  Create Variant
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProductVariantPage;
