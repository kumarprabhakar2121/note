import Link from 'next/link';
import { Edit3, Feather, Layout, Share2 } from 'react-feather';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import Header from '@/components/Header';

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            Your Ideas, Organized Beautifully
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            A minimalist note-taking app designed for clarity and efficiency.
          </p>
          <Link
            href="/notes"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Taking Notes
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Layout className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Clean Interface</h3>
            <p className="text-gray-600">
              A distraction-free writing environment that lets you focus on what matters most - your ideas.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <Feather className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Rich Text Editing</h3>
            <p className="text-gray-600">
              Format your notes with ease using our intuitive rich text editor with markdown support.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <Share2 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Easy Sharing</h3>
            <p className="text-gray-600">
              Share your notes with others or keep them private - you&apos;re in control.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start Taking Better Notes Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their note-taking experience.
          </p>
          <Link
            href="/notes"
            className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Try it Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
