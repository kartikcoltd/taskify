'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

type DailyEnergyBarProps = {
  pointsEarnedToday: number;
  dailyGoal: number;
};

export function DailyEnergyBar({ pointsEarnedToday, dailyGoal }: DailyEnergyBarProps) {
  const progress = Math.min((pointsEarnedToday / dailyGoal) * 100, 100);
  const goalReached = pointsEarnedToday >= dailyGoal;

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6" />
          Daily Goal Progress
        </CardTitle>
        <CardDescription>
          Earn {dailyGoal} points today for a "Successful" day.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-2xl font-bold">{pointsEarnedToday}</span>
          <span className="text-muted-foreground"> / {dailyGoal} points</span>
        </div>
        <Progress value={progress} className={cn(goalReached && 'glow')} />
        <div className="text-center font-medium text-lg pt-2">
          {goalReached ? (
            <p className="text-green-400">SUCCESSFUL DAY!</p>
          ) : (
            <p className="text-red-400">UNSUCCESSFUL DAY</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
