'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { LockedApp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Timer, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type LockedAppItemProps = {
  app: LockedApp;
  currentPoints: number;
  onUnlock: (appId: string, cost: number, duration: number) => void;
  onLock: (appId: string) => void;
  onCancel: (appId: string) => void;
};

const unlockOptions = [
  { duration: 15 },
  { duration: 30 },
  { duration: 60 },
  { duration: 120 },
];

export function LockedAppItem({ app, currentPoints, onUnlock, onLock, onCancel }: LockedAppItemProps) {
  const [remainingTime, setRemainingTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string>('30');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (!app.isLocked && app.unlockTime && app.lockDurationMinutes) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const unlockTime = new Date(app.unlockTime!).getTime();
        const endTime = unlockTime + app.lockDurationMinutes! * 60 * 1000;
        const distance = endTime - now;

        if (distance < 0) {
          onLock(app.id);
          setRemainingTime('');
          clearInterval(interval);
          return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [app, onLock]);
  
  const getCost = (duration: number) => {
      // 1 point per minute, but 0.5 points per minute for 60+ minutes
      return duration >= 60 ? Math.ceil(duration * 0.5) : duration;
  }

  const handleUnlock = () => {
    const duration = parseInt(selectedDuration);
    const cost = getCost(duration);
    onUnlock(app.id, cost, duration);
    setIsPopoverOpen(false);
  };
  
  const selectedOptionCost = getCost(parseInt(selectedDuration));

  return (
    <div className="flex items-center space-x-3 rounded-lg border p-3">
       <a href={`https://www.${app.name.replace(/\s/g, '')}.com`} target="_blank" rel="noopener noreferrer" className={cn(app.isLocked ? "cursor-not-allowed" : "cursor-pointer")}>
        <Image
          src={app.icon}
          alt={`${app.name} icon`}
          width={40}
          height={40}
          className={cn("rounded-md", app.isLocked ? "grayscale" : "")}
          data-ai-hint="app logo"
        />
      </a>
      <div className="flex-1">
        <p className="text-sm font-medium">{app.name}</p>
        {app.isLocked ? (
           <p className="text-xs text-muted-foreground">Locked</p>
        ) : (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
            <Timer className="w-3 h-3" />
            <span>{remainingTime}</span>
          </div>
        )}
      </div>
      {app.isLocked ? (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" disabled={currentPoints < getCost(15)}>
              <Lock className="mr-2 h-4 w-4" />
              Unlock
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Unlock Duration</h4>
                <p className="text-sm text-muted-foreground">
                  Select how long to unlock the app.
                </p>
              </div>
              <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
                {unlockOptions.map(option => (
                  <div key={option.duration} className="flex items-center justify-between">
                    <Label htmlFor={`unlock-${app.id}-${option.duration}`} className="flex-1 cursor-pointer py-2">
                      {option.duration} minutes
                    </Label>
                    <span className="text-sm font-medium">{getCost(option.duration)} pts</span>
                    <RadioGroupItem value={option.duration.toString()} id={`unlock-${app.id}-${option.duration}`} className="ml-4" />
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={handleUnlock} disabled={currentPoints < selectedOptionCost}>
                Unlock for {selectedOptionCost} points
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive_outline">
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You may be eligible for a partial refund based on unused time. Are you sure you want to end this session and lock the app?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, Continue</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onCancel(app.id)}>Yes, End Session</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button size="sm" variant="ghost" disabled>
                <Unlock className="mr-2 h-4 w-4" />
                Unlocked
            </Button>
        </div>
      )}
    </div>
  );
}
