<script setup lang="ts">
import { ref, computed, onMounted, toRaw } from 'vue';
import type { Paper, Round, Direction, Relevance, IncludedStatus, WosIndex } from '@/types/paper';
import HeaderSection from '@/components/HeaderSection.vue';
import StatsSection from '@/components/StatsSection.vue';
import ControlsSection from '@/components/ControlsSection.vue';
import AddPaperForm from '@/components/AddPaperForm.vue';
import PapersTable from '@/components/PapersTable.vue';
import { usePapers } from '@/composables/usePapers';
import { useExportCsv } from '@/composables/useExportCsv';

const ROUNDS: Round[] = ['Seed', 'Round 1', 'Round 2', 'Round 3'];
const DIRECTIONS: Direction[] = ['No direction', 'Backward', 'Forward'];
const RELEVANCE: Relevance[] = ['High', 'Medium', 'Low'];
const INCLUDED: IncludedStatus[] = ['Yes', 'No', 'Pending'];
const WOS: WosIndex[] = ['SSCI', 'SCI', 'SSCI/SCI', 'ESCI', 'Not WoS', 'Unknown'];

// Use the papers composable
const {
    papers,
    loading,
    stats,
    initializeDatabase,
    addPaper: addPaperToDb,
    updatePaper,
    deletePaper: deletePaperFromDb,
} = usePapers();

// Use the export CSV composable
const { exportToCSV } = useExportCsv();

const showForm = ref(false);
const search = ref('');
const filterRound = ref<'All' | Round>('All');
const filterStatus = ref<'All' | IncludedStatus>('All');
const filterDir = ref<'All' | Direction>('All');

const emptyRow = (): Omit<Paper, 'id'> => ({
    round: 'Round 1',
    direction: 'Backward',
    authors: '',
    year: new Date().getFullYear(),
    title: '',
    journal: '',
    wosIndex: 'Unknown',
    keywords: '',
    relevance: 'Pending',
    included: 'Pending',
    notes: '',
    doi: '',
});

const newRow = ref<Omit<Paper, 'id'>>(emptyRow());

const resetForm = () => {
    newRow.value = emptyRow();
};

// Add new paper handler
const addPaper = async () => {
    if (!newRow.value.title.trim() || !newRow.value.authors.trim()) {
        alert('Title and Authors are required fields.');
        return;
    }

    try {
        await addPaperToDb(toRaw(newRow.value));
        resetForm();
        showForm.value = false;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add paper. Please try again.';
        alert(errorMessage);
    }
};

// Delete paper handler
const deletePaper = async (id: number) => {
    if (confirm('Remove this paper?')) {
        try {
            await deletePaperFromDb(id);
        } catch (error) {
            alert('Failed to delete paper. Please try again.');
        }
    }
};

// Edit paper handler
const editPaper = async (updatedPaper: Paper) => {
    try {
        await updatePaper(toRaw(updatedPaper));
    } catch (error) {
        alert('Failed to update paper. Please try again.');
    }
};

// Export papers to CSV
const exportCsv = () => {
    exportToCSV(papers.value);
};

// Filtered papers computed property
const filtered = computed(() =>
    papers.value.filter((p) => {
        if (filterRound.value !== 'All' && p.round !== filterRound.value) return false;
        if (filterStatus.value !== 'All' && p.included !== filterStatus.value) return false;
        if (filterDir.value !== 'All' && p.direction !== filterDir.value) return false;
        if (search.value) {
            const q = search.value.toLowerCase();
            return [p.title, p.authors, p.keywords, p.journal, p.notes].some((f) =>
                f.toLowerCase().includes(q),
            );
        }
        return true;
    }),
);

// Initialize database on component mount
onMounted(() => {
    initializeDatabase();
});
</script>

<template>
    <main class="app">
        <HeaderSection />

        <div v-if="loading" style="text-align: center; padding: 40px; color: #6b7280;">
            Loading papers from database...
        </div>

        <template v-else>
            <StatsSection :stats="stats" />

            <ControlsSection v-model:search="search" v-model:filter-round="filterRound"
                v-model:filter-status="filterStatus" v-model:filter-dir="filterDir" :rounds="ROUNDS"
                :directions="DIRECTIONS" :included="INCLUDED" @add-paper="showForm = !showForm"
                @export-csv="exportCsv" />

            <AddPaperForm v-if="showForm" v-model:new-row="newRow" :rounds="ROUNDS" :directions="DIRECTIONS"
                :relevance="RELEVANCE" :included="INCLUDED" :wos="WOS" @save="addPaper"
                @cancel="showForm = false; resetForm()" />

            <PapersTable :papers="filtered" :rounds="ROUNDS" :directions="DIRECTIONS" :relevance="RELEVANCE"
                :included="INCLUDED" :wos="WOS" @edit="editPaper" @delete="deletePaper" />
        </template>
    </main>
</template>
