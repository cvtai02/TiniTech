import React from 'react';
import Header from './header';

import { Outlet } from 'react-router-dom';
const Layout: React.FC = () => {
  return (
    <div className="flex flex-row w-screen bg-gray-50">
      <Header />
      <div className="ml-64 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
