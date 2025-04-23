import React, { useState } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  Category,
  OrderCriteria,
  PaginatedList,
  ProductBriefDto,
  ProductStatus,
} from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../services/category';
import { GetProductsQuery } from '../../types';
import ProductList from '../../components/products/WrappableProductList';
import { getProductsFn } from '../../services/product';

const ProductPage: React.FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<GetProductsQuery>(
    new GetProductsQuery({
      page: 1,
      pageSize: 8,
      orderBy: 'createdDate',
      orderDirection: 'descending',
      status: ['active', 'draft'],
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
      {/* Search Bar */}
      <div className="p-4 bg-white shadow">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Mobile Filters Button - Only visible on small screens */}
      <div className="md:hidden bg-white p-4 shadow-md mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleMobileFilters}
        >
          <div className="flex items-center">
            <FiFilter className="text-gray-700 mr-2" />
            <span className="font-medium">Filters</span>
          </div>
          {showMobileFilters ? (
            <FiChevronUp className="text-gray-700" />
          ) : (
            <FiChevronDown className="text-gray-700" />
          )}
        </div>

        {/* Mobile Filters - Expandable */}
        {showMobileFilters && (
          <div className="mt-4">
            <FilterComponents />
          </div>
        )}
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
            <a className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
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

            <a className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
              <span>Next</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
