import Dexie, { type EntityTable } from 'dexie';
import type { Paper } from '@/types/paper';

// Define the database class
class PapersDatabase extends Dexie {
  papers!: EntityTable<Paper, 'id'>;

  constructor() {
    super('SnowballingDatabase');
    
    // Define database schema
    // Using ++ before id makes it auto-increment
    
    // Version 1: Initial schema with wosIndex
    this.version(1).stores({
      papers: '++id, round, direction, authors, year, title, journal, wosIndex, relevance, included, doi',
    });
    
    // Version 2: Rename wosIndex to typeOfSource and update values
    this.version(2).stores({
      papers: '++id, round, direction, authors, year, title, journal, typeOfSource, relevance, included, doi',
    }).upgrade(tx => {
      // Migrate existing data: rename wosIndex to typeOfSource
      return tx.table('papers').toCollection().modify((paper: any) => {
        if (paper.wosIndex) {
          paper.typeOfSource = paper.wosIndex === 'Not WoS' ? 'Not indexed' : paper.wosIndex;
          delete paper.wosIndex;
        }
      });
    });
  }
}

// Create and export database instance
export const db = new PapersDatabase();

// Database operations
export const papersDb = {
  // Get all papers
  async getAll(): Promise<Paper[]> {
    return await db.papers.toArray();
  },

  // Get paper by ID
  async getById(id: number): Promise<Paper | undefined> {
    return await db.papers.get(id);
  },

  // Check if paper exists by unique combination (title + authors + year)
  async exists(title: string, authors: string, year: number): Promise<boolean> {
    const existing = await db.papers
      .where('title')
      .equalsIgnoreCase(title)
      .and((p) => p.authors === authors && p.year === year)
      .first();
    return !!existing;
  },

  // Add new paper
  async add(paper: Omit<Paper, 'id'>): Promise<number> {
    // Check for duplicates before adding
    const isDuplicate = await this.exists(paper.title, paper.authors, paper.year);
    if (isDuplicate) {
      throw new Error(`Paper "${paper.title}" by ${paper.authors} (${paper.year}) already exists`);
    }
    return await db.papers.add(paper as Paper);
  },

  // Update existing paper
  async update(id: number, changes: Partial<Paper>): Promise<number> {
    return await db.papers.update(id, changes);
  },

  // Delete paper
  async delete(id: number): Promise<void> {
    await db.papers.delete(id);
  },

  // Bulk add papers (for initial seed) - with duplicate check
  async bulkAdd(papers: Paper[]): Promise<void> {
    const papersToAdd: Omit<Paper, 'id'>[] = [];
    
    for (const paper of papers) {
      const isDuplicate = await this.exists(paper.title, paper.authors, paper.year);
      if (!isDuplicate) {
        // Remove id to let Dexie auto-generate it
        const { id, ...paperWithoutId } = paper;
        papersToAdd.push(paperWithoutId);
      } else {
        console.log(`Skipping duplicate: "${paper.title}" by ${paper.authors} (${paper.year})`);
      }
    }

    if (papersToAdd.length > 0) {
      await db.papers.bulkAdd(papersToAdd as Paper[]);
      console.log(`Added ${papersToAdd.length} unique papers`);
    }
  },

  // Clear all papers
  async clear(): Promise<void> {
    await db.papers.clear();
  },

  // Check if database has any papers
  async isEmpty(): Promise<boolean> {
    const count = await db.papers.count();
    return count === 0;
  },

  // Get next available ID
  async getNextId(): Promise<number> {
    const lastPaper = await db.papers.orderBy('id').last();
    return lastPaper ? lastPaper.id + 1 : 1;
  },
};
