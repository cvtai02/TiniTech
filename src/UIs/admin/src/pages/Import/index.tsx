import React, { useState, useEffect } from 'react';

// Types
interface ImportedProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  quantity: number;
  price: number;
  arrivalDate: string;
  status: 'Pending' | 'In Transit' | 'Arrived' | 'Cleared Customs';
}

interface FilterState {
  category: string;
  origin: string;
  status: string;
}

const ImportGoodsPage: React.FC = () => {
  const [products, setProducts] = useState<ImportedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    origin: '',
    status: '',
  });
  const [newProduct, setNewProduct] = useState<Omit<ImportedProduct, 'id'>>({
    name: '',
    category: '',
    origin: '',
    quantity: 0,
    price: 0,
    arrivalDate: '',
    status: 'In Transit',
  });
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);

  // Simulated data fetch
  useEffect(() => {
    // This would be an API call in a real application
    const fetchProducts = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockProducts: ImportedProduct[] = [
          {
            id: '1',
            name: 'Coffee Beans',
            category: 'Food & Beverages',
            origin: 'Brazil',
            quantity: 2000,
            price: 5.5,
            arrivalDate: '2025-05-15',
            status: 'In Transit',
          },
          {
            id: '2',
            name: 'Cotton Fabric',
            category: 'Textiles',
            origin: 'India',
            quantity: 500,
            price: 3.25,
            arrivalDate: '2025-04-30',
            status: 'Arrived',
          },
          {
            id: '3',
            name: 'Smartphone Components',
            category: 'Electronics',
            origin: 'China',
            quantity: 10000,
            price: 2.1,
            arrivalDate: '2025-04-22',
            status: 'Cleared Customs',
          },
          {
            id: '4',
            name: 'Olive Oil',
            category: 'Food & Beverages',
            origin: 'Italy',
            quantity: 1000,
            price: 8.75,
            arrivalDate: '2025-05-10',
            status: 'Pending',
          },
          {
            id: '5',
            name: 'Car Parts',
            category: 'Automotive',
            origin: 'Germany',
            quantity: 350,
            price: 45.2,
            arrivalDate: '2025-04-25',
            status: 'In Transit',
          },
        ];

        setProducts(mockProducts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique values for filter dropdowns
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
  const uniqueOrigins = Array.from(new Set(products.map((p) => p.origin)));
  const statuses = ['Pending', 'In Transit', 'Arrived', 'Cleared Customs'];

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    return (
      (filters.category === '' || product.category === filters.category) &&
      (filters.origin === '' || product.origin === filters.origin) &&
      (filters.status === '' || product.status === filters.status)
    );
  });

  // Handle new product form changes
  const handleNewProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]:
        name === 'quantity' || name === 'price' ? parseFloat(value) : value,
    });
  };

  // Add new product
  const handleAddProduct = () => {
    const newProductWithId: ImportedProduct = {
      ...newProduct,
      id: Date.now().toString(),
    };

    setProducts([...products, newProductWithId]);
    setNewProduct({
      name: '',
      category: '',
      origin: '',
      quantity: 0,
      price: 0,
      arrivalDate: '',
      status: 'In Transit',
    });
    setIsAddingProduct(false);
  };

  // Calculate total value
  const totalValue = filteredProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nhập kho</h1>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Products
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {filteredProducts.length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Value
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                In Transit
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {products.filter((p) => p.status === 'In Transit').length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Cleared Customs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {products.filter((p) => p.status === 'Cleared Customs').length}
              </dd>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="origin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Origin
                  </label>
                  <select
                    id="origin"
                    name="origin"
                    value={filters.origin}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Origins</option>
                    {uniqueOrigins.map((origin) => (
                      <option key={origin} value={origin}>
                        {origin}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add New Import
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                No products found matching your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Origin
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
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Arrival Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
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
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.origin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $
                        {(product.price * product.quantity).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.arrivalDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            product.status === 'Cleared Customs'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'Arrived'
                                ? 'bg-blue-100 text-blue-800'
                                : product.status === 'In Transit'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add New Import
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details for the new imported product
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newProduct.name}
                      onChange={handleNewProductChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      id="category"
                      value={newProduct.category}
                      onChange={handleNewProductChange}
                      placeholder="e.g. Electronics, Food & Beverages"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="origin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Origin Country
                    </label>
                    <input
                      type="text"
                      name="origin"
                      id="origin"
                      value={newProduct.origin}
                      onChange={handleNewProductChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      min="0"
                      value={newProduct.quantity}
                      onChange={handleNewProductChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Unit Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="arrivalDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expected Arrival Date
                    </label>
                    <input
                      type="date"
                      name="arrivalDate"
                      id="arrivalDate"
                      value={newProduct.arrivalDate}
                      onChange={handleNewProductChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newProduct.status}
                      onChange={handleNewProductChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportGoodsPage;
