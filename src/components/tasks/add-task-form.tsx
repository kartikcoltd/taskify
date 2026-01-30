'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

type AddTaskFormProps = {
  onAddTask: (text: string, points: number) => void;
};

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [text, setText] = useState('');
  const [points, setPoints] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && typeof points === 'number' && points > 0) {
      onAddTask(text, points);
      setText('');
      setPoints('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline tracking-tight text-2xl">Add New Task</CardTitle>
        <CardDescription>What do you want to accomplish?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-text">Task</Label>
            <Input
              id="task-text"
              placeholder="e.g., Finish Q3 report"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-points">Points</Label>
            <Input
              id="task-points"
              type="number"
              placeholder="e.g., 50"
              value={points}
              onChange={(e) => setPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              required
              min="1"
            />
          </div>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
