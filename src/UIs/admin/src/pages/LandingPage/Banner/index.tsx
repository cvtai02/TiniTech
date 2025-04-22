import React from 'react';
import styles from './styles.module.css';

const Banner: React.FC = () => {
  return (
    <div
      className={`p-6 text-center rounded w-full h-auto flex gap-8  ${styles.bg}`}
    >
      <div className="flex-col flex justify-center max-w-1/2 rounded-lg p-8">
        <h1 className="text-3xl leading-16 tracking-[0.07rem] text-left font-bold text-wrap">
          Vì một cuộc sống thoải mái, heo thỳ và motivated.
        </h1>
        <p className="text-left text-gray-800 mb-6 pb-8 pt-3">
          Từ những món đồ công nghệ cho đến những món đồ gia dụng nhỏ gọn, tất
          cả đều được chọn lọc kỹ càng để nâng cao chất lượng cuộc sống của bạn.
        </p>
        <button className="bg-transparent border-1 border-black py-1 w-fit px-8 rounded  hover:cursor-pointer transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8 "
          >
            <path
              d="m31.71 15.29-10-10-1.42 1.42 8.3 8.29H0v2h28.59l-8.29 8.29 1.41 1.41 10-10a1 1 0 0 0 0-1.41z"
              data-name="3-Arrow Right"
            />
          </svg>
        </button>
      </div>
      <div className="w-full relative">
        <img
          className="h-44 w-44 object-cover absolute  rounded-3xl left-[25%] rotate-[20deg] top-[60%]"
          src="/watch.webp"
        />
        <img
          className="h-44 w-44 object-cover absolute  rounded-3xl left-[55%] rotate-[10deg] top-[10%]"
          src="/desktopsetup.jpg"
        />
        <img
          className="h-44 w-44 object-cover absolute  rounded-3xl left-[5%] rotate-[-20deg] top-[10%]"
          src="/cat.webp"
        />
      </div>
    </div>
  );
};

export default Banner;
