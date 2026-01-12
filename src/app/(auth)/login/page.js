'use client';

import React, { useState, Suspense } from 'react';
import { Scale, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Extract the form logic into a separate component
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw err;
      }

      console.log('✅ Login successful, redirecting to:', redirectUrl);

      // Redirect to the intended page or dashboard
      router.push(redirectUrl);

    } catch (err) {
      console.error('Login error:', err);
      
      if (err.status === 401) {
        setError('The credentials do not match our records.');
      } else if (err.status === 422) {
        const firstError = Object.values(err.errors || {})[0]?.[0];
        setError(firstError || 'Please check your input.');
      } else {
        setError(err.message || 'Unable to login. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Redirect Notice */}
      {redirectUrl !== '/dashboard' && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Please login to continue to your destination.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-2 text-slate-700 font-semibold">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 bg-white border-2 border-[#d4d4d0] rounded-xl text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#1a1a1a] mb-2 text-slate-700 font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-white border-2 border-[#d4d4d0] rounded-xl text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-[#f59e0b] hover:bg-[#ea950a] text-slate-800 font-[560] py-3.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-center text-[#666] text-md mt-6">
        Don't have an account?{' '}
        <Link href="/signup">
          <button className="text-[#f59e0b] hover:text-[#ea950a] font-medium transition-colors cursor-pointer">
            Sign up
          </button>
        </Link>
      </p>
    </>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      <div className="w-full lg:w-1/2 bg-[#FBFAF9] flex items-start sm:items-center justify-center p-6 pt-4 sm:p-8">
        <div className="w-full max-w-[340px] sm:max-w-md mx-auto">
          {/* Back to home link */}
          <Link href="/">
            <button className="flex items-center gap-2 text-[#666] text-sm mb-12 hover:text-[#333] transition-colors">
              <ArrowLeft size={16} />
              <span className="cursor-pointer">Back to home</span>
            </button>
          </Link>

          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Scale className="text-[#1a1a1a]" size={30} strokeWidth={2} />
              <h1 className="text-2xl font-serif text-[#1a1a1a]">Advocate</h1>
            </div>
            
            <h2 className="text-4xl font-serif text-[#1a1a1a] mb-3">Welcome back</h2>
            <p className="text-[#666] text-base">
              Login to access your legal dashboard.
            </p>
          </div>

          {/* Wrap LoginForm in Suspense */}
          <Suspense fallback={
            <div className="space-y-5">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      {/* Right Side - Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#232F46] items-center justify-center">
        <div className="max-w-xl text-center p-8">
          <h2 className="text-4xl text-white mb-6">
            Your legal assistant awaits
          </h2>
          <p className="text-[#b8c5d0] text-lg leading-relaxed">
            Access your cases, chat with AI, and manage your legal documents all in one place.
          </p>
        </div>
      </div>
    </main>
  );
}