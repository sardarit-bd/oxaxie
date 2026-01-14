'use client';

import React, { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { Scale, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

// 1. Rename logic to ResetPasswordForm
function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    setMounted(true);
    if (!token || !email) {
      toast.error('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      // Success - Show toast and redirect
      toast.success('Password reset successfully!', {
        description: 'Redirecting to login...',
        duration: 3000,
      });
      
      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      
    } catch (err) {
      console.error('Reset Password error:', err);
      
      // Show error toast
      if (err.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else if (err.errors?.email) {
        toast.error(err.errors.email[0] || 'Invalid or expired reset token.');
      } else {
        toast.error(err.message || 'Unable to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Form Container */}
      <div className="w-full lg:w-1/2 bg-[#FBFAF9] flex items-start sm:items-center justify-center p-6 pt-4 sm:p-8">
        <div className="w-full max-w-[340px] sm:max-w-md mx-auto">
          {/* Back to home link */}
          <Link href="/">
            <button className="flex items-center gap-2 text-[#666] text-sm mb-12 hover:text-[#333] transition-colors">
              <ArrowLeft size={16} />
              <span className="cursor-pointer">Back to home</span>
            </button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Scale className="text-[#1a1a1a]" size={30} strokeWidth={2} />
              <h1 className="text-2xl font-serif text-[#1a1a1a]">Advocate</h1>
            </div>
            
            <h2 className="text-4xl font-serif text-[#1a1a1a] mb-3">Reset Password</h2>
            <p className="text-[#666] text-base">
              Enter your new password below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Display (read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email || ''}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border-2 border-[#d4d4d0] rounded-xl text-[#666] cursor-not-allowed"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white border-2 border-[#d4d4d0] rounded-xl text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all pr-24"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Lock size={20} className="text-[#999]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#999] hover:text-[#666] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#666] mt-1">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white border-2 border-[#d4d4d0] rounded-xl text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all pr-24"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Lock size={20} className="text-[#999]" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#999] hover:text-[#666] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !passwordConfirmation || !token || !email}
              className="w-full bg-[#f59e0b] hover:bg-[#ea950a] text-slate-800 font-[560] py-3.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Back to Login Link */}
          <p className="text-center text-[#666] text-md mt-6">
            Remember your password?{' '}
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
            Secure Your Account
          </h2>
          <p className="text-[#b8c5d0] text-lg leading-relaxed">
            Choose a strong password to protect your legal documents and sensitive information.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}