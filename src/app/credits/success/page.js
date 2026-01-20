'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';


function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div className="mb-6">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Credits Purchased!
      </h1>

      <p className="text-gray-600 mb-6">
        Your credits have been successfully added to your account and are ready to use.
      </p>

      {sessionId && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Session ID:</p>
          <p className="text-xs text-gray-400 font-mono break-all">{sessionId}</p>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Redirecting to dashboard in <span className="font-semibold text-green-600">{countdown}</span> seconds...
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
}

export default function CreditSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}