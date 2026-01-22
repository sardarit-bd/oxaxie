'use client';

import React, { useState } from 'react';
import { Check, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentModal from '../../../components/PaymentModal';

export default function PricingPage() {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  const plans = [
    {
      id: 1,
      name: 'Free',
      type: 'free',
      price: 0,
      period: 'forever',
      description: 'Try our AI legal guidance',
      features: [
        { text: 'Claude Sonnet 4.5', included: true },
        { text: '10 AI chat messages', included: true },
        { text: '1 document generation', included: true },
        { text: 'Basic legal templates', included: true },
        { text: 'Community support', included: true },
        { text: 'No document downloads', included: false },
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-50 border-1 border-gray-200 hover:bg-[#FFA70A] text-gray-800',
      cardStyle: 'bg-white rounded-2xl border-2 border-gray-200',
    },
    {
      id: 2,
      name: 'Pro',
      type: 'pro',
      price: 9,
      period: 'month',
      description: 'For individuals with legal needs',
      popular: true,
      features: [
        { text: 'Claude Sonnet 4.5', included: true },
        { text: '3 cases per month', included: true },
        { text: 'Document generation', included: true },
        { text: 'Download PDF & Word docs', included: true },
        { text: 'Case history', included: true },
        { text: 'Email support', included: true },
      ],
      buttonText: 'Start Pro',
      buttonStyle: 'bg-[#F59F0A] hover:bg-[#F5A820] text-black',
      cardStyle: 'bg-[#FAF5ED] rounded-2xl border-2 border-[#F59F0A]',
    },
    {
      id: 3,
      name: 'Pro Plus',
      type: 'pro_plus',
      price: 29,
      period: 'month',
      description: 'For power users & professionals',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Claude Opus 4.5', included: true },
        { text: '10+ cases per month', included: true },
        { text: 'Top AI agent models', included: true },
        { text: 'Priority response times', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Dedicated support', included: true },
      ],
      buttonText: 'Go Pro Plus',
      buttonStyle: 'bg-gray-50 border-1 border-gray-200 hover:bg-[#FFA70A] text-gray-800',
      cardStyle: 'bg-white rounded-2xl border border-gray-200',
    },
  ];

  const handlePlanSelect = async (plan) => {
    // If it's the free plan, no auth needed usually, or we handle it differently
    if (plan.type === 'free') {
      router.push('/dashboard');
      return;
    }

    // Start loading state
    setProcessingPlanId(plan.id);

    try {
      // Check auth status ONLY when trying to buy
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        // User is NOT authenticated. 
        // Real-world pattern: Send them to login, but tell them to come back here.
        router.push('/login?redirect=/pricing');
        return;
      }

      // User IS authenticated. Open payment modal.
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error checking auth:', error);
      // Handle network errors (optional: show toast notification)
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    router.push('/dashboard?payment=success');
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  // No global loading state needed anymore!
  return (
    <div className="min-h-screen bg-[#FBFAF9] py-5 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mt-5 mb-8 px-8">
          <Link href="/">
            <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16 px-4 md:px-4">
          <h1 className="text-3xl md:text-5xl font-serif mb-4">
            Simple, Transparent <em className="font-serif">Pricing</em>
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core AI-powered legal guidance.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <div key={plan.id} className={`${plan.cardStyle} p-8 flex flex-col h-full relative`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#F59F0A] text-black text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif mb-4">{plan.name}</h2>
                <div className="mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className={`space-y-4 ${plan.type === 'free' ? 'mb-2' : 'mb-3'}`}>
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      !feature.included ? 'pt-2 pb-2 border-t border-gray-200' : ''
                    }`}
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Minus className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={processingPlanId === plan.id}
                className={`w-full ${plan.buttonStyle} font-semibold py-3 rounded-xl transition-colors mt-auto cursor-pointer flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {processingPlanId === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </button>

              <div className="flex-grow"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-sm">
            Questions about which plan is right for you?
          </p>
          <button className="bg-gray-50 font-semibold border border-gray-300 hover:bg-[#F09C0E] text-gray-800 font-medium px-6 py-2 rounded-xl transition-colors text-sm cursor-pointer">
            <a href='/contact'>Contact Us</a>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleCloseModal}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}