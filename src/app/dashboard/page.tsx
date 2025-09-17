"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Brain, 
  CreditCard, 
  Key, 
  LogOut, 
  Settings, 
  User,
  Zap
} from "lucide-react";
import { signOut } from "next-auth/react";

interface UsageStats {
  totalRequests: number;
  thisMonth: number;
  lastMonth: number;
  topProvider: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UsageStats>({
    totalRequests: 0,
    thisMonth: 0,
    lastMonth: 0,
    topProvider: "N/A"
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    // Mock stats for now - in real app, fetch from API
    setStats({
      totalRequests: 1547,
      thisMonth: 234,
      lastMonth: 189,
      topProvider: "OpenAI"
    });
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">AI Foundry</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/models"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Models
              </Link>
              <Link
                href="/account"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Account
              </Link>
              <Link
                href="/docs"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Docs
              </Link>
              
              <div className="flex items-center space-x-3">
                <img
                  src={session.user?.image || "/api/placeholder/32/32"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your AI applications today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Provider</p>
                <p className="text-2xl font-bold text-gray-900">{stats.topProvider}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-2xl font-bold text-gray-900">Free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Generated text with OpenAI GPT-3.5</span>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">API key created</span>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Account created</span>
                </div>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/models"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Brain className="h-5 w-5 text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Test AI Models</p>
                  <p className="text-xs text-gray-500">Try different providers and models</p>
                </div>
              </Link>

              <Link
                href="/account"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Key className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Manage API Keys</p>
                  <p className="text-xs text-gray-500">Create and manage your API keys</p>
                </div>
              </Link>

              <Link
                href="/docs"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">View Documentation</p>
                  <p className="text-xs text-gray-500">Learn how to integrate our APIs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}