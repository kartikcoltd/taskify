'use client';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Undo2 } from 'lucide-react';
import { format } from 'date-fns';

export default function StatementPage() {
  const { transactions } = useAppContext();

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EARNED:
        return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      case TransactionType.SPENT:
        return <ArrowDownLeft className="h-5 w-5 text-red-500" />;
      case TransactionType.REFUND:
        return <Undo2 className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline tracking-tight mb-8">Transaction History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Statement</CardTitle>
          <CardDescription>A record of all your points transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-shrink-0">{getIcon(tx.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(tx.date), 'PPpp')}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'text-lg font-bold',
                        tx.type === TransactionType.EARNED && 'text-green-500',
                        tx.type === TransactionType.SPENT && 'text-red-500',
                        tx.type === TransactionType.REFUND && 'text-blue-500'
                      )}
                    >
                      {tx.type === TransactionType.SPENT ? '-' : '+'}
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No transactions yet.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
