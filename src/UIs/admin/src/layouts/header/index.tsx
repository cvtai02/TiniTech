import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="h-screen w-64 bg-transparent text-black flex flex-col border-r border-gray-400 shadow-lg">
      <div className="text-2xl font-bold p-4 border-b border-gray-300 shadow-sm">
        TiniTech
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col space-y-2 p-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              Đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              Danh mục
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              Sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              Khách hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rating-messages"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              Đánh giá & Tin nhắn
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
