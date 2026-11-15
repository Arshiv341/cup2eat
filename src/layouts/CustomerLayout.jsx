import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <WhatsAppFloat />
      <Footer />
    </div>
  );
};

export default CustomerLayout;
