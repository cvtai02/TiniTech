import React, { useState } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  Category,
  OrderCriteria,
  ProductStatus,
  ProductBriefDto,
  GetProductsQuery,
} from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../services/category';
import { getProducts } from '../../services/product';
import ProductCard from '../../components/products/ProductCard';
import WrappableProductList from '../../components/products/WrappableProductList';

interface FilterState {
  category: string;
  subCategory: string;
  status: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

const ProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    subCategory: 'all',
    status: 'all',
    sortBy: 'createdDate',
    sortDirection: 'desc',
  });

  // Fetch categories using React Query
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch products using React Query with filters
  const {
    data: products,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery<ProductBriefDto[]>({
    queryKey: ['products', searchTerm, filters],
    queryFn: () => {
      const query = new GetProductsQuery({
        search: searchTerm || null,
        categorySlug:
          filters.subCategory !== 'all'
            ? filters.subCategory
            : filters.category !== 'all'
              ? filters.category
              : null,
        status: filters.status !== 'all' ? [filters.status] : null,
        orderBy: filters.sortBy,
        orderDirection:
          filters.sortDirection === 'asc' ? 'ascending' : 'descending',
        pageNumber: 1,
        pageSize: 8,
      });
      return getProducts(query);
    },
  });

  // Handler functions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (key === 'category') {
      setFilters({
        ...filters,
        subCategory: 'all',

        [key]: value,
      });

      return;
    }

    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleSortChange = (sortOption: string) => {
    if (filters.sortBy === sortOption) {
      // Toggle direction if already sorting by this option
      setFilters({
        ...filters,
        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new sort option with default descending direction
      setFilters({
        ...filters,
        sortBy: sortOption,
        sortDirection: 'desc',
      });
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
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sub-Category
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={filters.subCategory}
          onChange={(e) => handleFilterChange('subCategory', e.target.value)}
          disabled={filters.category === 'all'}
        >
          <option value="all">All Sub-Categories</option>
          {filters.category !== 'all' &&
            categories
              ?.find((cat) => cat.slug === filters.category)
              ?.subcategories?.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
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
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                checked={filters.status === status.value}
                value={status.value}
                onChange={() => handleFilterChange('status', status.value)}
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
                filters.sortBy === sort.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
              onClick={() => handleSortChange(sort.value as any)}
            >
              {sort.label}
              {filters.sortBy === sort.value &&
                (filters.sortDirection === 'asc' ? (
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
            value={searchTerm}
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
          {isProductLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading products...</div>
            </div>
          ) : isProductError ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500">
                Error loading products. Please try again.
              </div>
            </div>
          ) : products && products.length > 0 ? (
            <WrappableProductList products={products} />
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No products found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
