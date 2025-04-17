import React from 'react';
import ProductCard from './ProductCard';
import { ProductBrief } from '../../types';

interface ProductListProps {
  products: ProductBrief[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 bg-transparent">
      {products.map((product, idx) => (
        <ProductCard key={idx} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
