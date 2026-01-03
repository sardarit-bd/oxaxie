'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
      <div className="max-w-md bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-serif mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/pricing')}
            className="flex-1 bg-[#F59F0A] hover:bg-[#F5A820] text-black font-semibold py-3 rounded-xl transition-colors cursor-pointer"
          >
            Back to Pricing
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition-colors cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}