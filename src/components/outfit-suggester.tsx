'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOutfitSuggestions, type ActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialState: ActionState = {
  form: { stylePreferences: '' },
  status: 'idle',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Get Suggestions
    </Button>
  );
}

type OutfitSuggesterProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function OutfitSuggester({ isOpen, onOpenChange }: OutfitSuggesterProps) {
  const [state, formAction] = useActionState(getOutfitSuggestions, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong.',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>AI Outfit Stylist</SheetTitle>
          <SheetDescription>
            Tell us your style, and we'll suggest outfits you'll love.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
            <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="stylePreferences">What's your style?</Label>
                <Textarea
                id="stylePreferences"
                name="stylePreferences"
                placeholder="e.g., I love a minimalist, urban look. I prefer dark colors and comfortable but stylish clothes. My go-to brands are..."
                rows={5}
                required
                />
                 {state.status === 'error' && state.message && <p className="text-sm text-destructive">{state.message}</p>}
            </div>
            <SheetFooter>
                <SubmitButton />
            </SheetFooter>
            </form>

            {state.status === 'success' && state.suggestions && (
            <Card className="mt-6 bg-secondary">
                <CardHeader>
                <CardTitle>Your Style Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="whitespace-pre-wrap text-sm text-secondary-foreground">{state.suggestions}</p>
                </CardContent>
            </Card>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
