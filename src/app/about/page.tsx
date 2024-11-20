import Header from '@/components/Header';
import { MapPin, Mail, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SkillTag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 rounded-full text-sm">
    {children}
  </span>
);

export default function AboutPage() {
    const skills = {
        languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
        frontend: ['ReactJS', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'],
        backend: [
          'Node.js',
          'ExpressJS',
          'MongoDB',
          'PostgreSQL',
          'MySQL',
          'Redis',
          'REST API',
          'SOAP API',
          'WebSocket',
          'RabbitMQ',
          'Kafka',
          'Strapi',
          'Microservices Design',
          'Swagger',
          'MQTT',
          'EMQX'
        ],
        cloud: [
          'Amazon Web Services (AWS)',
          'Docker',
          'Kubernetes',
          'Docker Swarm',
          'Heroku',
          'Jenkins',
          'Vercel',
          'Linux'
        ],
        versionControl: ['Gerrit', 'Git', 'GitHub'],
        testing: ['Selenium', 'Nightwatch', 'Mocha', 'Cypress'],
      };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
        <div className="container mx-auto px-6">
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src="https://avatars.githubusercontent.com/u/48206706?v=4"
                    alt="Prabhakar Kumar"
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Hi, I&apos;m Prabhakar Kumar 
              </h1>
              <p className="text-xl text-gray-600 mb-4">Building digital experiences that make a difference</p>
              <div className="flex items-center justify-center gap-3 text-gray-500 mb-8">
                <MapPin className="w-4 h-4" />
                <span>Bengaluru</span>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <Mail className="w-4 h-4" />
                <a href="mailto:kumarprabhakar2121@gmail.com" className="hover:text-blue-600">
                  kumarprabhakar2121@gmail.com
                </a>
              </div>
              <div className="flex justify-center gap-6 mb-8">
                <Link
                  href="https://www.linkedin.com/in/prabhakar-kumar-5708b7183/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </Link>
                <Link
                  href="https://github.com/kumarprabhakar2121/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About Me</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I&apos;m a passionate software engineer based in Bengaluru, with a deep love for creating elegant solutions to complex problems.
                  My journey in tech started with a curiosity about how things work, which evolved into a career building impactful digital experiences.
                </p>
                <p>
                  When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge
                  with the developer community. I believe in the power of technology to transform ideas into reality and am constantly pushing
                  the boundaries of what&apos;s possible.
                </p>
                <p>
                  Currently, I&apos;m focused on building intuitive and efficient web applications that make a difference in people&apos;s lives.
                  I&apos;m particularly excited about the intersection of user experience and cutting-edge technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Let&apos;s Connect</h2>
            <p className="text-gray-600 mb-8">
              I&apos;m always interested in hearing about new projects and opportunities.
              Feel free to reach out if you&apos;d like to collaborate or just chat about technology!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="mailto:kumarprabhakar2121@gmail.com"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
