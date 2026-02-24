<script setup lang="ts">
import { ref } from 'vue';
import type { Stats } from '@/types/paper';

defineProps<{
    stats: Stats;
}>();

const showStats = ref(true);
</script>

<template>
    <section>
        <button class="toggle-link" style="margin-bottom: 8px" @click="showStats = !showStats">
            {{ showStats ? 'Hide' : 'Show' }} Statistics
        </button>
        <div v-if="showStats" class="stats__grid">
            <article class="stats__card stats__card--blue">
                <data class="stats__number" :value="stats.total">{{ stats.total }}</data>
                <p class="stats__label">Total</p>
            </article>
            <article class="stats__card stats__card--green">
                <data class="stats__number" :value="stats.included">{{ stats.included }}</data>
                <p class="stats__label">Included</p>
            </article>
            <article class="stats__card stats__card--red">
                <data class="stats__number" :value="stats.excluded">{{ stats.excluded }}</data>
                <p class="stats__label">Excluded</p>
            </article>
            <article class="stats__card stats__card--orange">
                <data class="stats__number" :value="stats.pending">{{ stats.pending }}</data>
                <p class="stats__label">Pending</p>
            </article>
            <article class="stats__card stats__card--purple">
                <data class="stats__number" :value="stats.seeds">{{ stats.seeds }}</data>
                <p class="stats__label">Seeds</p>
            </article>
            <article class="stats__card stats__card--indigo">
                <data class="stats__number" :value="stats.backward">{{ stats.backward }}</data>
                <p class="stats__label">Backward</p>
            </article>
            <article class="stats__card stats__card--teal">
                <data class="stats__number" :value="stats.forward">{{ stats.forward }}</data>
                <p class="stats__label">Forward</p>
            </article>
            <article class="stats__card stats__card--yellow">
                <data class="stats__number" :value="stats.highRel">{{ stats.highRel }}</data>
                <p class="stats__label">High Rel.</p>
            </article>
        </div>
    </section>
</template>
