import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { paymentService } from '../services/paymentService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const initializePayment = async (plan) => {
  try {
    console.log('\n========================================');
    console.log('useStripePayment.initializePayment START');
    console.log('========================================');
    console.log('Plan received:', plan);
    
    setLoading(true);
    setError(null);

    const paymentRequestData = {
      amount: parseFloat(plan.price), // Ensure it's a number
      currency: 'usd',
      gateway: 'stripe',
      description: `${plan.name} Plan Subscription`,
      metadata: {
        plan_name: plan.name,
        plan_type: plan.type,
        subscription_plan_id: plan.id,
      },
    };

    console.log('Payment Request Data:');
    console.log(JSON.stringify(paymentRequestData, null, 2));
    console.log('Type checks:');
    console.log('  - amount:', typeof paymentRequestData.amount, '=', paymentRequestData.amount);
    console.log('  - currency:', typeof paymentRequestData.currency, '=', paymentRequestData.currency);
    console.log('  - gateway:', typeof paymentRequestData.gateway, '=', paymentRequestData.gateway);

    console.log('Calling paymentService.initializePayment...');
    const response = await paymentService.initializePayment(paymentRequestData);

    console.log('Response received:', response);
    console.log('========================================\n');

    if (!response.success) {
      throw new Error(response.message || 'Failed to initialize payment');
    }

    const payment = {
      paymentId: response.data.payment_id,
      clientSecret: response.data.client_secret,
      amount: response.data.amount,
      currency: response.data.currency,
    };

    setPaymentData(payment);
    return payment;
  } catch (err) {
    console.error('\n========================================');
    console.error('useStripePayment ERROR');
    console.error('========================================');
    console.error('Error:', err);
    console.error('Error response:', err.response?.data);
    console.error('Error status:', err.response?.status);
    console.error('Error headers:', err.response?.headers);
    console.error('========================================\n');
    
    const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
};
  const confirmPayment = async (clientSecret, paymentMethod) => {
    try {
      setLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod,
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      return paymentIntent;
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError(err.message || 'Payment confirmation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId, paymentIntentId) => {
    try {
      const response = await paymentService.verifyPayment(paymentId, {
        payment_intent_id: paymentIntentId,
      });

      if (!response.success) {
        throw new Error(response.message || 'Payment verification failed');
      }

      return response.data;
    } catch (err) {
      console.error('Payment verification error:', err);
      throw err;
    }
  };

  return {
    initializePayment,
    confirmPayment,
    verifyPayment,
    loading,
    error,
    paymentData,
    stripePromise,
  };
};