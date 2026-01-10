// app/cases/[caseId]/payment/callback/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyPayment } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCallbackPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [verificationStatus, setVerificationStatus] = useState('loading');

  const { mutate: verifyPayment } = useVerifyPayment();

  useEffect(() => {
    if (paymentId) {
      verifyPayment(paymentId, {
        onSuccess: () => {
          setVerificationStatus('success');
        },
        onError: () => {
          setVerificationStatus('failed');
        },
      });
    }
  }, [paymentId, verifyPayment]);

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card className="p-8">
        <div className="text-center space-y-6">
          {verificationStatus === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Verifying Payment...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your payment has been confirmed
              </p>
              <Button onClick={() => router.push(`/cases/${params.caseId}`)}>
                Return to Case
              </Button>
            </>
          )}

          {verificationStatus === 'failed' && (
            <>
              <XCircle className="h-16 w-16 mx-auto text-red-500" />
              <h2 className="text-2xl font-bold">Payment Failed</h2>
              <p className="text-muted-foreground">
                There was an issue verifying your payment
              </p>
              <Button
                variant="outline"
                onClick={() => router.push(`/cases/${params.caseId}`)}
              >
                Return to Case
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}