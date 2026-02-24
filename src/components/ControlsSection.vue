<script setup lang="ts">
import type { Round, Direction, IncludedStatus } from '@/types/paper';

defineProps<{
    search: string;
    filterRound: 'All' | Round;
    filterStatus: 'All' | IncludedStatus;
    filterDir: 'All' | Direction;
    rounds: Round[];
    directions: Direction[];
    included: IncludedStatus[];
}>();

const emit = defineEmits<{
    'update:search': [value: string];
    'update:filterRound': [value: 'All' | Round];
    'update:filterStatus': [value: 'All' | IncludedStatus];
    'update:filterDir': [value: 'All' | Direction];
    'add-paper': [];
    'export-csv': [];
}>();
</script>

<template>
    <nav class="controls">
        <input type="text" class="controls__search" :value="search"
            @input="emit('update:search', ($event.target as HTMLInputElement).value)"
            placeholder="Search title, author, keyword, journal..." />
        <fieldset class="controls__filter">
            <label class="controls__label">Round:</label>
            <select class="controls__select" :value="filterRound"
                @change="emit('update:filterRound', ($event.target as HTMLSelectElement).value as 'All' | Round)">
                <option>All</option>
                <option v-for="r in rounds" :key="r">{{ r }}</option>
            </select>
        </fieldset>
        <fieldset class="controls__filter">
            <label class="controls__label">Status:</label>
            <select class="controls__select" :value="filterStatus"
                @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value as 'All' | IncludedStatus)">
                <option>All</option>
                <option v-for="s in included" :key="s">{{ s }}</option>
            </select>
        </fieldset>
        <fieldset class="controls__filter">
            <label class="controls__label">Direction:</label>
            <select class="controls__select" :value="filterDir"
                @change="emit('update:filterDir', ($event.target as HTMLSelectElement).value as 'All' | Direction)">
                <option>All</option>
                <option v-for="d in directions" :key="d">{{ d }}</option>
            </select>
        </fieldset>
        <button class="btn btn--blue" @click="emit('add-paper')">+ Add Paper</button>
        <button class="btn btn--gray" @click="emit('export-csv')">Export CSV</button>
    </nav>
</template>
