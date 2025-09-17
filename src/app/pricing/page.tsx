import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      interval: "month",
      description: "Perfect for individuals and small projects",
      features: [
        "1,000 AI requests per month",
        "Access to OpenAI GPT-3.5",
        "Basic API access",
        "Email support",
        "Community forum access"
      ],
      priceId: process.env.STRIPE_PRICE_MONTHLY,
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      interval: "month",
      description: "Ideal for growing businesses and teams",
      features: [
        "10,000 AI requests per month",
        "Access to all AI providers",
        "Priority API access",
        "Real-time events",
        "GitHub webhook integration",
        "Priority email support",
        "Advanced analytics"
      ],
      priceId: process.env.STRIPE_PRICE_MONTHLY,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      interval: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited AI requests",
        "Custom AI model integrations",
        "Dedicated infrastructure",
        "24/7 phone support",
        "Custom SLA",
        "On-premise deployment",
        "Advanced security features"
      ],
      priceId: null,
      popular: false,
    },
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
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your AI-powered applications. 
            Upgrade or downgrade at any time.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular
                    ? "ring-2 ring-indigo-600 transform scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.interval && (
                      <span className="text-gray-600">/{plan.interval}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  {plan.priceId ? (
                    <Link
                      href="/register"
                      className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold text-lg ${
                        plan.popular
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  ) : (
                    <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800">
                      Contact Sales
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change plans at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limits. You can
                upgrade your plan or purchase additional requests as needed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee for all plans. Contact
                support if you're not satisfied with our service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all new accounts get 100 free AI requests to test our
                platform before choosing a paid plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}