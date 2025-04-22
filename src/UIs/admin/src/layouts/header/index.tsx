import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaShoppingCart,
  FaFolder,
  FaStore,
  FaUsers,
  FaComments,
  FaCubes,
  FaBoxOpen,
} from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="h-screen bg-transparent sticky top-0 text-black basis-64 flex flex-col border-r border-gray-400 shadow-lg">
      <div className="text-3xl font-bold p-4 border-b border-gray-300 shadow-sm pl-8 flex ">
        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            transform: 'skewX(-8deg)',
          }}
        >
          <span
            style={{
              color: '#f0bd24',
            }}
          >
            Tini
          </span>
          Tech
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col space-y-2 p-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaHome className="w-5 h-5 mr-2" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaShoppingCart className="w-5 h-5 mr-2" />
              Đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaFolder className="w-5 h-5 mr-2" />
              Danh mục
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaCubes className="w-5 h-5 mr-2" />
              Sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/landing"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaStore className="w-5 h-5 mr-2" />
              Trang bán hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaUsers className="w-5 h-5 mr-2" />
              Khách hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rating-messages"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaComments className="w-5 h-5 mr-2" />
              Đánh giá & Tin nhắn
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/import"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-black hover:text-white ${
                  isActive ? 'bg-black text-white' : ''
                }`
              }
            >
              <FaBoxOpen className="w-5 h-5 mr-2" />
              Nhập kho
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
