import React, { useState } from 'react';
import { ProductBrief } from '../../types';
import { MdDelete, MdEdit, MdMoreVert } from 'react-icons/md';
interface ProductCardProps {
  product: ProductBrief;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    setShowOptions(false);
  };

  const handleUpdate = () => {
    setShowOptions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-xs flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-32 h-32 object-contain mb-4"
      />
      <div className="flex-grow flex justify-between">
        <div className="">
          <h3 className="text-md font-semibold ">{product.name}</h3>
          <p className="text-gray-800 font-bold mb-1">{product.price}</p>
          <div className="flex items-center gap-1 text-sm text-yellow-500 ">
            {'★'.repeat(product.rating)}
            {'☆'.repeat(5 - product.rating)}{' '}
            <span className="text-gray-500 text-xs">({product.reviews})</span>
          </div>
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
