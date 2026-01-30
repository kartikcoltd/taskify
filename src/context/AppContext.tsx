'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import type { Task, LockedApp, Transaction } from '@/lib/types';
import { TransactionType } from '@/lib/types';
import { initialTasks, initialApps } from '@/lib/data';

interface AppContextType {
  tasks: Task[];
  apps: LockedApp[];
  points: number;
  pointsEarned: number;
  pointsSpent: number;
  transactions: Transaction[];
  toggleTask: (taskId: string) => void;
  addTask: (text: string, points: number) => void;
  editTask: (taskId: string, newText: string, newPoints: number) => void;
  deleteTask: (taskId: string) => void;
  addApp: (name: string, unlockCost: number) => void;
  unlockApp: (appId: string, cost: number, duration: number) => void;
  lockApp: (appId: string) => void;
  cancelUnlock: (appId: string) => void;
  applyAISuggestion: (appsToLock: string[], lockDurationMinutes: number) => void;
  addPoints: (amount: number, description: string) => void;
  spendPoints: (amount: number, description: string, skipToast?: boolean) => void;
  pointsEarnedToday: number;
  tasksAddedToday: number;
  hasClaimedDailyBonus: boolean;
  claimDailyBonus: () => void;
  isFocusing: boolean;
  focusSeconds: number;
  toggleFocus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [apps, setApps] = useState<LockedApp[]>(initialApps);
  const [points, setPoints] = useState<number>(100);
  const [pointsEarned, setPointsEarned] = useState<number>(() => {
    return initialTasks.filter(t => t.completed).reduce((sum, task) => sum + task.points, 0);
  });
  const [pointsSpent, setPointsSpent] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyBonusClaimedDate, setDailyBonusClaimedDate] = useState<string | null>(null);

  const [isFocusing, setIsFocusing] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(0);

  const todayString = new Date().toDateString();

  const pointsEarnedToday = transactions
    .filter(tx => {
      const txDate = new Date(tx.date).toDateString();
      return tx.type === TransactionType.EARNED && txDate === todayString;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const tasksAddedToday = tasks.filter(t => t.createdAt && new Date(t.createdAt).toDateString() === todayString).length;

  const hasClaimedDailyBonus = dailyBonusClaimedDate === todayString;

  const addTransaction = useCallback((type: TransactionType, description: string, amount: number) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      type,
      description,
      amount,
      date: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const addPoints = useCallback((amount: number, description: string) => {
    setPoints(p => p + amount);
    setPointsEarned(p => p + amount);
    addTransaction(TransactionType.EARNED, description, amount);
  }, [addTransaction]);

  const spendPoints = useCallback((amount: number, description: string, skipToast = false) => {
     if (points >= amount) {
      setPoints(p => p - amount);
      setPointsSpent(p => p + amount);
      addTransaction(TransactionType.SPENT, description, amount);
       if (!skipToast) {
         toast({
           title: 'Points Spent!',
           description: `You spent ${amount} points on ${description}.`,
         });
       }
       return true;
     } else {
        if (!skipToast) {
         toast({
            variant: 'destructive',
            title: 'Not enough points!',
            description: 'Complete more tasks to earn points.',
         });
        }
       return false;
     }
  }, [points, addTransaction, toast]);
  
  const refundPoints = useCallback((amount: number, description: string) => {
      setPoints(p => p + amount);
      setPointsSpent(p => p - amount);
      addTransaction(TransactionType.REFUND, description, amount);
      toast({
        title: 'Points Refunded!',
        description: `You got ${amount} points back from ${description}.`,
      });
  }, [addTransaction, toast]);


  const toggleTask = useCallback((taskId: string) => {
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) {
        return;
    }

    const isNowCompleted = !taskToToggle.completed;

    const updatedTasks = tasks.map(task =>
        task.id === taskId
            ? { ...task, completed: isNowCompleted, completedAt: isNowCompleted ? Date.now() : undefined }
            : task
    );

    if (isNowCompleted) {
        addPoints(taskToToggle.points, `Completed task: "${taskToToggle.text}"`);
        toast({
            title: 'Task Completed!',
            description: `You earned ${taskToToggle.points} points.`,
        });

        const today = new Date().setHours(0, 0, 0, 0);
        const completedTodayCount = updatedTasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt).setHours(0,0,0,0) === today).length;

        if (completedTodayCount === 10) {
            const bonus = 5;
            addPoints(bonus, 'Bonus for completing 10 tasks today');
            toast({
                title: 'Daily Bonus!',
                description: `You completed 10 tasks today! You get ${bonus} bonus points!`,
            });
        }
    } else {
        setPoints(p => p - taskToToggle.points);
        setPointsEarned(p => p - taskToToggle.points);
        addTransaction(TransactionType.REFUND, `Un-completed task: "${taskToToggle.text}"`, taskToToggle.points);
        toast({
            variant: 'destructive',
            title: 'Task Incomplete',
            description: `You returned ${taskToToggle.points} points.`,
        });
    }

    setTasks(updatedTasks);
  }, [tasks, addPoints, addTransaction, toast]);

  const addTask = useCallback((text: string, taskPoints: number) => {
    if (!text || !taskPoints) return;
    
    setTasks(prevTasks => {
      const now = Date.now();
      // Prevent adding a task if a visually identical one was just added.
      // This is a workaround for a potential double-submission issue.
      const isDuplicate = prevTasks.some(
        task => task.text === text && task.points === taskPoints && (now - (task.createdAt ?? 0)) < 1000 // 1 second threshold
      );

      if (isDuplicate) {
        return prevTasks;
      }
      
      const newTask: Task = {
        id: uuidv4(),
        text,
        points: taskPoints,
        completed: false,
        createdAt: now,
      };

      return [newTask, ...prevTasks];
    });
  }, []);
  
  const editTask = useCallback((taskId: string, newText: string, newPoints: number) => {
    setTasks(prevTasks => {
        const taskToEdit = prevTasks.find(t => t.id === taskId);
        if (!taskToEdit) return prevTasks;

        if (taskToEdit.completed) {
            const pointDifference = newPoints - taskToEdit.points;
            if (pointDifference !== 0) {
                setPoints(p => p + pointDifference);
                setPointsEarned(p => p + pointDifference);
                addTransaction(
                    pointDifference > 0 ? TransactionType.EARNED : TransactionType.REFUND,
                    `Point adjustment for edited task: "${newText}"`,
                    Math.abs(pointDifference)
                );
            }
        }

        return prevTasks.map(t => (t.id === taskId ? { ...t, text: newText, points: newPoints } : t));
    });

    toast({
        title: "Task Updated",
        description: "Your task has been successfully updated."
    });
  }, [addTransaction, toast]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
        const taskToDelete = prevTasks.find(t => t.id === taskId);
        if (!taskToDelete) return prevTasks;

        if (taskToDelete.completed) {
            setPoints(p => p - taskToDelete.points);
            setPointsEarned(p => p - taskToDelete.points);
            addTransaction(TransactionType.REFUND, `Deleted completed task: "${taskToDelete.text}"`, taskToDelete.points);
        }

        return prevTasks.filter(t => t.id !== taskId);
    });

    toast({
        title: "Task Deleted",
        description: "Your task has been removed.",
        variant: "destructive"
    });
  }, [addTransaction, toast]);
  
  const addApp = useCallback((name: string, unlockCost: number) => {
    if (!name || !unlockCost) return;
    const newApp: LockedApp = {
      id: uuidv4(),
      name,
      icon: `https://picsum.photos/seed/${Math.random()}/40/40`,
      unlockCost,
      isLocked: true,
    };
    setApps(prevApps => [newApp, ...prevApps]);
  }, []);

  const unlockApp = useCallback((appId: string, cost: number, duration: number) => {
    const appToUnlock = apps.find(a => a.id === appId);
    if(appToUnlock && spendPoints(cost, `Unlock ${appToUnlock.name} for ${duration} min`, true)) {
        setApps(prevApps =>
            prevApps.map(app =>
            app.id === appId
                ? { ...app, isLocked: false, unlockTime: Date.now(), lockDurationMinutes: duration, costPaid: cost }
                : app
            )
        );
        toast({
            title: 'App Unlocked!',
            description: `You have spent ${cost} points to unlock ${appToUnlock.name}.`,
        });
    } else if (appToUnlock) {
        toast({
            variant: 'destructive',
            title: 'Not enough points!',
            description: `You need ${cost} points to unlock ${appToUnlock.name}.`,
        });
    }
  }, [apps, spendPoints, toast]);

  const lockApp = useCallback((appId: string) => {
    setApps(prevApps =>
      prevApps.map(app =>
        app.id === appId
          ? { ...app, isLocked: true, unlockTime: undefined, lockDurationMinutes: undefined, costPaid: undefined }
          : app
      )
    );
  }, []);
  
  const cancelUnlock = useCallback((appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (!app || app.isLocked || !app.unlockTime || !app.lockDurationMinutes || !app.costPaid) return;

    const now = Date.now();
    const startTime = app.unlockTime;
    const totalDurationMs = app.lockDurationMinutes * 60 * 1000;
    const elapsedMs = now - startTime;

    let refundAmount = 0;

    if (elapsedMs <= 2 * 60 * 1000) {
      refundAmount = app.costPaid;
    } else if (elapsedMs < totalDurationMs) {
      const remainingMs = totalDurationMs - elapsedMs;
      refundAmount = Math.floor((remainingMs / totalDurationMs) * app.costPaid);
    }
    
    if (refundAmount > 0) {
      refundPoints(refundAmount, `Refund for ${app.name}`);
    }
    
    lockApp(appId);
  }, [apps, refundPoints, lockApp]);

  const applyAISuggestion = useCallback((appsToLock: string[], lockDurationMinutes: number) => {
    setApps(prevApps => prevApps.map(app => {
      if (appsToLock.includes(app.name)) {
        return {
          ...app,
          isLocked: true,
          unlockTime: undefined,
          lockDurationMinutes: lockDurationMinutes
        };
      }
      return app;
    }));
     toast({
        title: 'AI Suggestions Applied!',
        description: `Selected apps have been locked for ${lockDurationMinutes} minutes.`,
      });
  }, [toast]);

  const claimDailyBonus = useCallback(() => {
    if (tasksAddedToday >= 5 && !hasClaimedDailyBonus) {
      addPoints(10, "Daily bonus for adding 5+ tasks");
      setDailyBonusClaimedDate(todayString);
      toast({
        title: "Daily Bonus Claimed!",
        description: "You earned 10 bonus points!",
      });
    } else if (hasClaimedDailyBonus) {
      toast({
        variant: "destructive",
        title: "Bonus Already Claimed",
        description: "You can only claim the daily bonus once per day.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Bonus Not Available",
        description: `You need to add ${5 - tasksAddedToday} more task(s) today to claim the bonus.`,
      });
    }
  }, [tasksAddedToday, hasClaimedDailyBonus, addPoints, todayString, toast]);
  
  const toggleFocus = useCallback(() => {
    setIsFocusing(f => {
        if (!f === false) {
            setFocusSeconds(0);
        }
        return !f
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isFocusing) {
      timer = setInterval(() => {
        setFocusSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isFocusing]);

  useEffect(() => {
    if (isFocusing && focusSeconds > 0 && focusSeconds % 900 === 0) { // 15 minutes
      addPoints(1, "15 minutes of Deep Focus");
      toast({
        title: "Focus Bonus!",
        description: `You earned 1 point for focusing!`
      })
    }
  }, [focusSeconds, isFocusing, addPoints, toast]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isFocusing) {
        spendPoints(1, "Focus broken by leaving app", true);
         toast({
            variant: 'destructive',
            title: "Focus Broken!",
            description: "You lost 1 point for leaving the app."
        })
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFocusing, spendPoints, toast]);

  const value = {
    tasks,
    apps,
    points,
    pointsEarned,
    pointsSpent,
    transactions,
    toggleTask,
    addTask,
    editTask,
    deleteTask,
    addApp,
    unlockApp,
    lockApp,
    cancelUnlock,
    applyAISuggestion,
    addPoints,
    spendPoints,
    pointsEarnedToday,
    tasksAddedToday,
    hasClaimedDailyBonus,
    claimDailyBonus,
    isFocusing,
    focusSeconds,
    toggleFocus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
