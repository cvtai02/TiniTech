import React from 'react';
import ProductCard from './ProductCard';
import { ProductBriefDto } from '../../types/product';
import { useQueryClient } from '@tanstack/react-query';
import styles from './wrapableproductlist.module.css';

interface ProductListProps {
  products: ProductBriefDto[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const queryClient = useQueryClient();

  const handleProductDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
  return (
    <div className={styles.container}>
      <div className={styles.child}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductDeleted={handleProductDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
