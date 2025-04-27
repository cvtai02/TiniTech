import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  Category,
  OrderCriteriaList as OrderCriteria,
  PaginatedList,
  ProductBriefDto,
  ProductStatusList as ProductStatus,
} from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../services/category';
import { GetProductsQueryParams as GetProductsQuery } from '../../types';
import ProductList from '../../components/products/ProductList';
import { getProductsFn } from '../../services/product';
import AddProduct from '../AddProduct';

const ProductPage: React.FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<GetProductsQuery>(
    new GetProductsQuery({
      page: 1,
      pageSize: 8,
      orderBy: 'CreatedDate',
      orderDirection: 'descending',
      status: ['active'],
    }),
  );
  const [category, setCategory] = useState<Category>();

  // Fetch categories using React Query
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data, isLoading } = useQuery<PaginatedList<ProductBriefDto>>({
    queryKey: ['products', filters],
    queryFn: () => getProductsFn(filters),
  });

  // Handler functions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(
      new GetProductsQuery({
        ...filters,
        search: e.target.value,
      }),
    );
  };

  const handleFilterChange = (key: keyof GetProductsQuery, value: string) => {
    setFilters(
      new GetProductsQuery({
        ...filters,
        [key]: value,
      }),
    );
  };
  const handleRootCategoryChange = (value: string) => {
    setCategory(categories?.find((category) => category.slug === value));
    setFilters(
      new GetProductsQuery({
        ...filters,
        categorySlug: value,
      }),
    );
    return;
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleSortChange = (sortOption: string) => {
    if (filters.orderBy === sortOption) {
      // Toggle direction if already sorting by this option
      setFilters(
        new GetProductsQuery({
          ...filters,
          orderDirection:
            filters.orderDirection === 'descending'
              ? 'ascending'
              : 'descending',
        }),
      );
    } else {
      // Set new sort option with default descending direction
      setFilters(
        new GetProductsQuery({
          ...filters,
          orderBy: sortOption,
          orderDirection: 'descending',
        }),
      );
    }
  };

  // Handler for opening/closing the add product modal
  const handleAddProductClick = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddProductModalOpen(false);
  };

  // Add Product Modal Component
  const AddProductModal = () => {
    if (!isAddProductModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-transparent max-h-screen overflow-auto scroll-bar rounded-lg">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={handleCloseModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          <div className=" bg-white rounded-lg shadow-lg">
            <AddProduct />
          </div>
        </div>
      </div>
    );
  };

  // Filter components - shared between desktop sidebar and mobile dropdown
  const FilterComponents = () => (
    <div className="space-y-4">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={category?.slug || ''}
          onChange={(e) => handleRootCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sub-category
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={filters.categorySlug || ''}
          onChange={(e) => handleFilterChange('categorySlug', e.target.value)}
        >
          <option value="">All Categories</option>
          {category?.subcategories?.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <div className="flex flex-col gap-2">
          {ProductStatus.map((status) => (
            <label key={status.value} className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-radio h-4 w-4 text-blue-600"
                checked={filters.status?.includes(status.value)}
                value={status.value}
                onChange={() => {
                  if (filters.status?.includes(status.value)) {
                    setFilters(
                      new GetProductsQuery({
                        ...filters,
                        status: filters.status.filter(
                          (s) => s !== status.value,
                        ),
                      }),
                    );
                  } else {
                    setFilters(
                      new GetProductsQuery({
                        ...filters,
                        status: [...(filters.status || []), status.value],
                      }),
                    );
                  }
                }}
              />
              <span className="ml-2 capitalize text-sm">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <div className="flex flex-col gap-2">
          {OrderCriteria.map((sort) => (
            <button
              key={sort.value}
              className={`px-3 py-1 rounded text-sm flex items-center justify-between ${
                filters.orderBy === sort.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
              onClick={() => handleSortChange(sort.value)}
            >
              {sort.label}
              {filters.orderBy === sort.value &&
                (filters.orderDirection === 'ascending' ? (
                  <FiChevronUp className="ml-1" />
                ) : (
                  <FiChevronDown className="ml-1" />
                ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative shadow-md bg-black ">
        <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <form className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search products..."
                  value={filters.search || ''}
                  onChange={handleSearchChange}
                ></input>
              </div>
            </form>
          </div>
          <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
            <button
              type="button"
              className="flex items-center hover:bg-gray-800 justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              onClick={handleAddProductClick}
            >
              <svg
                className="h-3.5 w-3.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
              Add product
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar and Products */}
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-64 bg-white p-4 shadow-md">
          <h2 className="font-medium text-lg mb-4">Filters</h2>
          <FilterComponents />
        </div>

        {/* Product Grid - Takes remaining space */}
        <div className="flex-1 p-4">
          <ProductList products={data?.items || []} />
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {data?.items.length === 0 && !isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No products found.</div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <a
              onClick={() => {
                setFilters(
                  new GetProductsQuery({
                    ...filters,
                    page: filters.page > 1 ? filters.page - 1 : 1,
                  }),
                );
              }}
              className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>previous</span>
            </a>

            <div className="items-center hidden lg:flex gap-x-3">
              {data?.totalPages &&
                Array.from({ length: data.totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded text-sm flex items-center justify-between ${
                      filters.page === index + 1
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() =>
                      setFilters(
                        new GetProductsQuery({
                          ...filters,
                          page: index + 1,
                        }),
                      )
                    }
                  >
                    {index + 1}
                  </button>
                ))}
            </div>

            <a
              onClick={() => {
                setFilters(
                  new GetProductsQuery({
                    ...filters,
                    page:
                      filters.page < (data?.totalPages || 1)
                        ? filters.page + 1
                        : filters.page,
                  }),
                );
              }}
              className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span>Next</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Render the modal when it should be open */}
      {isAddProductModalOpen && <AddProductModal />}
    </div>
  );
};

export default ProductPage;
