// components/payments/PaymentHistory.jsx
'use client';

import { usePayments } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function PaymentHistory({ caseId }) {
  const { data, isLoading } = usePayments(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment History</h3>
      {data?.data.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No payments yet
        </p>
      ) : (
        <div className="space-y-3">
          {data?.data.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">
                    {payment.amount} {payment.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.gateway.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(payment.created_at), 'PPp')}
                  </p>
                </div>
                <Badge className={statusColors[payment.status]}>
                  {payment.status}
                </Badge>
              </div>
              {payment.transaction_id && (
                <p className="text-xs text-muted-foreground mt-2">
                  Transaction ID: {payment.transaction_id}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}