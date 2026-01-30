'use client';

import { AddTaskForm } from '@/components/tasks/add-task-form';
import { AITaskSuggester } from '@/components/tasks/ai-task-suggester';
import { TaskList } from '@/components/tasks/task-list';
import { useAppContext } from '@/context/AppContext';

export default function Home() {
  const { tasks, toggleTask, addTask, editTask, deleteTask } = useAppContext();
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <div className="flex-1 w-full max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-headline tracking-tight">Today's Focus</h2>
            <TaskList tasks={tasks} onToggleTask={toggleTask} onEditTask={editTask} onDeleteTask={deleteTask} />
          </div>
          <AITaskSuggester onAddTask={addTask} />
          <AddTaskForm onAddTask={addTask} />
        </div>
      </div>
    </div>
  );
}
