// components/payments/PaymentDetails.jsx
'use client';

import { usePayment, useRefundPayment } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

export function PaymentDetails({ paymentId }) {
  const { data: payment, isLoading } = usePayment(paymentId);
  const { mutate: refundPayment, isPending: isRefunding } = useRefundPayment();
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!payment) {
    return <p>Payment not found</p>;
  }

  const handleRefund = () => {
    refundPayment(
      { paymentId: payment.id },
      {
        onSuccess: () => {
          setShowRefundConfirm(false);
        },
      }
    );
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">
              {payment.amount} {payment.currency}
            </h3>
            <p className="text-muted-foreground">
              {payment.gateway.toUpperCase()}
            </p>
          </div>
          <Badge className={statusColors[payment.status]}>
            {payment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment ID</p>
            <p className="font-medium">{payment.id}</p>
          </div>
          {payment.transaction_id && (
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-medium">{payment.transaction_id}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">
              {format(new Date(payment.created_at), 'PPp')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated At</p>
            <p className="font-medium">
              {format(new Date(payment.updated_at), 'PPp')}
            </p>
          </div>
        </div>

        {payment.status === 'completed' && !showRefundConfirm && (
          <Button
            variant="destructive"
            onClick={() => setShowRefundConfirm(true)}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Request Refund
          </Button>
        )}

        {showRefundConfirm && (
          <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium">
              Are you sure you want to refund this payment?
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleRefund}
                disabled={isRefunding}
                className="flex-1"
              >
                {isRefunding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Refund'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRefundConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}