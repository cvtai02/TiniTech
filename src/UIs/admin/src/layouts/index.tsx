import React from 'react';
import Header from './header';

import { Outlet } from 'react-router-dom';
const Layout: React.FC = () => {
  return (
    <div className="flex flex-row w-full h-screen bg-gray-50">
      <Header />
      <div className="flex-1 overflow-y-auto min-h-screen scroll-bar ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
