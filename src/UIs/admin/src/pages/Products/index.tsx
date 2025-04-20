import React from 'react';
import CategoryNavbar from './Navbar';
import NewProducts from './NewProducts';
import Banner from './Banner';
import styles from './styles.module.css';
const ProductsPage: React.FC = () => {
  return (
    <div
      className={`grow  text-black flex flex-col bg-[#F9F7F7] ${styles.fontText}`}
    >
      <div className="w-full items-center basis-16 bg-transparent flex gap-4">
        <CategoryNavbar />
      </div>

      <div className="w-full h-[36rem] flex bg-transparent p-8 ">
        <Banner />
      </div>

      <div className="w-full flex gap-4 ">
        <NewProducts></NewProducts>
      </div>
    </div>
  );
};

export default ProductsPage;
