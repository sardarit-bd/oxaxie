"use client";

import React, { useState } from 'react';
import { Scale, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // Parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        throw new Error("Server returned an invalid response. Please try again.");
      }

      console.log(data.message);

      if (!response.ok) {
        throw data;
      }

      // Success - redirect to dashboard
      router.push("/dashboard");

    } catch (err) {
      console.error('Signup error:', err);
      
      if (err.status === 422) {
        const errors = err.errors || {};
        const messages = Object.values(errors).flat();
        setError(messages[0] || 'Please check your input.');
      } else if (err.status === 409 || err.message?.toLowerCase().includes('already')) {
        setError('This email is already registered.');
      } else if (err.status === 503) {
        setError('Unable to connect to server. Please check your connection and try again.');
      } else {
        setError(err.message || 'Unable to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            
            <h2 className="text-4xl font-serif text-[#1a1a1a] mb-3">Create your account</h2>
            <p className="text-[#666] text-base">
              Get started with AI-powered legal guidance today.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form - CORRECTLY WRAPS ALL FIELDS AND BUTTON */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-slate-700 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-white border-2 border-[#d4d4d0] rounded-xl text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all"
              />
            </div>

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

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading || !name || !email || !password}
              className="w-full bg-[#f59e0b] hover:bg-[#ea950a] text-slate-800 font-[560] py-3.5 rounded-lg transition-colors shadow-sm"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-[#666] text-md mt-6">
            Already have an account?{' '}
            <Link href="/login">
              <button className="text-[#f59e0b] hover:text-[#ea950a] font-medium transition-colors cursor-pointer">
                Login
              </button>
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#232F46] items-center justify-center">
        <div className="max-w-xl text-center p-8">
          <h2 className="text-4xl text-white mb-6">
            Legal guidance when you need it most
          </h2>
          <p className="text-[#b8c5d0] text-lg leading-relaxed">
            Get clear, actionable advice for your legal situation. Upload documents, chat with our AI, and generate professional legal documents.
          </p>
        </div>
      </div>
    </main>
  );
}