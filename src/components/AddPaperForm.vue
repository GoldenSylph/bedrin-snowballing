<script setup lang="ts">
import type { Paper, Round, Direction, Relevance, IncludedStatus, TypeOfSource } from '@/types/paper';

const props = defineProps<{
    newRow: Omit<Paper, 'id'>;
    rounds: Round[];
    directions: Direction[];
    relevance: Relevance[];
    included: IncludedStatus[];
    sources: TypeOfSource[];
}>();

const emit = defineEmits<{
    'update:newRow': [value: Omit<Paper, 'id'>];
    save: [];
    cancel: [];
}>();

const updateField = <K extends keyof Omit<Paper, 'id'>>(field: K, value: Omit<Paper, 'id'>[K]) => {
    emit('update:newRow', { ...props.newRow, [field]: value });
};
</script>

<template>
    <form class="form" @submit.prevent="emit('save')">
        <h3 class="form__title">Add New Paper</h3>
        <div class="form__grid">
            <div class="form__field">
                <label class="form__label">Authors</label>
                <input class="form__input" :value="newRow.authors"
                    @input="updateField('authors', ($event.target as HTMLInputElement).value)"
                    placeholder="e.g. Smith & Jones" />
            </div>
            <div class="form__field">
                <label class="form__label">Year</label>
                <input class="form__input" type="number" :value="newRow.year"
                    @input="updateField('year', Number(($event.target as HTMLInputElement).value))" min="1990"
                    max="2030" />
            </div>
            <div class="form__field">
                <label class="form__label">Round</label>
                <select class="form__select" :value="newRow.round"
                    @change="updateField('round', ($event.target as HTMLSelectElement).value as Round)">
                    <option v-for="r in rounds" :key="r">{{ r }}</option>
                </select>
            </div>
            <div class="form__field">
                <label class="form__label">Direction</label>
                <select class="form__select" :value="newRow.direction"
                    @change="updateField('direction', ($event.target as HTMLSelectElement).value as Direction)">
                    <option v-for="d in directions" :key="d">{{ d }}</option>
                </select>
            </div>
            <div class="form__field">
                <label class="form__label">Source Type</label>
                <select class="form__select" :value="newRow.typeOfSource"
                    @change="updateField('typeOfSource', ($event.target as HTMLSelectElement).value as TypeOfSource)">
                    <option v-for="s in sources" :key="s">{{ s }}</option>
                </select>
            </div>
            <div class="form__field">
                <label class="form__label">Relevance</label>
                <select class="form__select" :value="newRow.relevance"
                    @change="updateField('relevance', ($event.target as HTMLSelectElement).value as Relevance | 'Pending')">
                    <option v-for="r in [...relevance, 'Pending']" :key="r">{{ r }}</option>
                </select>
            </div>
            <div class="form__field">
                <label class="form__label">Included</label>
                <select class="form__select" :value="newRow.included"
                    @change="updateField('included', ($event.target as HTMLSelectElement).value as IncludedStatus)">
                    <option v-for="i in included" :key="i">{{ i }}</option>
                </select>
            </div>
            <div class="form__field">
                <label class="form__label">DOI</label>
                <input class="form__input" :value="newRow.doi"
                    @input="updateField('doi', ($event.target as HTMLInputElement).value)"
                    placeholder="10.xxxx/xxxxx" />
            </div>
        </div>
        <div class="form__grid form__grid--wide">
            <div class="form__field">
                <label class="form__label">Title</label>
                <textarea class="form__textarea" :value="newRow.title"
                    @input="updateField('title', ($event.target as HTMLTextAreaElement).value)"
                    placeholder="Full paper title..."></textarea>
            </div>
            <div class="form__field">
                <label class="form__label">Journal</label>
                <input class="form__input" :value="newRow.journal"
                    @input="updateField('journal', ($event.target as HTMLInputElement).value)"
                    placeholder="Journal name" />
            </div>
            <div class="form__field">
                <label class="form__label">Keywords</label>
                <input class="form__input" :value="newRow.keywords"
                    @input="updateField('keywords', ($event.target as HTMLInputElement).value)"
                    placeholder="keyword1, keyword2..." />
            </div>
            <div class="form__field">
                <label class="form__label">Notes / Reason for inclusion or exclusion</label>
                <textarea class="form__textarea" :value="newRow.notes"
                    @input="updateField('notes', ($event.target as HTMLTextAreaElement).value)"
                    placeholder="Brief note..."></textarea>
            </div>
        </div>
        <div class="form__actions">
            <button type="submit" class="btn btn--green">Save Paper</button>
            <button type="button" class="btn btn--gray" @click="emit('cancel')">Cancel</button>
        </div>
    </form>
</template>
