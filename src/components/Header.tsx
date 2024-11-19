'use client';

import { Settings } from 'lucide-react';
import Logo from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface HeaderProps {
  onHomeClick?: () => void;
}

const Header = ({ onHomeClick }: HeaderProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/notes') {
      return pathname.startsWith('/notes');
    }
    return pathname === path;
  };

  const showSettings = pathname.startsWith('/notes');

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="h-full w-full flex items-center justify-between px-4">
        <Logo onHomeClick={onHomeClick} />
        <div className="flex items-center gap-4">
          <Link
            href="/notes"
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive('/notes')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            )}
          >
            Notes
          </Link>
          <Link
            href="/about"
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive('/about')
                ? 'text-blue-600blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            )}
          >
            About
          </Link>
          {showSettings && (
            <button
              onClick={() => {}}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Open Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
