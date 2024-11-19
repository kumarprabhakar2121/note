'use client';

import { useEffect, useState } from 'react';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div key={mounted ? 'mounted' : 'unmounted'}>
      {children}
    </div>
  );
}
