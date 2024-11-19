import { Github, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 relative">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100">
                <Image
                  src="https://avatars.githubusercontent.com/u/48206706?v=4"
                  alt="Prabhakar Kumar"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Prabhakar Kumar
              </h1>
              <p className="text-xl text-gray-600">
                Software Developer
              </p>
            </div>
            
            <div className="flex justify-center gap-4 mb-12">
              <Link
                href="https://www.linkedin.com/in/prabhakar-kumar/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link
                href="https://github.com/yourgithub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Github className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About Me</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I'm a passionate Software Developer with expertise in building modern web applications.
                Currently, I focus on creating intuitive and efficient solutions that make a difference
                in how people work and interact with technology.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notes is one of my part-time projects where I explored building a minimalist yet
                powerful note-taking application. The project showcases my interest in creating
                tools that enhance productivity while maintaining simplicity.
              </p>
            </div>
          </div>
        </section>

        {/* Project Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About Notes</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notes is a minimalist note-taking application designed with simplicity and elegance in mind.
                Built using modern web technologies including Next.js, React, and TypeScript, it provides
                a seamless and responsive experience across all devices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Technology Stack</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Next.js 15.0.3</li>
                    <li>• React (Latest RC)</li>
                    <li>• TypeScript</li>
                    <li>• TailwindCSS</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Rich Text Editing</li>
                    <li>• Local Storage</li>
                    <li>• Responsive Design</li>
                    <li>• Dark Mode (Coming Soon)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
