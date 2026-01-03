import api from './api';

export const paymentService = {
  // Get available payment gateways
  getAvailableGateways: async () => {
    const response = await api.get('/payments/gateways');
    return response.data;
  },

  // Initialize payment (returns client_secret for Stripe)
  initializePayment: async (paymentData) => {
    const response = await api.post('/payments/initialize', paymentData);
    return response.data;
  },

  // Verify payment after successful payment
  verifyPayment: async (paymentId, verificationData) => {
    const response = await api.post(`/payments/${paymentId}/verify`, verificationData);
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Get all user payments
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Mark payment as received (for manual payments)
  markAsReceived: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/mark-received`);
    return response.data;
  },

  // Refund payment
  refundPayment: async (paymentId, amount = null) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { amount });
    return response.data;
  },
};