import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Filter } from 'bad-words'
import BadWords from '@/data/badWords.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkProfane = (text: string, setWarning: (state: boolean) => void) => {
  const filter = new Filter();
  // const originalBadWordsList = [...filter.list];
  // console.log(originalBadWordsList);
  filter.list = BadWords.words;

  const detected = filter.isProfane(text);

  if(detected) {
    setWarning(true);
  } else {
    setWarning(false);
  }
}