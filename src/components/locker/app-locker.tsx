'use client';
import { useState } from 'react';
import type { LockedApp } from '@/lib/types';
import { LockedAppItem } from './locked-app-item';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AILockerSuggester } from './ai-locker-suggester';
import { Flame, Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AppLocker() {
  const { apps, points, unlockApp, lockApp, cancelUnlock, applyAISuggestion, addApp } = useAppContext();
  const [newAppName, setNewAppName] = useState('');
  const [newAppCost, setNewAppCost] = useState<number | ''>('');

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAppName.trim() && typeof newAppCost === 'number' && newAppCost > 0) {
      addApp(newAppName, newAppCost);
      setNewAppName('');
      setNewAppCost('');
    }
  };


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight text-2xl flex items-center gap-2">
           <Flame className="w-6 h-6 text-primary" /> App Locker
        </CardTitle>
        <CardDescription>Spend points to unlock entertainment apps for a limited time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AILockerSuggester
            points={points}
            onApplySuggestion={applyAISuggestion}
        />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline tracking-tight text-xl">Add a new app to lock</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddApp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">App Name</Label>
                <Input id="app-name" placeholder="e.g., DistractionApp" value={newAppName} onChange={(e) => setNewAppName(e.target.value)} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="app-cost">Unlock Cost (Legacy)</Label>
                <Input id="app-cost" type="number" placeholder="e.g., 50" value={newAppCost} onChange={(e) => setNewAppCost(e.target.value === '' ? '' : parseInt(e.target.value, 10))} required min="1" />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add App
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {apps.map(app => (
            <LockedAppItem
              key={app.id}
              app={app}
              onUnlock={unlockApp}
              onLock={lockApp}
              onCancel={cancelUnlock}
              currentPoints={points}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
