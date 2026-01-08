'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, LogOut, Zap, MessageSquare, FileText, User, Minus, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('Auth response status:', response.status, response.ok);

        if (!response.ok) {
          console.log('Response not OK, redirecting to login');
          router.push('/login?redirect=/profile');
          return;
        }

        const data = await response.json();
        console.log('Auth response data:', data);
        
        // Handle the nested response structure: data.user.data
        const userData = data.user?.data || data.data;
        
        if (data.success && userData) {
          console.log('Setting user data:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log('Data validation failed, redirecting to login. Success:', data.success, 'Has userData:', !!userData);
          router.push('/login?redirect=/profile');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login?redirect=/profile');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);
  

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Comparison Data
  const features = [
    { category: "Usage", name: "AI Chat Messages", free: "10 /mo", pro: "Unlimited", proPlus: "Unlimited" },
    { category: "Usage", name: "Cases per month", free: "0", pro: "3", proPlus: "10+" },
    { category: "Features", name: "Document Generation", free: "1 Doc", pro: "Standard", proPlus: "Advanced" },
    { category: "Features", name: "Download Formats", free: "View Only", pro: "PDF & Word", proPlus: "PDF, Word, LaTeX" },
    { category: "Features", name: "Case History", free: <Minus className="w-4 h-4 text-gray-300 mx-auto"/>, pro: <Check className="w-4 h-4 text-green-600 mx-auto"/>, proPlus: <Check className="w-4 h-4 text-green-600 mx-auto"/> },
    { category: "Features", name: "AI Model Quality", free: "Basic", pro: "Standard", proPlus: "GPT-4 / Claude 3" },
    { category: "Support", name: "Support Level", free: "Community", pro: "Email", proPlus: "Dedicated 24/7" },
    { category: "Support", name: "Response Time", free: "Standard", pro: "24 Hours", proPlus: "Priority" },
  ];

  // Helper function to format plan tier
  const formatPlanTier = (tier) => {
    if (!tier) return 'Free';
    const planMap = {
      'free': 'Free',
      'pro': 'Pro',
      'pro_plus': 'Pro Plus',
    };
    return planMap[tier] || tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Helper function to check if current plan
  const isCurrentPlan = (planTier) => {
    const currentTier = user?.subscription?.plan_tier || 'free';
    return currentTier === planTier;
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#F59F0A] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate usage percentages
  const messagesPercentage = user.usage?.messages_limit > 0 
    ? (user.usage.messages_used / user.usage.messages_limit) * 100 
    : 0;
  
  const documentsPercentage = user.usage?.documents_limit > 0 
    ? (user.usage.documents_used / user.usage.documents_limit) * 100 
    : 0;

  const currentPlan = user.subscription?.plan_tier || 'free';
  const subscriptionStatus = user.subscription?.status || 'active';

  return (
    <div className="min-h-screen bg-[#FBFAF9] text-[#1F2937] pb-20">
      
      {/* Navigation / Header */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/dashboard">
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </button>
        </Link>

        <h1 className="text-4xl font-serif text-gray-900 mb-8">Account Settings</h1>

        {/* --- USER DASHBOARD SECTION --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            
            {/* Profile Info */}
            <div className="flex flex-col justify-between pr-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-500">Member since {user.member_since}</p>
                  </div>
                </div>
              </div>
              {/* <button 
                onClick={handleLogout}
                className="flex items-center text-red-600 text-sm font-medium hover:text-red-700 transition-colors mt-4 md:mt-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button> */}
            </div>

            {/* Usage Stats */}
            <div className="px-0 md:px-8 py-4 md:py-0">
               <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Usage Statistics</h2>
               
               {/* Messages */}
               <div className="mb-4">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="flex items-center gap-2 text-gray-600">
                     <MessageSquare className="w-3 h-3"/> Messages
                   </span>
                   <span className="font-medium">
                     {user.usage?.messages_used || 0} / {user.usage?.messages_limit === -1 ? '∞' : (user.usage?.messages_limit || 10)}
                   </span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-300 ${
                       messagesPercentage >= 90 ? 'bg-red-500' : 
                       messagesPercentage >= 70 ? 'bg-orange-400' : 'bg-orange-400'
                     }`}
                     style={{ width: `${Math.min(messagesPercentage, 100)}%` }}
                   ></div>
                 </div>
               </div>

               {/* Documents */}
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="flex items-center gap-2 text-gray-600">
                     <FileText className="w-3 h-3"/> Documents
                   </span>
                   <span className="font-medium">
                     {user.usage?.documents_used || 0} / {user.usage?.documents_limit === -1 ? '∞' : (user.usage?.documents_limit || 1)}
                   </span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-300 ${
                       documentsPercentage >= 90 ? 'bg-red-500' : 
                       documentsPercentage >= 70 ? 'bg-orange-400' : 'bg-orange-400'
                     }`}
                     style={{ width: `${Math.min(documentsPercentage, 100)}%` }}
                   ></div>
                 </div>
               </div>
            </div>

            {/* Current Plan & CTA */}
            <div className="pl-0 md:pl-8 py-4 md:py-0 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Current Plan</h2>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-serif font-medium">
                      {formatPlanTier(currentPlan)} Plan
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${
                      subscriptionStatus === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : subscriptionStatus === 'cancelled'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                    </span>
                </div>
                <p className="text-sm text-gray-500">
                  {currentPlan === 'free' 
                    ? 'You are on the basic tier.' 
                    : currentPlan === 'pro'
                    ? 'Enjoy your Pro benefits!'
                    : 'Maximum features unlocked!'}
                </p>
              </div>
              
              {currentPlan !== 'pro_plus' && (
                <button 
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-6 md:mt-0 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-lg shadow-gray-200 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-orange-400" fill="currentColor" />
                  {currentPlan === 'free' ? 'Upgrade to Pro' : 'Upgrade to Pro Plus'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- COMPARISON TABLE SECTION --- */}
        <div id="plans" className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Compare <span className="italic">Plans</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the perfect balance of features and capability for your legal needs.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 bg-gray-50/50 w-1/4 min-w-[200px]"></th>
                  {/* Free Header */}
                  <th className="p-6 min-w-[200px] text-center border-l border-gray-100">
                    <h3 className="text-xl font-serif text-gray-900">Free</h3>
                    <div className="mt-2 text-3xl font-bold font-sans">$0</div>
                    <p className="text-xs text-gray-500 mt-1">/forever</p>
                    <button 
                      disabled={isCurrentPlan('free')}
                      className={`mt-4 w-full py-2 border rounded-lg text-sm font-medium ${
                        isCurrentPlan('free')
                          ? 'border-green-500 text-green-600 bg-green-50 cursor-default'
                          : 'border-gray-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      {isCurrentPlan('free') ? 'Current' : 'Downgrade'}
                    </button>
                  </th>
                  
                  {/* Pro Header (Highlighted) */}
                  <th className="relative p-6 min-w-[200px] text-center bg-[#FFFBF0] border-l border-r border-orange-200">
                    <div className="absolute top-0 left-0 w-full bg-orange-400 h-1.5"></div>
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                    <h3 className="text-xl font-serif text-gray-900 mt-2">Pro</h3>
                    <div className="mt-2 text-3xl font-bold font-sans text-gray-900">$9</div>
                    <p className="text-xs text-gray-500 mt-1">/month</p>
                    <button 
                      disabled={isCurrentPlan('pro')}
                      className={`mt-4 w-full py-2 rounded-lg text-sm font-medium shadow-sm ${
                        isCurrentPlan('pro')
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                      }`}
                    >
                      {isCurrentPlan('pro') ? 'Current' : 'Start Pro'}
                    </button>
                  </th>

                  {/* Pro Plus Header */}
                  <th className="p-6 min-w-[200px] text-center border-l border-gray-100">
                    <h3 className="text-xl font-serif text-gray-900">Pro Plus</h3>
                    <div className="mt-2 text-3xl font-bold font-sans">$29</div>
                    <p className="text-xs text-gray-500 mt-1">/month</p>
                    <button 
                      disabled={isCurrentPlan('pro_plus')}
                      className={`mt-4 w-full py-2 border rounded-lg text-sm font-medium ${
                        isCurrentPlan('pro_plus')
                          ? 'border-green-500 bg-green-500 text-white cursor-default'
                          : 'border-gray-900 bg-gray-900 text-white hover:bg-black cursor-pointer'
                      }`}
                    >
                      {isCurrentPlan('pro_plus') ? 'Current' : 'Go Pro Plus'}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {features.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    {/* Feature Name */}
                    <td className="p-4 pl-6 text-sm font-medium text-gray-700 bg-gray-50/30">
                      <div className="flex items-center gap-2">
                        {feature.name}
                        <Info className="w-3 h-3 text-gray-400 cursor-help" />
                      </div>
                    </td>
                    
                    {/* Free Value */}
                    <td className="p-4 text-center text-sm text-gray-600 border-l border-gray-100">
                      {feature.free}
                    </td>

                    {/* Pro Value (Highlighted) */}
                    <td className="p-4 text-center text-sm font-medium text-gray-900 bg-[#FFFBF0]/50 border-l border-r border-orange-100">
                      {feature.pro}
                    </td>

                    {/* Pro Plus Value */}
                    <td className="p-4 text-center text-sm text-gray-600 border-l border-gray-100">
                      {feature.proPlus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Footnote */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center md:hidden">
            <p className="text-xs text-gray-500">Scroll horizontally to view all plans</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Prices are in USD. You can cancel at any time.
        </p>
      </div>
    </div>
  );
}