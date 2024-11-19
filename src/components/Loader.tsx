import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
    </div>
  );
};

export default Loader;
