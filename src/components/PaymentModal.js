
'use client';

import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Loader2, CheckCircle, CreditCard } from 'lucide-react';
import { useStripePayment } from '../hooks/useStripePayment';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm({ plan, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [cardholderName, setCardholderName] = useState('');

  const {
    initializePayment,
    verifyPayment,
    error,
  } = useStripePayment();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    try {
      console.log('🚀 Initializing payment...');
      const paymentData = await initializePayment(plan);
      
      if (!paymentData?.clientSecret) {
        throw new Error('Failed to initialize payment');
      }

      console.log('Payment initialized:', paymentData);

      const cardElement = elements.getElement(CardElement);

      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: cardholderName },
      });

      if (methodError) throw new Error(methodError.message);

      console.log('Payment method created:', paymentMethod.id);

      //Confirm card payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        { payment_method: paymentMethod.id }
      );

      if (confirmError) throw new Error(confirmError.message);

      console.log(' Payment confirmed:', paymentIntent.status);

      // Verify payment on backend
      if (paymentIntent.status === 'succeeded') {
        await verifyPayment(paymentData.paymentId, paymentIntent.id, plan);

        console.log(' Payment verified and subscription updated');

        setSucceeded(true);
        setTimeout(() => onSuccess(paymentIntent), 2000);
      }

    } catch (err) {
      console.error('❌ Payment error:', err);
      setCardError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-serif mb-2">Payment Successful!</h3>
        <p className="text-gray-600 text-sm">
          Your subscription has been activated.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Plan</span>
          <span className="font-semibold">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount</span>
          <span className="font-semibold text-lg">${plan.price}/{plan.period}</span>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          id="cardholderName"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59F0A] focus:border-transparent outline-none"
          placeholder="John Doe"
          required
        />
      </div>

      {/* Card Element */}
      <div>
        <label htmlFor="cardInformation" className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div id='cardInformation' className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#F59F0A] focus-within:border-transparent">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* Error Message */}
      {(error || cardError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error || cardError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !cardholderName || processing}
          className="flex-1 bg-[#F59F0A] hover:bg-[#F5A820] text-black font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay ${plan.price}
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted. We use Stripe for secure payment processing.
      </p>
    </form>
  );
}

export default function PaymentModal({ isOpen, onClose, plan, onSuccess }) {
  const { stripePromise } = useStripePayment();

  if (!isOpen) return null;

  const handleSuccess = (paymentIntent) => {
    onSuccess(paymentIntent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {stripePromise && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                plan={plan}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}