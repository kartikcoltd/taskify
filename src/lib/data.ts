import type { Task, LockedApp } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { v4 as uuidv4 } from 'uuid';

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const oneDayAgo = new Date();
oneDayAgo.setDate(oneDayAgo.getDate() - 1);


export const initialTasks: Task[] = [
  { id: uuidv4(), text: 'Complete project proposal', points: 50, completed: false, createdAt: twoDaysAgo.getTime() },
  { id: uuidv4(), text: 'Go for a 30-minute run', points: 30, completed: true, completedAt: oneDayAgo.getTime(), createdAt: twoDaysAgo.getTime() },
  { id: uuidv4(), text: 'Read a chapter of a book', points: 20, completed: false, createdAt: oneDayAgo.getTime() },
  { id: uuidv4(), text: 'Meditate for 10 minutes', points: 15, completed: false, createdAt: new Date().getTime() },
];

const socialIcon1 = PlaceHolderImages.find(img => img.id === 'social-1');
const socialIcon2 = PlaceHolderImages.find(img => img.id === 'social-2');
const gamingIcon1 = PlaceHolderImages.find(img => img.id === 'gaming-1');
const videoIcon1 = PlaceHolderImages.find(img => img.id === 'video-1');

export const initialApps: LockedApp[] = [
  { id: uuidv4(), name: 'SocialApp 1', icon: socialIcon1?.imageUrl || '', unlockCost: 25, isLocked: true },
  { id: uuidv4(), name: 'SocialApp 2', icon: socialIcon2?.imageUrl || '', unlockCost: 25, isLocked: true },
  { id: uuidv4(), name: 'GameZone', icon: gamingIcon1?.imageUrl || '', unlockCost: 50, isLocked: true },
  { id: uuidv4(), name: 'VideoStream', icon: videoIcon1?.imageUrl || '', unlockCost: 40, isLocked: true },
];

export const entertainmentAppList: string[] = ['SocialApp 1', 'SocialApp 2', 'GameZone', 'VideoStream'];

export const mockUsageStats = JSON.stringify([
    { appName: 'SocialApp 1', duration: 120 },
    { appName: 'Work Email', duration: 90 },
    { appName: 'GameZone', duration: 85 },
    { appName: 'SocialApp 2', duration: 70 },
    { appName: 'Code Editor', duration: 240 },
    { appName: 'VideoStream', duration: 150 },
]);
