import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { paymentService } from '../services/paymentService';
import api from '../services/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const initializePayment = async (plan) => {
  try {
    setLoading(true);
    setError(null);

    const paymentRequestData = {
      amount: parseFloat(plan.price),
      currency: 'usd',
      gateway: 'stripe',
      description: `${plan.name} Plan Subscription`,
      metadata: {
        plan_name: plan.name,
        plan_type: plan.type,
        subscription_plan_id: plan.id,
      },
    };

    const response = await paymentService.initializePayment(paymentRequestData);


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


const verifyPayment = async (paymentId, paymentIntentId, plan, userId) => {
  try {
    const response = await paymentService.verifyPayment(paymentId, {
      payment_intent_id: paymentIntentId,
    });

    if (!response.success) {
      throw new Error(response.message || 'Payment verification failed');
    }

    const currentPeriodStart = new Date().toISOString();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    await api.post('/subscriptions/store-or-update', {
      plan_tier: plan.type,
      status: 'active',
      monthly_price: plan.price,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd.toISOString(),
      stripe_subscription_id: paymentIntentId,
      stripe_customer_id: response.data.customer_id || null,
    });

    return response.data;
  } catch (err) {
    console.error('Payment verification / subscription error:', err);
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