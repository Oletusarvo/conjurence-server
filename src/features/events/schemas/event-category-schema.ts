import z from 'zod';

export type TEventCategory = 'game' | 'fitness' | 'hangout' | 'other';
export const eventCategories: TEventCategory[] = ['game', 'fitness', 'hangout', 'other'];
export const eventCategorySchema = z.enum(eventCategories);
