'use client';

import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';

export default function CreditPurchaseModal({ isOpen, onClose, message, creditOptions, availableCredits }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async (amount) => {
    setSelectedAmount(amount);
    setIsProcessing(true);

    try {
      
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount })
      });

      const data = await response.json();

      if (data.success && data.data?.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.checkout_url;
      } else {
        // Show error message
        alert(data.message || 'Failed to initiate purchase');
        setIsProcessing(false);
        setSelectedAmount(null);
      }
    } catch (error) {
      alert('Failed to purchase credits. Please try again.');
      setIsProcessing(false);
      setSelectedAmount(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#F59F0A] rounded-full flex items-center justify-center mr-3">
              <CreditCard className="w-6 h-6 text-gray-50" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purchase Credits</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-4">{message}</p>

        {/* Available Credits */}
        {availableCredits > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              Current Credits: <span className="font-semibold">${availableCredits.toFixed(2)}</span>
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            💡 Credits are added to your Pro Plus plan and expire at the end of your billing cycle.
          </p>
        </div>

        {/* Credit Options */}
        <p className="text-sm text-gray-600 mb-3 font-semibold">
          Choose an amount to add:
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {creditOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePurchase(amount)}
              disabled={isProcessing}
              className={`
                bg-[#F59F0A] text-white px-4 py-4 rounded-lg font-bold text-xl
                hover:bg-[#D97706] transition transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                ${selectedAmount === amount ? 'ring-4 ring-[#F59F0A] ring-opacity-50 scale-105' : ''}
              `}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center text-sm text-gray-600 mb-4 flex items-center justify-center">
            <div className="animate-spin inline-block w-5 h-5 border-2 border-[#F59F0A] border-t-transparent rounded-full mr-2"></div>
            <span>Redirecting to secure checkout...</span>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}