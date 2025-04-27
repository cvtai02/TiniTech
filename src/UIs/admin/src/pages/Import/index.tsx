// ImportProductPage.tsx
import React, { useState } from 'react';
import {
  FaSave,
  FaPaperPlane,
  FaPlus,
  FaTrash,
  FaSearch,
} from 'react-icons/fa';
import ProductSearch from '../../components/products/ProductSearching';
import { ProductBriefDto } from '../../types/product';

// Define proper interfaces
interface ProductVariant {
  id: number;
  name: string;
}

interface Product extends ProductBriefDto {
  variants: ProductVariant[];
}

interface ImportItem {
  id: number;
  productId: string;
  productName: string;
  variantId: number;
  variantName: string;
  quantity: number;
  unitCost: number;
}

const ImportProductPage: React.FC = () => {
  // Empty products array using proper types
  const products: Product[] = [];

  // State variables
  const [importNumber, setImportNumber] = useState<string>('IMP-2025-0042');
  const [importDate, setImportDate] = useState<string>('2025-04-25');
  const [importItems, setImportItems] = useState<ImportItem[]>([]); // Empty initial items
  const [selectedProductId, setSelectedProductId] = useState<string | ''>('');
  const [selectedProductName, setSelectedProductName] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unitCost, setUnitCost] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Get product variants based on selected product
  const getVariantsForSelectedProduct = () => {
    if (selectedProductId === '') return [];
    const product = products.find((p) => p.id === selectedProductId);
    return product ? product.variants : [];
  };

  // Handle product selection from the modal
  const handleProductSelect = (product: ProductBriefDto) => {
    setSelectedProductId(product.id);
    setSelectedProductName(product.name);
    setIsModalOpen(false);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalQuantity = importItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalCost = importItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
    return { totalQuantity, totalCost };
  };

  // Add a new product to the import list
  const handleAddProduct = () => {
    if (
      selectedProductId === '' ||
      selectedVariantId === '' ||
      !quantity ||
      !unitCost
    ) {
      alert('Please fill in all fields');
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);
    const selectedVariant = selectedProduct?.variants.find(
      (v) => v.id === selectedVariantId,
    );

    if (!selectedProduct || !selectedVariant) return;

    const newItem: ImportItem = {
      id: Math.max(0, ...importItems.map((item) => item.id)) + 1,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      quantity: parseInt(quantity),
      unitCost: parseFloat(unitCost),
    };

    setImportItems([...importItems, newItem]);

    // Reset form
    setSelectedProductId('');
    setSelectedProductName('');
    setSelectedVariantId('');
    setQuantity('1');
    setUnitCost('');
  };

  // Remove an item from the import list
  const handleRemoveItem = (id: number) => {
    setImportItems(importItems.filter((item) => item.id !== id));
  };

  // Format number to currency
  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  const { totalQuantity, totalCost } = calculateTotals();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Goods Receipt Note
        </h1>
        {/* Form Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label
              htmlFor="import-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number:
            </label>
            <input
              type="text"
              id="import-number"
              value={importNumber}
              onChange={(e) => setImportNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="import-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date:
            </label>
            <input
              type="date"
              id="import-date"
              value={importDate}
              onChange={(e) => setImportDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-gray-50 p-6 rounded-md mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Add Product
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product:
              </label>
              <div className="flex">
                {!selectedProductId && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    <FaSearch className="mr-2" />
                    Search Products
                  </button>
                )}

                {selectedProductName && (
                  <span className="ml-2 text-gray-700">
                    {selectedProductName}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="variant"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Variant:
              </label>
              <select
                id="variant"
                value={selectedVariantId}
                onChange={(e) =>
                  setSelectedVariantId(
                    e.target.value ? parseInt(e.target.value) : '',
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={selectedProductId === ''}
                required
              >
                <option value="">-- Select Variant --</option>
                {getVariantsForSelectedProduct().map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="unit-cost"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Cost ($):
              </label>
              <input
                type="number"
                id="unit-cost"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            onClick={handleAddProduct}
            className="mt-4 flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Product Search Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-3/4 max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Search Product
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <ProductSearch onProductSelect={handleProductSelect} />
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Variant
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit Cost ($)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Cost ($)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.variantName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.unitCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.quantity * item.unitCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-50 font-semibold">
                <td
                  colSpan={4}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {totalQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(totalCost)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => alert('Import saved as draft!')}
            className="flex items-center bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <FaSave className="mr-2" />
            Save as Draft
          </button>

          <button
            onClick={() => alert('Import submitted successfully!')}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <FaPaperPlane className="mr-2" />
            Submit Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProductPage;
