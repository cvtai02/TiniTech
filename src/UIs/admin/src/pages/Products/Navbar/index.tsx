import React from 'react';
import { FaEdit } from 'react-icons/fa';
import logo from '../../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

export const mockCategories = [
  {
    id: 'indoor',
    name: 'Trong nhà',
    description: 'Sản phẩm trang trí và tiện ích cho không gian sống',
    subcategories: [
      {
        id: 'wind-chime',
        name: 'Chuông gió',
        description: 'Trang trí và tạo âm thanh thư giãn',
      },
      { id: 'lamp', name: 'Đèn', description: 'Chiếu sáng và trang trí phòng' },
      {
        id: 'figure',
        name: 'Firgure',
        description: 'Mô hình trang trí độc đáo',
      },
      {
        id: 'wood-shelf',
        name: 'Kệ gỗ',
        description: 'Lưu trữ và trang trí không gian',
      },
      {
        id: 'essential-oil',
        name: 'Tinh dầu',
        description: 'Hương thơm thư giãn cho phòng',
      },
      {
        id: 'wall-decal',
        name: 'Dán tường',
        description: 'Trang trí tường bằng hình dán',
      },
      {
        id: 'floor-decal',
        name: 'Dán sàn',
        description: 'Trang trí và bảo vệ sàn nhà',
      },
      {
        id: 'speaker',
        name: 'Loa',
        description: 'Thiết bị âm thanh cho giải trí',
      },
    ],
  },
  {
    id: 'accessories',
    name: 'Phụ kiện',
    description: 'Các phụ kiện thời trang và tiện ích cá nhân',
    subcategories: [
      {
        id: 'watch',
        name: 'Đồng hồ',
        description: 'Xem giờ và thể hiện phong cách',
      },
      {
        id: 'earphones',
        name: 'Tai nghe',
        description: 'Nghe nhạc, gọi điện tiện lợi',
      },
      { id: 'glasses', name: 'Kính', description: 'Bảo vệ mắt và thời trang' },
    ],
  },
  {
    id: 'cat',
    name: 'Cat',
    description: 'Đồ dùng và thức ăn cho thú cưng yêu quý',
    subcategories: [
      {
        id: 'cat-food',
        name: 'Thức ăn',
        description: 'Dinh dưỡng đầy đủ cho mèo',
      },
      {
        id: 'scratch-board',
        name: 'Bàn cào',
        description: 'Giúp mèo mài móng',
      },
      {
        id: 'brush',
        name: 'Bàn chải',
        description: 'Chải lông giúp mèo sạch sẽ',
      },
      { id: 'litter', name: 'Cát', description: 'Vệ sinh cho mèo tiện lợi' },
    ],
  },
];

const CategoryNavbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-transparent px-16 flex items-center justify-between shadow-md grow">
      <div className="">
        <img src={logo} alt="Logo" className="h-12 w-12" />
      </div>
      <ul className="flex gap-16 text-white px-6 py-4">
        {mockCategories.map((category) => (
          <li className="relative group" key={category.id}>
            <button
              className="font-semibold hover:text-blue-600"
              title={category.description}
            >
              {category.name}
            </button>
            <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              {category.subcategories.map((sub) => (
                <li key={sub.id}>
                  <a
                    href="#"
                    title={sub.description}
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {sub.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}

        <span className=" w-px bg-gray-500"></span>

        <li className="relative group">
          <button
            className="font-semibold hover:text-blue-600 hover:cursor-pointer"
            onClick={() => navigate('/inventory/category')}
          >
            <FaEdit />
          </button>
          <span className="absolute left-0 top-8 w-max bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-0 z-10">
            Cập nhật danh mục
          </span>
        </li>
      </ul>
      <div className=" ">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.817-4.817A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavbar;
