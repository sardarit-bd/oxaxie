"use client";

import React, { useState } from 'react';
import { Scale, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sign in:', { email, password });
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

          {/* Form */}
          <div className="space-y-5">
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

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#f59e0b] hover:bg-[#ea950a] text-slate-800 font-[560] py-3.5 rounded-lg transition-colors shadow-sm"
            >
              Create Account
            </button>

            {/* Login */}
            <p className="text-center text-[#666] text-md">
              Already have an account?{' '}
              <Link href="/login">
              <button className="text-[#f59e0b] hover:text-[#ea950a] font-medium transition-colors cursor-pointer">
                Login
              </button>
              </Link>
              
            </p>
          </div>
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