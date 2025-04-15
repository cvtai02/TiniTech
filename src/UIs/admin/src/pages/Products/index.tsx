import React from 'react';
import CategoryNavbar from './Navbar';
const ProductsPage: React.FC = () => {
  return (
    <div className="grow bg-transparent text-black flex flex-col">
      <div className="w-full items-center basis-16 bg-black flex gap-4">
        <CategoryNavbar />
      </div>

      <div className="w-full basis-1/2 flex gap-4 bg-amber-100">
        Advertise slice
      </div>

      <div className="w-full basis-2xs flex gap-4 bg-amber-300">
        Sản phẩm nổi bật
      </div>

      <div className="w-full flex gap-4 bg-amber-600"></div>
    </div>
  );
};

export default ProductsPage;
