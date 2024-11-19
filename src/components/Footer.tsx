'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  if (!year) {
    return null; // Don't render anything until we have the year
  }

  return (
    <footer className="container mx-auto px-6 py-8 border-t">
      <div className="text-center text-gray-500">
        <p>&copy; {year} Notes App. All rights reserved.</p>
      </div>
    </footer>
  );
}
