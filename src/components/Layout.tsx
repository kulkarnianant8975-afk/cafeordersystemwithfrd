import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ShoppingCart, LayoutDashboard, QrCode, ChefHat } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = ({ cartCount }: { cartCount: number }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#FDFCF0] border-b border-[#E5E1D1] z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#4A3728] rounded-xl flex items-center justify-center text-white">
            <Coffee size={24} />
          </div>
          <span className="font-serif font-bold text-xl text-[#4A3728] hidden sm:block">Brew & Bite</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/admin/dashboard" className={cn("p-2 rounded-lg transition-colors", location.pathname === '/admin/dashboard' ? "bg-[#4A3728] text-white" : "text-[#4A3728] hover:bg-[#E5E1D1]")}>
                <LayoutDashboard size={20} />
              </Link>
              <Link to="/admin/kitchen" className={cn("p-2 rounded-lg transition-colors", location.pathname === '/admin/kitchen' ? "bg-[#4A3728] text-white" : "text-[#4A3728] hover:bg-[#E5E1D1]")}>
                <ChefHat size={20} />
              </Link>
              <Link to="/admin/qr-generator" className={cn("p-2 rounded-lg transition-colors", location.pathname === '/admin/qr-generator' ? "bg-[#4A3728] text-white" : "text-[#4A3728] hover:bg-[#E5E1D1]")}>
                <QrCode size={20} />
              </Link>
            </div>
          ) : (
            <Link to="/cart" className="relative p-2 text-[#4A3728] hover:bg-[#E5E1D1] rounded-lg transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#D2691E] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFCF0]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Layout = ({ children, cartCount = 0 }: { children: React.ReactNode; cartCount?: number }) => {
  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#4A3728] font-sans selection:bg-[#4A3728] selection:text-white">
      <Navbar cartCount={cartCount} />
      <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
