'use client';

import { useState } from 'react';
import { analyzeAppUsageAndSuggestLocking } from '@/ai/flows/analyze-app-usage-and-suggest-locking';
import { useToast } from '@/hooks/use-toast';
import { mockUsageStats, entertainmentAppList } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

type AILockerSuggesterProps = {
  points: number;
  onApplySuggestion: (appsToLock: string[], lockDurationMinutes: number) => void;
};

type Suggestion = {
    appsToLock: string[];
    lockDurationMinutes: number;
    reasoning: string;
}

export function AILockerSuggester({ points, onApplySuggestion }: AILockerSuggesterProps) {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeAppUsageAndSuggestLocking({
        usageStats: mockUsageStats,
        pointBalance: points,
        entertainmentAppList: JSON.stringify(entertainmentAppList),
      });
      setSuggestion(result);
    } catch (error) {
      console.error('Error with AI suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not get a suggestion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirm = () => {
      if (suggestion) {
          onApplySuggestion(suggestion.appsToLock, suggestion.lockDurationMinutes);
          setSuggestion(null);
      }
  }

  return (
    <>
      <Button onClick={handleGetSuggestion} disabled={isLoading} variant="outline" className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        {isLoading ? 'Analyzing...' : 'Get AI Lock Suggestions'}
      </Button>
      
      <AlertDialog open={!!suggestion} onOpenChange={(open) => !open && setSuggestion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> AI Lock Suggestion</AlertDialogTitle>
            <AlertDialogDescription>
              {suggestion?.reasoning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Card>
            <CardContent className="p-4 space-y-2">
                 <p className="font-medium">Lock for {suggestion?.lockDurationMinutes} minutes:</p>
                 <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {suggestion?.appsToLock.map(app => <li key={app}>{app}</li>)}
                 </ul>
            </CardContent>
          </Card>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Apply Suggestion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
