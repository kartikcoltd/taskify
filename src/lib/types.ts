export enum TransactionType {
  EARNED = 'earned',
  SPENT = 'spent',
  REFUND = 'refund',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: number;
}

export interface Task {
  id: string;
  text: string;
  points: number;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface LockedApp {
  id: string;
  name: string;
  icon: string;
  unlockCost: number;
  isLocked: boolean;
  unlockTime?: number;
  lockDurationMinutes?: number;
  costPaid?: number;
}
