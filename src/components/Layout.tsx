import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Layout/Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
