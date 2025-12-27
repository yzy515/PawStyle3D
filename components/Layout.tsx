
import React from 'react';
import { ShoppingBag, Github, Dog } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-apricot">
      <header className="bg-white/80 backdrop-blur-md border-b border-silverGray/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-brandPurple p-2 rounded-xl shadow-lg shadow-brandPurple/20">
              <Dog className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              PawStyle<span className="text-brandPurple">3D</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-brandPurple transition-colors">How it works</a>
            <a href="#" className="hover:text-brandPurple transition-colors">Catalog</a>
            <a href="#" className="hover:text-brandPurple transition-colors">Sustainability</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-brandPurple transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </button>
            <button className="bg-brandPurple text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-md shadow-brandPurple/20">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-silverGray/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Dog className="text-brandPurple w-4 h-4" />
            <p className="text-gray-500 text-sm">© 2024 PawStyle 3D. Crafted with love for pets.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-brandPurple transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};
