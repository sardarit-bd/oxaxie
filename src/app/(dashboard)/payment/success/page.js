'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { paymentService } from '@/services/paymentService';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent_id');
        const paymentId = searchParams.get('payment_id');

        if (!paymentIntentId || !paymentId) {
          throw new Error('Missing payment information');
        }

        // Verify payment with backend
        await paymentService.verifyPayment(paymentId, {
          payment_intent_id: paymentIntentId,
        });

        setVerifying(false);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err.message || 'Failed to verify payment');
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#F59F0A] mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your subscription</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h2 className="text-2xl font-serif mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-[#F59F0A] hover:bg-[#F5A820] text-black font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
      <div className="max-w-md bg-white rounded-2xl border-2 border-green-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-serif mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-2">
          Your subscription has been activated successfully.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Redirecting to dashboard in a moment...
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-[#F59F0A] hover:bg-[#F5A820] text-black font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}