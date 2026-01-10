// components/payments/PaymentInitializer.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInitializePayment } from '@/hooks/usePayments';
import { PaymentGatewaySelector } from './PaymentGatewaySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function PaymentInitializer({ caseId, defaultAmount = 0 }) {
  const router = useRouter();
  const [selectedGateway, setSelectedGateway] = useState('');
  const [amount, setAmount] = useState(defaultAmount);
  const { mutate: initializePayment, isPending } = useInitializePayment();

  const handlePayment = async () => {
    if (!selectedGateway || amount <= 0) {
      return;
    }

    initializePayment(
      {
        case_id: caseId,
        amount,
        gateway: selectedGateway,
        currency: 'BDT',
        return_url: `${window.location.origin}/cases/${caseId}/payment/callback`,
      },
      {
        onSuccess: (response) => {
          if (response.checkout_url) {
            // Redirect to payment gateway
            window.location.href = response.checkout_url;
          } else if (response.client_secret) {
            // Handle Stripe payment (requires Stripe Elements)
            router.push(
              `/cases/${caseId}/payment/stripe?payment_id=${response.payment_id}&client_secret=${response.client_secret}`
            );
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount (BDT)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Enter amount"
          min="0"
          step="0.01"
        />
      </div>

      <PaymentGatewaySelector
        selectedGateway={selectedGateway}
        onSelect={setSelectedGateway}
      />

      <Button
        onClick={handlePayment}
        disabled={!selectedGateway || amount <= 0 || isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${amount.toFixed(2)} BDT`
        )}
      </Button>
    </div>
  );
}