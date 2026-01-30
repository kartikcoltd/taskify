'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function ProfilePage() {
    const { 
        tasksAddedToday, 
        hasClaimedDailyBonus, 
        claimDailyBonus, 
        isFocusing, 
        focusSeconds,
        toggleFocus 
    } = useAppContext();
    
    const tasksNeededForBonus = 5 - tasksAddedToday > 0 ? 5 - tasksAddedToday : 0;

    const formatTime = () => {
        const getSeconds = `0${(focusSeconds % 60)}`.slice(-2)
        const minutes = `${Math.floor(focusSeconds / 60)}`
        const getMinutes = `0${Number(minutes) % 60}`.slice(-2)
        const getHours = `0${Math.floor(focusSeconds / 3600)}`.slice(-2)
    
        return `${getHours} : ${getMinutes} : ${getSeconds}`
    }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold font-headline tracking-tight">Profile</h1>
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift /> Daily Bonus</CardTitle>
            <CardDescription>Add 5 new tasks in a day to earn a 10 point bonus!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {hasClaimedDailyBonus ? (
                  <p className="text-center text-green-500 font-medium">You've already claimed your bonus for today!</p>
              ) : (
                <>
                  <p className="text-center text-muted-foreground">
                    {tasksNeededForBonus > 0 ? `You need to add ${tasksNeededForBonus} more task(s) to claim your bonus.` : `You're eligible for the bonus!`}
                  </p>
                  <Button onClick={claimDailyBonus} disabled={tasksAddedToday < 5 || hasClaimedDailyBonus} className="w-full">
                    {hasClaimedDailyBonus ? 'Bonus Claimed' : 'Claim 10 Point Bonus'}
                  </Button>
                </>
              )}
          </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Deep Focus Mode</CardTitle>
          <CardDescription>
            Earn points for staying focused. You'll get 1 point for every 15 minutes. But be careful, you'll lose a point if you leave the app!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-5xl font-bold font-mono text-primary">{formatTime()}</div>
           <Button onClick={toggleFocus}>
            {isFocusing ? 'Stop Focusing' : 'Start Deep Focus'}
          </Button>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Wallet</CardTitle>
              <CardDescription>View your points transaction history.</CardDescription>
          </CardHeader>
          <CardContent>
              <Link href="/profile/statement">
                  <Button className="w-full">View Statement</Button>
              </Link>
          </CardContent>
      </Card>
    </div>
  );
}
