import { ref, computed, type Ref } from 'vue';
import type { Paper } from '@/types/paper';
import { papersDb } from '@/db/papersDb';
import { useSeedPapers } from '@/composables/useSeedPapers';

export const usePapers = () => {
  const papers: Ref<Paper[]> = ref([]);
  const loading = ref(true);
  const initialized = ref(false);

  // Initialize database with seed papers only once
  const initializeDatabase = async () => {
    if (initialized.value) {
      return;
    }

    try {
      const isEmpty = await papersDb.isEmpty();
      
      if (isEmpty) {
        const seedPapers = useSeedPapers();
        await papersDb.bulkAdd(seedPapers);
        console.log('Database initialized with', seedPapers.length, 'seed papers');
      } else {
        console.log('Database already contains papers, skipping seed initialization');
      }
      
      initialized.value = true;
      await loadPapers();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Load all papers from database
  const loadPapers = async () => {
    try {
      papers.value = await papersDb.getAll();
      console.log('Loaded', papers.value.length, 'papers from database');
    } catch (error) {
      console.error('Error loading papers:', error);
      throw error;
    }
  };

  // Add new paper
  const addPaper = async (paper: Omit<Paper, 'id'>): Promise<number> => {
    try {
      const id = await papersDb.add(paper);
      await loadPapers();
      console.log('Paper added with ID:', id);
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error adding paper:', errorMessage);
      
      if (errorMessage.includes('already exists')) {
        throw new Error(`This paper already exists in the database: ${paper.title}`);
      }
      throw error;
    }
  };

  // Update existing paper
  const updatePaper = async (updatedPaper: Paper): Promise<void> => {
    try {
      await papersDb.update(updatedPaper.id, updatedPaper);
      await loadPapers();
      console.log('Paper', updatedPaper.id, 'updated');
    } catch (error) {
      console.error('Error updating paper:', error);
      throw error;
    }
  };

  // Delete paper
  const deletePaper = async (id: number): Promise<void> => {
    try {
      await papersDb.delete(id);
      await loadPapers();
      console.log('Paper', id, 'deleted');
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error;
    }
  };

  // Get paper by ID
  const getPaperById = async (id: number): Promise<Paper | undefined> => {
    try {
      return await papersDb.getById(id);
    } catch (error) {
      console.error('Error getting paper:', error);
      throw error;
    }
  };

  // Clear all papers (useful for development/testing)
  const clearAllPapers = async (): Promise<void> => {
    try {
      await papersDb.clear();
      papers.value = [];
      initialized.value = false;
      console.log('All papers cleared from database');
    } catch (error) {
      console.error('Error clearing papers:', error);
      throw error;
    }
  };

  // Bulk add papers (for CSV import)
  const bulkAddPapers = async (papersToAdd: Omit<Paper, 'id'>[]): Promise<void> => {
    try {
      await papersDb.bulkAdd(papersToAdd as Paper[]);
      await loadPapers();
      console.log('Bulk import completed');
    } catch (error) {
      console.error('Error bulk adding papers:', error);
      throw error;
    }
  };

  // Computed stats
  const stats = computed(() => ({
    total: papers.value.length,
    included: papers.value.filter((p) => p.included === 'Yes').length,
    excluded: papers.value.filter((p) => p.included === 'No').length,
    pending: papers.value.filter((p) => p.included === 'Pending').length,
    seeds: papers.value.filter((p) => p.round === 'Seed').length,
    backward: papers.value.filter((p) => p.direction === 'Backward').length,
    forward: papers.value.filter((p) => p.direction === 'Forward').length,
    highRel: papers.value.filter((p) => p.relevance === 'High').length,
  }));

  return {
    papers,
    loading,
    initialized,
    stats,
    initializeDatabase,
    loadPapers,
    addPaper,
    updatePaper,
    deletePaper,
    getPaperById,
    clearAllPapers,
    bulkAddPapers,
  };
};
