import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn: (...inputs: ClassValue[]) => string = (...inputs) =>
  twMerge(clsx(inputs))
