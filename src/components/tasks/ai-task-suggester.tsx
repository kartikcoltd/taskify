'use client';

import { useState } from 'react';
import { suggestTasks, SuggestTasksOutput } from '@/ai/flows/suggest-tasks-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type AITaskSuggesterProps = {
  onAddTask: (text: string, points: number) => void;
};

export function AITaskSuggester({ onAddTask }: AITaskSuggesterProps) {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestTasksOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestTasks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestTasks({ prompt });
      setSuggestions(result);
    } catch (error) {
      console.error('Error suggesting tasks:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not generate tasks. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = (task: string, points: number) => {
    onAddTask(task, points);
    setSuggestions(prev => prev.filter(s => s.task !== task));
     toast({
        title: 'Task Added!',
        description: `"${task}" has been added to your list.`,
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline tracking-tight text-2xl flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Task Suggester
        </CardTitle>
        <CardDescription>Describe your goals for the day and let AI create tasks for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSuggestTasks} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-prompt">Today's Goals</Label>
            <Textarea
              id="goal-prompt"
              placeholder="e.g., Focus on work, exercise, and read more..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Suggest Tasks'}
          </Button>
        </form>
      </CardContent>
      {(isLoading || suggestions.length > 0) && (
        <CardFooter className="flex flex-col gap-2 items-start">
            <h3 className="text-sm font-medium text-muted-foreground">Suggestions</h3>
             {isLoading && (
                <div className="space-y-2 w-full">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            )}
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center w-full p-2 rounded-md border bg-accent/50">
              <div className="flex-1">
                <p className="text-sm font-medium">{suggestion.task}</p>
                <p className="text-xs text-primary font-semibold">{suggestion.points} points</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleAddSuggestion(suggestion.task, suggestion.points)}>
                <Plus className="w-4 h-4" />
                <span className="sr-only">Add Task</span>
              </Button>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
