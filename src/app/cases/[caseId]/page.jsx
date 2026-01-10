'use client';

import { PaymentInitializer } from '@/components/payments/PaymentInitializer';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CaseDetailPage({ params }) {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <p>Case details here...</p>
        </TabsContent>

        <TabsContent value="chat">
          <p>Chat interface here...</p>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentInitializer caseId={params.caseId} defaultAmount={1000} />
          <PaymentHistory caseId={params.caseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}