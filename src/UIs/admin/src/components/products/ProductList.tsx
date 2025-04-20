import React from 'react';
import ProductCard from './ProductCard';
import { ProductBrief } from '../../types/product';
import { useQueryClient } from '@tanstack/react-query';

interface ProductListProps {
  products: ProductBrief[];
  queryKey?: string[]; // Optional queryKey prop
}

const ProductList: React.FC<ProductListProps> = ({ products, queryKey }) => {
  const queryClient = useQueryClient();

  const handleProductDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 bg-transparent">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductDeleted={handleProductDeleted}
        />
      ))}
    </div>
  );
};

export default ProductList;
