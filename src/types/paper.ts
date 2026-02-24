export type Round = 'Seed' | 'Round 1' | 'Round 2' | 'Round 3';
export type Direction = 'No direction' | 'Backward' | 'Forward';
export type Relevance = 'High' | 'Medium' | 'Low' | 'Pending';
export type IncludedStatus = 'Yes' | 'No' | 'Pending';
export type WosIndex = 'SSCI' | 'SCI' | 'SSCI/SCI' | 'ESCI' | 'Not WoS' | 'Unknown';

export interface Paper {
  id: number;
  round: Round;
  direction: Direction;
  authors: string;
  year: number;
  title: string;
  journal: string;
  wosIndex: WosIndex;
  keywords: string;
  relevance: Relevance;
  included: IncludedStatus;
  notes: string;
  doi: string;
}

export interface Stats {
  total: number;
  included: number;
  excluded: number;
  pending: number;
  seeds: number;
  backward: number;
  forward: number;
  highRel: number;
}
