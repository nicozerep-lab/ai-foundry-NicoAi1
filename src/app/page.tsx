import Link from "next/link";
import { ArrowRight, Brain, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">AI Foundry</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Unleash the Power of
              <span className="text-indigo-600"> AI Models</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access OpenAI, Azure OpenAI, and Hugging Face models through a single, 
              secure platform. Built for developers, designed for scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multiple AI Providers
              </h3>
              <p className="text-gray-600">
                Seamlessly integrate with OpenAI, Azure OpenAI, and Hugging Face 
                through unified APIs with automatic failover.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enterprise Security
              </h3>
              <p className="text-gray-600">
                Built-in authentication, rate limiting, input validation, 
                and secure webhook handling for production workloads.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Events
              </h3>
              <p className="text-gray-600">
                Server-sent events for live updates, webhook integrations, 
                and real-time monitoring of your AI operations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}