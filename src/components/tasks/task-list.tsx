'use client';
import type { Task } from '@/lib/types';
import { TaskItem } from './task-item';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListTodo } from 'lucide-react';

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string, text: string, points: number) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TaskList({ tasks, onToggleTask, onEditTask, onDeleteTask }: TaskListProps) {
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-450px)]">
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                <ListTodo className="w-12 h-12 mb-4" />
                <p className="font-medium">No tasks yet!</p>
                <p className="text-sm">Use the form to add your first task.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">To-Do</h3>
                  <div className="space-y-2">
                    {incompleteTasks.length > 0 ? (
                      incompleteTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 text-center">No pending tasks!</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Done</h3>
                   <div className="space-y-2">
                    {completedTasks.length > 0 ? (
                      completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 text-center">No tasks completed yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
