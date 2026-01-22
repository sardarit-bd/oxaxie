'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, LogOut, Zap, Briefcase, FileText, User, Minus, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DowngradeModal from '@/components/custom/DowngradeModal';
import { toast } from 'sonner';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isDowngrading, setIsDowngrading] = useState(false);
  const [downgradeModal, setDowngradeModal] = useState({
    isOpen: false,
    currentPlan: null
  });

  const handleDowngradeClick = (currentPlan) => {
    setDowngradeModal({
      isOpen: true,
      currentPlan: currentPlan
    });
  };

  const handleConfirmDowngrade = async () => {
    setIsDowngrading(true);
    
    try {
      const response = await fetch('/api/subscription/downgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Successfully downgraded to Free plan');

        setDowngradeModal({ isOpen: false, currentPlan: null });
        
        const authResponse = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (authResponse.ok) {
          const authData = await authResponse.json();
          const userData = authData.user?.data || authData.data;
          setUser(userData);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } else {
        toast.error(data.message || 'Failed to downgrade plan');
      }
    } catch (error) {
      toast.error('An error occurred while downgrading');
    } finally {
      setIsDowngrading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/login?redirect=/profile');
          return;
        }

        const data = await response.json();

        const userData = data.user?.data || data.data;
        
        if (data.success && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          router.push('/login?redirect=/profile');
        }
      } catch (error) {
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
    { category: "Usage", name: "Cases per month", free: "1 case", pro: "3", proPlus: "10+" },
    { category: "Features", name: "Document Generation", free: "1 Doc", pro: "Unlimited", proPlus: "Unlimited" },
    { category: "Features", name: "Download Document", free: <Minus className="w-4 h-4 text-gray-300 mx-auto"/>, pro: <Check className="w-4 h-4 text-green-600 mx-auto"/>, proPlus: <Check className="w-4 h-4 text-green-600 mx-auto"/> },
    { category: "Features", name: "Case History", free: <Minus className="w-4 h-4 text-gray-300 mx-auto"/>, pro: <Check className="w-4 h-4 text-green-600 mx-auto"/>, proPlus: <Check className="w-4 h-4 text-green-600 mx-auto"/> },
    { category: "Features", name: "AI Model", free: "Cloude Sonnet 4.5", pro: "Cloude Sonnet 4.5", proPlus: "Cloude Opus 4.5" },
    { category: "Support", name: "Support Level", free: "Community", pro: "Email", proPlus: "Dedicated 24/7" },
    { category: "Support", name: "Response Time", free: "Standard", pro: "24 Hours", proPlus: "Priority" },
  ];


  const formatPlanTier = (tier) => {
    if (!tier) return 'Free';
    const planMap = {
      'free': 'Free',
      'pro': 'Pro',
      'pro_plus': 'Pro Plus',
    };
    return planMap[tier] || tier.charAt(0).toUpperCase() + tier.slice(1);
  };


  const isCurrentPlan = (planTier) => {
    const currentTier = user?.subscription?.plan_tier || 'free';
    return currentTier === planTier;
  };

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

  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate usage percentages - NOW USING CASES
  const casesPercentage = user.usage?.cases_limit > 0 
    ? (user.usage.cases_used / user.usage.cases_limit) * 100 
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
            </div>

            {/* Usage Stats - NOW SHOWING CASES */}
            <div className="px-0 md:px-8 py-4 md:py-0">
               <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Usage Statistics</h2>
               
               {/* Cases */}
               <div className="mb-4">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="flex items-center gap-2 text-gray-600">
                     <Briefcase className="w-3 h-3"/> Cases
                   </span>
                   <span className="font-medium">
                     {user.usage?.cases_used || 0} / {user.usage?.cases_limit === -1 ? '∞' : (user.usage?.cases_limit || 0)}
                   </span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                   <div 
                     className={`h-2 rounded-full transition-all duration-300 ${
                       casesPercentage >= 90 ? 'bg-red-500' : 
                       casesPercentage >= 70 ? 'bg-orange-400' : 'bg-orange-400'
                     }`}
                     style={{ width: `${Math.min(casesPercentage, 100)}%` }}
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
                <Link href="/pricing">
                  <button 
                    className="mt-6 md:mt-0 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-lg shadow-gray-200 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-orange-400" fill="currentColor" />
                    {currentPlan === 'free' ? 'Upgrade to Pro' : 'Upgrade to Pro Plus'}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* --- COMPARISON TABLE SECTION --- */}
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div id="plans" className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">
              Compare <span className="italic">Plans</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Find the perfect balance of features and capability for your legal needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div 
              className="overflow-x-auto w-full touch-pan-x overscroll-x-contain custom-scrollbar pb-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                <thead>
                  <tr>
                    {/* STICKY CORNER */}
                    <th className="sticky left-0 z-20 p-4 md:p-6 bg-white w-[140px] md:w-1/4 border-r border-gray-100 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block md:hidden">
                        Features
                      </span>
                    </th>

                    {/* Free Header */}
                    <th className="p-4 md:p-6 min-w-[160px] md:min-w-[200px] text-center">
                      <h3 className="text-lg md:text-xl font-serif text-gray-900">Free</h3>
                      <div className="mt-2 text-2xl md:text-3xl font-bold font-sans">$0</div>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1">/forever</p>
                      {isCurrentPlan('free') ? (
                        <button
                          disabled
                          className="mt-4 w-full py-2 border rounded-lg text-xs md:text-sm font-medium border-green-500 text-green-600 bg-green-50 cursor-default"
                        >
                          Current
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDowngradeClick(currentPlan)}
                          className="mt-4 w-full py-2 border rounded-lg text-xs md:text-sm font-medium border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          Downgrade
                        </button>
                      )}
                    </th>

                    <DowngradeModal
                      isOpen={downgradeModal.isOpen}
                      onClose={() => setDowngradeModal({ isOpen: false, currentPlan: null })}
                      onConfirm={handleConfirmDowngrade}
                      currentPlan={downgradeModal.currentPlan}
                      isLoading={isDowngrading}
                    />

                    {/* Pro Header (Highlighted) */}
                    <th className="relative p-4 md:p-6 min-w-[160px] md:min-w-[200px] text-center bg-[#FFFBF0] border-l border-r border-orange-200">
                      <div className="absolute top-0 left-0 w-full bg-orange-400 h-1 md:h-1.5"></div>
                      <span className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-700 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                        Most Popular
                      </span>
                      <h3 className="text-lg md:text-xl font-serif text-gray-900 mt-2">Pro</h3>
                      <div className="mt-2 text-2xl md:text-3xl font-bold font-sans text-gray-900">$9</div>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1">/month</p>
                      <Link href="/pricing">
                        <button
                          disabled={isCurrentPlan('pro')}
                          className={`mt-4 w-full py-2 rounded-lg text-xs md:text-sm font-medium shadow-sm transition-colors ${
                            isCurrentPlan('pro')
                              ? 'bg-green-500 text-white cursor-default'
                              : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                          }`}
                        >
                          {isCurrentPlan('pro') ? 'Current' : 'Start Pro'}
                        </button>
                      </Link>
                    </th>

                    {/* Pro Plus Header */}
                    <th className="p-4 md:p-6 min-w-[160px] md:min-w-[200px] text-center">
                      <h3 className="text-lg md:text-xl font-serif text-gray-900">Pro Plus</h3>
                      <div className="mt-2 text-2xl md:text-3xl font-bold font-sans">$29</div>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1">/month</p>
                      <Link href="/pricing">
                        <button
                          disabled={isCurrentPlan('pro_plus')}
                          className={`mt-4 w-full py-2 border rounded-lg text-xs md:text-sm font-medium transition-colors ${
                            isCurrentPlan('pro_plus')
                              ? 'border-green-500 bg-green-500 text-white cursor-default'
                              : 'border-gray-900 bg-gray-900 text-white hover:bg-black cursor-pointer'
                          }`}
                        >
                          {isCurrentPlan('pro_plus') ? 'Current' : 'Go Pro Plus'}
                        </button>
                      </Link>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {features.map((feature, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      {/* STICKY FEATURE NAME */}
                      <td className="sticky left-0 z-10 p-3 md:p-4 pl-4 md:pl-6 text-xs md:text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-100 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-2 max-w-[120px] md:max-w-none break-words">
                          {feature.name}
                        </div>
                      </td>

                      {/* Free Value */}
                      <td className="p-3 md:p-4 text-center text-sm text-gray-600">
                        {feature.free}
                      </td>

                      {/* Pro Value (Highlighted) */}
                      <td className="p-3 md:p-4 text-center text-sm font-medium text-gray-900 bg-[#FFFBF0]/50 border-l border-r border-orange-100">
                        {feature.pro}
                      </td>

                      {/* Pro Plus Value */}
                      <td className="p-3 md:p-4 text-center text-sm text-gray-600">
                        {feature.proPlus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Swipe Hint */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 pointer-events-none">
              <span className="animate-pulse">←</span>
              Swipe to compare
              <span className="animate-pulse">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}