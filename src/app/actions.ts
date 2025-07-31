'use server';

import { suggestOutfits, type SuggestOutfitsInput } from '@/ai/flows/suggest-outfits';
import { z } from 'zod';

const ActionInputSchema = z.object({
  stylePreferences: z.string().min(10, 'Please describe your style in a bit more detail.'),
});

export type ActionState = {
  form: {
    stylePreferences: string;
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  suggestions?: string;
};

export async function getOutfitSuggestions(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const validation = ActionInputSchema.safeParse({
    stylePreferences: formData.get('stylePreferences'),
  });

  if (!validation.success) {
    return {
      ...prevState,
      status: 'error',
      message: validation.error.errors.map((e) => e.message).join(', '),
    };
  }
  
  const input: SuggestOutfitsInput = {
    // Mock purchase history for now
    purchaseHistory: JSON.stringify([
      { item: 'Black Skinny Jeans', category: 'Pants' },
      { item: 'White Classic Tee', category: 'T-shirt' },
    ]),
    stylePreferences: validation.data.stylePreferences,
  };

  try {
    const result = await suggestOutfits(input);
    return {
      ...prevState,
      status: 'success',
      message: 'Here are your outfit suggestions!',
      suggestions: result.outfitSuggestions,
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      status: 'error',
      message: 'We had trouble getting suggestions. Please try again.',
    };
  }
}
