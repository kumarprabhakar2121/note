'use client';

import { useRouter } from 'next/navigation';
import { Edit3 } from 'react-feather';

interface LogoProps {
  onHomeClick?: () => void;
}

const Logo = ({ onHomeClick }: LogoProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    }
    localStorage.removeItem('selectedNoteId');
    router.push('/');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 p-1 hover:text-[var(--primary)] transition-colors duration-200 group"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:shadow-md transition-all duration-200">
        <Edit3 className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600">
        Notes
      </span>
    </button>
  );
};

export default Logo;
