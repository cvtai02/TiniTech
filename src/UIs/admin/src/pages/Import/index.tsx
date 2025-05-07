import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { createImportReceipt, searchBySku } from '../../services/inventory';
import { CreateImportItemDto, SkuItem } from '../../types/inventory';

const ImportPage = () => {
  const [code, setCode] = useState('');
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [items, setItems] = useState<
    (CreateImportItemDto & { name?: string; image?: string })[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SkuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<SkuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  const createImportMutation = useMutation({
    mutationFn: createImportReceipt,
    onSuccess: () => {
      toast.success('Import receipt created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error(`Error creating import receipt: ${error}`);
    },
  });

  const resetForm = () => {
    setCode('');
    setReceiptDate(new Date().toISOString().split('T')[0]);
    setItems([]);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedProduct(null);
    setQuantity(1);
    setUnitCost(0);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    try {
      const results = await searchBySku(searchQuery);
      console.log('Search results:', results);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info('No products found with this SKU');
      }
    } catch (error) {
      toast.error('Error searching for products');
      console.error(error);
    }
  };

  const handleSelectProduct = (product: SkuItem) => {
    setSelectedProduct(product);
    setSearchResults([]);
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (unitCost <= 0) {
      toast.error('Unit cost must be greater than 0');
      return;
    }

    setItems([
      ...items,
      {
        sku: selectedProduct.sku,
        quantity,
        unitCost,
        name: selectedProduct.name,
        image: selectedProduct.imageUrl,
      },
    ]);

    // Reset values
    setSelectedProduct(null);
    setSearchQuery('');
    setQuantity(1);
    setUnitCost(0);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      toast.error('Please enter a receipt code');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const importReceipt = {
      Code: code,
      receiptDate: new Date(receiptDate),
      items: items.map(({ sku, quantity, unitCost }) => ({
        sku,
        quantity,
        unitCost,
      })),
    };
    createImportMutation.mutate(importReceipt);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Import Receipt</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Receipt Code</h2>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter receipt code"
                    required
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Receipt Date</h2>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Add Products</h2>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by SKU"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <FaSearch />
                    </span>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mb-4 border rounded-lg p-2 max-h-40 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.identityName}</p>
                          <p className="text-sm text-gray-600">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedProduct && (
                  <div className="mb-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          SKU: {selectedProduct.sku}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm mb-1">Quantity</p>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm mb-1">Unit Cost</p>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                          value={unitCost}
                          onChange={(e) =>
                            setUnitCost(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={handleAddItem}
                      >
                        <FaPlus /> Add Item
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Product</th>
                        <th className="p-2">SKU</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Unit Cost</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <span>{item.name || item.sku}</span>
                            </div>
                          </td>
                          <td className="p-2">{item.sku}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">${item.unitCost.toFixed(2)}</td>
                          <td className="p-2">
                            ${(item.quantity * item.unitCost).toFixed(2)}
                          </td>
                          <td className="p-2">
                            <button
                              type="button"
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={resetForm}
                  disabled={createImportMutation.isPending}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={
                    createImportMutation.isPending || items.length === 0
                  }
                >
                  {createImportMutation.isPending
                    ? 'Submitting...'
                    : 'Create Import Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Total Items:</p>
                <p>{items.length}</p>
              </div>
              <div className="flex justify-between">
                <p>Total Quantity:</p>
                <p>{items.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <p>Total Cost:</p>
                <p>${calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
