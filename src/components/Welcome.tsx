import { FileText, Plus } from 'react-feather';

interface WelcomeProps {
  onCreateNote: () => void;
}

const Welcome = ({ onCreateNote }: WelcomeProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 mx-auto mb-6 text-gray-300">
          <FileText size={64} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Notes
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          A minimalist rich text editor for your thoughts and ideas.
        </p>
      </div>

      <div className="space-y-6">
        <button
          onClick={onCreateNote}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[var(--primary)] rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create your first note
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-lg border border-[var(--border-light)]">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Rich Text Editing</h3>
            <p className="text-gray-600">
              Format your notes with bold, italics, lists, and more.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[var(--border-light)]">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Organized</h3>
            <p className="text-gray-600">
              Your notes are automatically organized by date and searchable.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[var(--border-light)]">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Minimalist</h3>
            <p className="text-gray-600">
              Clean, distraction-free interface focused on your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
