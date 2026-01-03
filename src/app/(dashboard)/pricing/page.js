// 'use client';


// import React from 'react';
// import { Check, Minus, ArrowLeft } from 'lucide-react';
// import Link from 'next/link';

// export default function PricingPage() {
//   return (
//     <div className="min-h-screen bg-[#FBFAF9] py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Back button */}
//         <div className="mt-20 mb-8 px-8">
//           <Link href="/">
//             <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm cursor-pointer">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to home
//           </button>
//           </Link>
//         </div>

//         {/* Header */}
//         <div className="text-center mb-16 px-4 md:px-4">
//           <h1 className="text-3xl md:text-5xl font-serif mb-4">
//             Simple, Transparent <em className="font-serif">Pricing</em>
//           </h1>
//           <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
//             Choose the plan that fits your needs. All plans include our core AI-powered legal guidance.
//           </p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
//           {/* Free Plan */}
//           <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 flex flex-col h-full">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-serif mb-4">Free</h2>
//               <div className="mb-2">
//                 <span className="text-4xl font-bold">$0</span>
//                 <span className="text-gray-500 text-sm">/forever</span>
//               </div>
//               <p className="text-gray-500 text-sm">Try our AI legal guidance</p>
//             </div>

//             <div className="space-y-4 mb-2">
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">10 AI chat messages</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">1 document generation</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Basic legal templates</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Community support</span>
//               </div>
//               <div className="flex items-start pt-2 pb-2 border-t border-gray-200">
//                 <Minus className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-500 text-sm">No document downloads</span>
//               </div>
//             </div>

//             <button className="w-full bg-gray-50 border-1 border-gray-200 hover:bg-[#FFA70A] text-gray-800 font-semibold py-3 rounded-xl transition-colors mt-auto cursor-pointer">
//               Get Started
//             </button>
            
//             <div className="flex-grow"></div>
//           </div>

//           {/* Pro Plan */}
//           <div className="bg-[#FAF5ED] rounded-2xl border-2 border-[#F59F0A] p-8 flex flex-col h-full relative">
//             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//               <span className="bg-[#F59F0A] text-black text-xs font-semibold px-4 py-1 rounded-full">
//                 Most Popular
//               </span>
//             </div>

//             <div className="text-center mb-8">
//               <h2 className="text-2xl mb-4 font-serif">Pro</h2>
//               <div className="mb-2">
//                 <span className="text-4xl font-bold">$9</span>
//                 <span className="text-gray-500 text-sm">/per month</span>
//               </div>
//               <p className="text-gray-500 text-sm">For individuals with legal needs</p>
//             </div>

//             <div className="space-y-4 mb-3">
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">3 cases per month</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Document generation</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Download PDF & Word docs</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Case history</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Email support</span>
//               </div>
//             </div>

//             <button className="w-full bg-[#F59F0A] hover:bg-[#F5A820] text-black font-semibold py-3 rounded-xl transition-colors mt-auto cursor-pointer">
//               Start Pro
//             </button>
            
//             <div className="flex-grow"></div>
//           </div>

//           {/* Pro Plus Plan */}
//           <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col h-full">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-serif mb-4">Pro Plus</h2>
//               <div className="mb-2">
//                 <span className="text-4xl font-bold">$29</span>
//                 <span className="text-gray-500 text-sm">/per month</span>
//               </div>
//               <p className="text-gray-500 text-sm">For power users & professionals</p>
//             </div>

//             <div className="space-y-4 mb-3">
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Everything in Pro</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">10+ cases per month</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Top AI agent models</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Priority response times</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Advanced analytics</span>
//               </div>
//               <div className="flex items-start">
//                 <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
//                 <span className="text-gray-700 text-sm">Dedicated support</span>
//               </div>
//             </div>

//             <button className="w-full bg-gray-50 border-1 border-gray-200 hover:bg-[#FFA70A] text-gray-800 font-semibold py-3 rounded-xl transition-colors mt-auto cursor-pointer">
//               Go Pro Plus
//             </button>
            
//             <div className="flex-grow"></div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center">
//           <p className="text-gray-500 mb-4 text-sm">
//             Questions about which plan is right for you?
//           </p>
//           <button className="bg-gray-50 font-semibold border border-gray-300 hover:bg-[#F09C0E] text-gray-800 font-medium px-6 py-2 rounded-xl transition-colors text-sm cursor-pointer">
//             Contact Us
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { Check, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentModal from '../../../components/PaymentModal';

export default function PricingPage() {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      name: 'Free',
      type: 'free',
      price: 0,
      period: 'forever',
      description: 'Try our AI legal guidance',
      features: [
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

  const handlePlanSelect = (plan) => {
    if (plan.type === 'free') {
      // Handle free plan signup differently (no payment needed)
      router.push('/signup?plan=free');
      return;
    }

    // Open payment modal for paid plans
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    
    // Show success message or redirect to dashboard
    router.push('/dashboard?payment=success');
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF9] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mt-20 mb-8 px-8">
          <Link href="/">
            <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
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
                className={`w-full ${plan.buttonStyle} font-semibold py-3 rounded-xl transition-colors mt-auto cursor-pointer flex items-center justify-center`}
              >
                {plan.buttonText}
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
            Contact Us
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