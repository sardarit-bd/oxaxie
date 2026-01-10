'use client';

import { X, AlertTriangle } from "lucide-react";

const DowngradeModal = ({ isOpen, onClose, onConfirm, currentPlan, isLoading }) => {
  if (!isOpen) return null;

  const formatPlanName = (plan) => {
    const planMap = {
      'free': 'Free',
      'pro': 'Pro',
      'pro_plus': 'Pro Plus',
    };
    return planMap[plan] || plan;
  };

  const getLostFeatures = (plan) => {
    if (plan === 'pro') {
      return [
        'Unlimited AI chat messages (reduced to 10/month)',
        'Case creation (reduced to 0)',
        'Advanced document generation',
        'PDF & Word downloads (view only)',
        'Email support',
      ];
    } else if (plan === 'pro_plus') {
      return [
        'Unlimited AI chat messages (reduced to 10/month)',
        'Case creation (reduced to 0)',
        'Advanced document generation with GPT-4',
        'Multiple download formats',
        'Priority 24/7 support',
        'Extended case history',
      ];
    }
    return [];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Downgrade to Free Plan?
        </h2>

        <p className="text-gray-600 mb-4">
          You're about to downgrade from <strong>{formatPlanName(currentPlan)}</strong> to <strong>Free</strong>. 
          This will happen immediately and you'll lose access to:
        </p>

        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-900 mb-2 text-sm">Features you'll lose:</h3>
          <ul className="space-y-1.5 text-sm text-red-800">
            {getLostFeatures(currentPlan).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          Note: Your current billing period will end and you won't be charged again. 
          Any remaining time on your subscription will not be refunded.
        </p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Yes, Downgrade to Free'
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DowngradeModal;