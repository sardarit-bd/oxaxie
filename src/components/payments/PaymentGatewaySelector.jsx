// components/payments/PaymentGatewaySelector.jsx
'use client';

import { usePaymentGateways } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function PaymentGatewaySelector({ selectedGateway, onSelect }) {
  const { data: gateways, isLoading } = usePaymentGateways();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const gatewayIcons = {
    stripe: '💳',
    paypal: '🅿️',
    bkash: '📱',
    nagad: '💰',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gateways?.filter(g => g.enabled).map((gateway) => (
          <Card
            key={gateway.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedGateway === gateway.type
                ? 'ring-2 ring-primary border-primary'
                : ''
            }`}
            onClick={() => onSelect(gateway.type)}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">{gatewayIcons[gateway.type] || '💳'}</div>
              <p className="font-medium">{gateway.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}