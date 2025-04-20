import React from 'react';
import ProductList from '../../../components/products/ProductList';
import { useQuery } from '@tanstack/react-query';
import { getNewProducts } from '../../../services/product';
import { ProductBrief } from '../../../types/product';

const NewProducts: React.FC = () => {
  const {
    data: newProducts,
    isLoading,
    error,
  } = useQuery<ProductBrief[]>({
    queryKey: ['newProducts', 1, 10], // Page 1, 10 items per page
    queryFn: () => getNewProducts(1, 10), // Pass the required parameters
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">
          Failed to load new products. Please try again later.
        </p>
      </div>
    );
  }

  if (!newProducts || newProducts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">
          No new products available at the moment.
        </p>
      </div>
    );
  }

  return (
      <div className="shadow-md rounded-lg p-4 mb-4 grow bg-transparent">
        <h2 className="text-xl font-semibold mb-4">New Arrivals</h2>
        <ProductList products={newProducts} />
      </div>
  );
};

export default NewProducts;
