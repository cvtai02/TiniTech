import React, { useState } from 'react';
import { ProductBriefDto } from '../../types';
import { MdDelete, MdEdit, MdMoreVert } from 'react-icons/md';
import { formatVND } from '../../utils/formatCurrency';
import { updateProductStatus } from '../../services/product';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: ProductBriefDto;
  onProductDeleted?: () => void; // Add this new prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductDeleted,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () => updateProductStatus(product.id, 'Deleted'),
    onSuccess: () => {
      if (onProductDeleted) {
        onProductDeleted();
      }
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)
    ) {
      deleteMutation.mutate();
    }
    setShowOptions(false);
  };

  const handleUpdate = () => {
    setShowOptions(false);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm flex flex-col hover:cursor-pointer"
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      <div className="relative flex aspect-square overflow-hidden mb-4 rounded-lg ">
        <img
          className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105 "
          src={product.imageUrl}
          alt="product image"
        />
      </div>
      <div className="flex-grow flex justify-between items-end">
        <div className="">
          <h3 className="font-medium ">{product.name}</h3>
          <div className="flex items-center gap-1 text-sm text-yellow-500 ">
            {'★'.repeat(product.rating)}
            {'☆'.repeat(5 - product.rating)}{' '}
            <span className="text-gray-500 text-xs">
              ({product.ratingCount})
            </span>
          </div>
          <p className="mt-2 flex justify-between items-center font-bold">
            {formatVND(product.price)}
          </p>
        </div>
        <div className="relative">
          <MdMoreVert
            onClick={toggleOptions}
            size={24}
            className="text-gray-600 cursor-pointer hover:text-gray-800"
          />

          {showOptions && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
              <ul>
                <li
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleUpdate}
                >
                  <MdEdit className="mr-2" /> Update
                </li>
                <li
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                  onClick={handleDelete}
                >
                  <MdDelete className="mr-2" /> Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
