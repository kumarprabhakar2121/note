'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const router = useRouter();

  const handleHomeClick = () => {
    // Clear selected note from localStorage
    localStorage.removeItem('selectedNoteId');
    router.push('/');
  };

  return (
    <>
      <Header onHomeClick={handleHomeClick} />
      <main className="pt-14">{children}</main>
    </>
  );
};

export default ClientLayout;
