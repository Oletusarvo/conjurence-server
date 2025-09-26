import z from 'zod';

export type TEventSize = 'small' | 'medium' | 'large';
export const eventSizes: TEventSize[] = ['small', 'medium', 'large'];
export const eventSizeSchema = z.enum(eventSizes);
