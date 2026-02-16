// Utility function for conditional class names (clsx replacement)

import { type ClassValue } from 'clsx';

// Simple clsx implementation
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
}