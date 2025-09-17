import Link from "next/link";
import { ArrowRight, Zap, Shield, Brain, Globe, Clock, Code } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Multiple AI Providers",
      description: "Seamlessly integrate with OpenAI, Azure OpenAI, and Hugging Face through unified APIs with automatic failover and load balancing.",
      details: [
        "OpenAI GPT-3.5, GPT-4, and GPT-4 Turbo support",
        "Azure OpenAI with custom deployments",
        "Hugging Face Inference API integration",
        "Automatic provider failover",
        "Load balancing across providers"
      ]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Built-in authentication, rate limiting, input validation, and secure webhook handling for production workloads.",
      details: [
        "OAuth 2.0 with Google and Facebook",
        "Magic link email authentication",
        "Rate limiting and DDoS protection",
        "Input validation and sanitization",
        "HMAC signature verification for webhooks"
      ]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Events",
      description: "Server-sent events for live updates, webhook integrations, and real-time monitoring of your AI operations.",
      details: [
        "Server-Sent Events (SSE) for real-time updates",
        "GitHub webhook integration",
        "Stripe webhook handling",
        "Custom webhook endpoints",
        "Event streaming and monitoring"
      ]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Deployment",
      description: "Deploy anywhere with Docker containers or serverless platforms like Vercel with automatic scaling.",
      details: [
        "Vercel serverless deployment",
        "Docker containerization",
        "Kubernetes support",
        "Auto-scaling infrastructure",
        "Global CDN integration"
      ]
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Usage Analytics",
      description: "Comprehensive analytics and monitoring for your AI usage, costs, and performance metrics.",
      details: [
        "Real-time usage tracking",
        "Cost analysis and forecasting",
        "Performance metrics",
        "API response time monitoring",
        "Error rate tracking"
      ]
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Developer Tools",
      description: "Rich APIs, SDKs, and development tools to integrate AI capabilities into your applications quickly.",
      details: [
        "RESTful API endpoints",
        "Interactive API documentation",
        "Code examples and SDKs",
        "Postman collections",
        "GitHub integration examples"
      ]
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
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for AI Integration
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive platform that handles the complexity of AI model 
            integration so you can focus on building amazing applications.
          </p>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 inline-flex items-center"
          >
            Start Building <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Examples */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Integration
            </h2>
            <p className="text-lg text-gray-600">
              Get started with just a few lines of code
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{`// Generate text with OpenAI
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    input: 'Write a creative story about AI',
    max_tokens: 150
  })
});

const result = await response.json();
console.log(result.text);`}</pre>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of developers using AI Foundry to power their applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}