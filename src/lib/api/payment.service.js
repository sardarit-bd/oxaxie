// lib/api/payment.service.js
import { apiClient } from './client';

export const paymentService = {
  // Get available payment gateways
  getAvailableGateways: async () => {
    const response = await apiClient.get('/payments/gateways');
    return response.data;
  },

  // Get all payments (with optional filters)
  getPayments: async (params = {}) => {
    const response = await apiClient.get('/payments', { params });
    return response.data;
  },

  // Initialize a new payment
  initializePayment: async (data) => {
    const response = await apiClient.post('/payments/initialize', data);
    return response.data;
  },

  // Verify a payment
  verifyPayment: async (paymentId) => {
    const response = await apiClient.post(`/payments/${paymentId}/verify`);
    return response.data;
  },

  // Mark payment as received (manual confirmation)
  markAsReceived: async (paymentId) => {
    const response = await apiClient.post(`/payments/${paymentId}/mark-received`);
    return response.data;
  },

  // Get single payment details
  getPayment: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Refund a payment
  refundPayment: async (paymentId, data = {}) => {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, data);
    return response.data;
  },
};