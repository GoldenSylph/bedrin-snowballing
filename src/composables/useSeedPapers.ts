import type { Paper } from '@/types/paper';
import seedPapersData from '@/assets/seed-papers.json';

export const useSeedPapers = (): Paper[] => {
  return seedPapersData as Paper[];
};
