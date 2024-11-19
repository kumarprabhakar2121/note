'use client';

import { Settings } from 'lucide-react';
import Logo from './Logo';

const Header = () => {

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="h-full w-full flex items-center justify-between px-4">
      <Logo />

        <button
          onClick={() => {}}
          className="p-2 text-gray-600 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Open Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
