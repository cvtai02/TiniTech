import React from 'react';
import { ProductBriefDto } from '../../types';
import {
  MdStar,
  MdStarOutline,
  MdLocalShipping,
  MdInventory,
} from 'react-icons/md';
import { formatUSD, formatVND } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: ProductBriefDto;
  onProductDeleted?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm flex flex-col hover:cursor-pointer"
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      <div className="relative flex aspect-square overflow-hidden mb-4 rounded-lg ">
        <img
          className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105 "
          src={product.imageUrl === '' ? '/default.png' : product.imageUrl}
          alt="image not found"
        />
      </div>
      <div className="flex-grow flex justify-between items-end">
        <div className="">
          <h3 className="font-bold">{product.name}</h3>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) =>
                i < product.rating ? (
                  <MdStar key={i} className="text-yellow-500 text-lg" />
                ) : (
                  <MdStarOutline key={i} className="text-yellow-400 text-lg" />
                ),
              )}
              <span className="ml-2 text-gray-600 text-xs font-medium">
                ({product.ratingCount})
              </span>
            </div>
            <div className="mt-2 flex gap-4 text-xs font-medium">
              <div className="flex items-center  rounded-md">
                <MdLocalShipping className="mr-1" />
                <span>Đã bán: {product.sold}</span>
              </div>
              <div
                className={`flex items-center rounded-md ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                <MdInventory className="mr-1" />
                <span>Còn: {product.stock}</span>
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-xs font-medium">
              <div className="flex items-center  rounded-md">
                <span>Ngày tạo: {formatDate(product.created.toString())}</span>
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-xs font-medium">
              <div className="flex items-center  rounded-md">
                <span>
                  Cập nhật: {formatDate(product.lastModified.toString())}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-primary flex justify-between items-center font-bold">
            {formatVND(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
