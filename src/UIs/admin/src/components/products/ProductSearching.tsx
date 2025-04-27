import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsFn as getProducts } from '../../services/product';
import {
  GetProductsQueryParams as GetProductsQuery,
  ProductBriefDto,
} from '../../types/product';

interface ProductSearchProps {
  onProductSelect: (product: ProductBriefDto) => void;
}

export default function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecentProducts, setShowRecentProducts] = useState(true);

  // Query for searched products
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: () =>
      getProducts(
        new GetProductsQuery({
          search: searchTerm,
          page: 1,
          pageSize: 12,
        }),
      ),
    enabled: searchTerm.length > 0,
  });

  // Query for recently added products
  const { data: recentProducts, isLoading: recentLoading } = useQuery({
    queryKey: ['newProducts'],
    queryFn: () => getProducts(new GetProductsQuery({ page: 1, pageSize: 12 })),
    enabled: showRecentProducts,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowRecentProducts(value.length < 1);
  };

  const displayedProducts =
    searchTerm.length > 0 ? searchResults : recentProducts;

  return (
    <div className="w-full px-8 py-8 rounded-2xl bg-gray-900">
      <form className="flex items-center">
        <div className="relative w-full">
          <label className="sr-only">Search</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            onChange={handleSearchChange}
            className="block w-full p-2 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Search"
          />
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between">
        {searchTerm.length > 2 ? (
          <h3 className="text-sm font-medium text-gray-500">Search Results</h3>
        ) : (
          <h3 className="text-sm font-medium text-gray-500">
            Recently Added Products
          </h3>
        )}
      </div>

      {(searchLoading || recentLoading) && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div
        className="max-h-48  rounded  overflow-y-auto
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-neutral-700
                    [&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {displayedProducts?.items.length ? (
          <ul className="w-full divide-y divide-gray-700 columns-2">
            {displayedProducts.items.map((product: ProductBriefDto) => (
              <li
                key={product.id}
                onClick={() => onProductSelect(product)}
                className="pt-3 pb-0 sm:pt-4"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="shrink-0">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium  truncate text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm.length > 2
              ? 'No products found. Try a different search term.'
              : 'No recent products available.'}
          </div>
        )}
      </div>
    </div>
  );
}
