// hooks/usePayments.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../lib/api/payment.service';
import { toast } from 'sonner';

export const usePaymentGateways = () => {
  return useQuery({
    queryKey: ['payment-gateways'],
    queryFn: paymentService.getAvailableGateways,
  });
};

export const usePayments = (caseId) => {
  return useQuery({
    queryKey: ['payments', caseId],
    queryFn: () => paymentService.getPayments({ case_id: caseId }),
    enabled: !!caseId,
  });
};

export const usePayment = (paymentId) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentService.getPayment(paymentId),
    enabled: !!paymentId,
  });
};

export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => paymentService.initializePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment initialized successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId) => paymentService.verifyPayment(paymentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
      toast.success('Payment verified successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Payment verification failed');
    },
  });
};

export const useMarkPaymentReceived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId) => paymentService.markAsReceived(paymentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
      toast.success('Payment marked as received');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark payment');
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, data }) => paymentService.refundPayment(paymentId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
      toast.success('Payment refunded successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Refund failed');
    },
  });
};