import Link from "next/link";
import { ArrowRight, Users, Award, Target } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-founder",
      bio: "Former AI researcher at Google with 10+ years of experience in machine learning and enterprise software.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Sarah Johnson",
      role: "CTO & Co-founder",
      bio: "Ex-Microsoft engineer specializing in scalable cloud architectures and developer tools.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of AI",
      bio: "PhD in Computer Science from Stanford, former OpenAI researcher with expertise in large language models.",
      image: "/api/placeholder/150/150"
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Developer-First",
      description: "We build tools that developers love to use, with great documentation, examples, and support."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Open & Transparent",
      description: "Open source components, transparent pricing, and clear communication about our platform."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Enterprise-Ready",
      description: "Security, reliability, and scalability built in from day one for production workloads."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">AI Foundry</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Democratizing AI for Developers
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We believe every developer should have access to powerful AI capabilities
            without the complexity of managing multiple providers and infrastructure.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              AI Foundry was born from our frustration with the complexity of integrating 
              multiple AI providers into production applications. We spent countless hours 
              building custom integrations, handling authentication, managing rate limits, 
              and ensuring security compliance.
            </p>
            
            <p>
              We realized that every developer was solving the same problems over and over again. 
              That's why we built AI Foundry - to abstract away the complexity and let developers 
              focus on what they do best: building amazing applications.
            </p>
            
            <p>
              Today, AI Foundry powers thousands of applications across startups and enterprises, 
              providing reliable, secure, and scalable access to the world's best AI models.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-indigo-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Experienced engineers and AI researchers passionate about developer tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16 bg-indigo-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10M+</div>
              <div className="text-indigo-200">API Requests Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-indigo-200">Developers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-indigo-200">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">3</div>
              <div className="text-indigo-200">AI Providers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers building the future with AI Foundry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 inline-flex items-center justify-center"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/features"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}