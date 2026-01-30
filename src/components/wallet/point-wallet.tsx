import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type PointWalletProps = {
  points: number;
};

export function PointWallet({ points }: PointWalletProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Points</div>
            <div className="text-2xl font-bold font-headline">{points}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
