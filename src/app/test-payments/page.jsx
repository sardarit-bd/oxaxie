
'use client';

import { useState } from 'react';
import { PaymentInitializer } from '../../components/payments/PaymentInitializer';
import { PaymentHistory } from '../../components/payments/PaymentHistory';
import { PaymentDetails } from '../../components/payments/PaymentDetails';
import { usePaymentGateways, usePayments } from '../../hooks/usePayments';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function TestPaymentsPage() {
  const [testCaseId, setTestCaseId] = useState('1'); // Change this to your actual case ID
  const [testPaymentId, setTestPaymentId] = useState('');

  const { data: gateways, isLoading: gatewaysLoading, error: gatewaysError } = usePaymentGateways();
  const { data: payments, isLoading: paymentsLoading, error: paymentsError } = usePayments(testCaseId);

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Payment Gateway Testing</h1>

      <Tabs defaultValue="gateways" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="initialize">Initialize Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="details">Payment Details</TabsTrigger>
        </TabsList>

        {/* Test Available Gateways */}
        <TabsContent value="gateways">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Available Payment Gateways</h2>
            
            {gatewaysLoading && <p>Loading gateways...</p>}
            {gatewaysError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600">Error: {gatewaysError.message}</p>
              </div>
            )}
            
            {gateways && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found {gateways.length} gateway(s)
                </p>
                <div className="grid gap-4">
                  {gateways.map((gateway) => (
                    <div
                      key={gateway.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{gateway.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {gateway.type}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          gateway.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {gateway.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Test Initialize Payment */}
        <TabsContent value="initialize">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Initialize Payment</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="caseId">Case ID (for testing)</Label>
                <Input
                  id="caseId"
                  value={testCaseId}
                  onChange={(e) => setTestCaseId(e.target.value)}
                  placeholder="Enter case ID"
                />
              </div>
            </div>

            <PaymentInitializer caseId={testCaseId} defaultAmount={1000} />
          </Card>
        </TabsContent>

        {/* Test Payment History */}
        <TabsContent value="history">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            
            <div className="mb-6">
              <Label htmlFor="historyCaseId">Case ID</Label>
              <Input
                id="historyCaseId"
                value={testCaseId}
                onChange={(e) => setTestCaseId(e.target.value)}
                placeholder="Enter case ID"
              />
            </div>

            {paymentsLoading && <p>Loading payments...</p>}
            {paymentsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600">Error: {paymentsError.message}</p>
              </div>
            )}

            <PaymentHistory caseId={testCaseId} />
          </Card>
        </TabsContent>

        {/* Test Payment Details */}
        <TabsContent value="details">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="paymentId">Payment ID</Label>
                <Input
                  id="paymentId"
                  value={testPaymentId}
                  onChange={(e) => setTestPaymentId(e.target.value)}
                  placeholder="Enter payment ID"
                />
              </div>
              <Button
                onClick={() => {
                  if (!testPaymentId) {
                    alert('Please enter a payment ID');
                  }
                }}
                disabled={!testPaymentId}
              >
                Load Payment Details
              </Button>
            </div>

            {testPaymentId && <PaymentDetails paymentId={testPaymentId} />}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Debug Info */}
      <Card className="p-6 mt-6 bg-gray-50">
        <h3 className="font-semibold mb-2">Debug Information</h3>
        <div className="text-sm space-y-1 text-muted-foreground">
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
          <p>Current Case ID: {testCaseId}</p>
          <p>Auth Token: {typeof window !== 'undefined' && localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
        </div>
      </Card>
    </div>
  );
}