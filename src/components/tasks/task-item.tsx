import { useState } from 'react';
import type { Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type TaskItemProps = {
  task: Task;
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string, text: string, points: number) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TaskItem({ task, onToggleTask, onEditTask, onDeleteTask }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [editedPoints, setEditedPoints] = useState<number | ''>(task.points);

  const handleEditSubmit = () => {
    if (editedText.trim() && typeof editedPoints === 'number' && editedPoints > 0) {
      onEditTask(task.id, editedText, editedPoints);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center space-x-4 rounded-lg p-3 transition-colors',
          task.completed ? 'bg-muted/50' : 'bg-card hover:bg-muted/50 border'
        )}
      >
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleTask(task.id)}
          aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'text-sm font-medium leading-none',
              task.completed ? 'line-through text-muted-foreground' : 'cursor-pointer'
            )}
          >
            {task.text}
          </label>
        </div>
        <Badge variant={task.completed ? 'secondary' : 'default'} className="font-semibold">
          {task.points} pts
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-task-text">Task</Label>
              <Input
                id="edit-task-text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-points">Points</Label>
              <Input
                id="edit-task-points"
                type="number"
                value={editedPoints}
                onChange={(e) => setEditedPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteTask(task.id)} className={cn(buttonVariants({variant: "destructive"}))}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
