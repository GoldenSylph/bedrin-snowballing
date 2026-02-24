<script setup lang="ts">
import { ref } from 'vue';
import type { Paper, Round, Direction, Relevance, IncludedStatus, WosIndex } from '@/types/paper';

defineProps<{
    papers: Paper[];
    rounds: Round[];
    directions: Direction[];
    relevance: Relevance[];
    included: IncludedStatus[];
    wos: WosIndex[];
}>();

const emit = defineEmits<{
    edit: [paper: Paper];
    delete: [id: number];
}>();

const editId = ref<number | null>(null);
const editData = ref<Partial<Paper>>({});

const startEdit = (p: Paper) => {
    editId.value = p.id;
    editData.value = { ...p };
};

const saveEdit = () => {
    if (editId.value !== null && editData.value) {
        emit('edit', { ...editData.value } as Paper);
        editId.value = null;
    }
};

const roundBadge = (r: Round) => {
    const badges: Record<Round, string> = {
        Seed: 'badge--seed',
        'Round 1': 'badge--r1',
        'Round 2': 'badge--r2',
        'Round 3': 'badge--r3',
    };
    return badges[r] || 'badge--seed';
};

const dirBadge = (d: Direction) => {
    const badges: Record<Direction, string> = {
        'No direction': 'badge--dash',
        Backward: 'badge--back',
        Forward: 'badge--fwd',
    };
    return badges[d] || 'badge--dash';
};

const relBadge = (r: Relevance | 'Pending') => {
    const badges: Record<Relevance | 'Pending', string> = {
        High: 'badge--high',
        Medium: 'badge--medium',
        Low: 'badge--low',
        Pending: 'badge--pending',
    };
    return badges[r] || 'badge--pending';
};

const incBadge = (i: IncludedStatus) => {
    const badges: Record<IncludedStatus, string> = {
        Yes: 'badge--yes',
        No: 'badge--no',
        Pending: 'badge--pending',
    };
    return badges[i] || 'badge--pending';
};
</script>

<template>
    <section class="table__wrap">
        <div class="table__scroll">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Round</th>
                        <th>Direction</th>
                        <th>Authors</th>
                        <th>Year</th>
                        <th>Title</th>
                        <th>Journal</th>
                        <th>WoS</th>
                        <th>Keywords</th>
                        <th>Relevance</th>
                        <th>Included</th>
                        <th>Notes</th>
                        <th>DOI</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="papers.length === 0" class="table__row--empty">
                        <td colspan="14">No papers found. Adjust filters or add a new paper.</td>
                    </tr>
                    <template v-for="(p, i) in papers" :key="p.id">
                        <!-- View row -->
                        <tr v-if="editId !== p.id">
                            <td class="table__cell--number">{{ i + 1 }}</td>
                            <td>
                                <span class="badge" :class="roundBadge(p.round)">{{ p.round }}</span>
                            </td>
                            <td>
                                <span class="badge" :class="dirBadge(p.direction)">{{ p.direction }}</span>
                            </td>
                            <td>
                                <div class="table__cell--authors">{{ p.authors }}</div>
                            </td>
                            <td class="table__cell--year">{{ p.year }}</td>
                            <td>
                                <div class="table__cell--clamp">{{ p.title }}</div>
                            </td>
                            <td>
                                <div class="table__cell--clamp-sm table__cell--italic">{{ p.journal }}</div>
                            </td>
                            <td>
                                <span class="badge badge--wos">{{ p.wosIndex }}</span>
                            </td>
                            <td>
                                <div class="table__cell--clamp-sm" style="color: #6b7280">{{ p.keywords }}</div>
                            </td>
                            <td>
                                <span class="badge" :class="relBadge(p.relevance)">{{ p.relevance }}</span>
                            </td>
                            <td>
                                <span class="badge" :class="incBadge(p.included)">{{ p.included }}</span>
                            </td>
                            <td>
                                <div class="table__cell--notes">{{ p.notes }}</div>
                            </td>
                            <td class="table__cell--doi">
                                <a v-if="p.doi" :href="'https://doi.org/' + p.doi" target="_blank">{{ p.doi }}</a>
                            </td>
                            <td>
                                <div class="table__actions">
                                    <button class="btn btn--yellow" @click="startEdit(p)">Edit</button>
                                    <button class="btn btn--red" @click="emit('delete', p.id)">Delete</button>
                                </div>
                            </td>
                        </tr>
                        <!-- Edit row -->
                        <tr v-else class="table__row--editing">
                            <td class="table__cell--number">{{ i + 1 }}</td>
                            <td>
                                <select class="edit__select" v-model="editData.round">
                                    <option v-for="r in rounds" :key="r">{{ r }}</option>
                                </select>
                            </td>
                            <td>
                                <select class="edit__select" v-model="editData.direction">
                                    <option v-for="d in directions" :key="d">{{ d }}</option>
                                </select>
                            </td>
                            <td><input class="edit__input" v-model="editData.authors" /></td>
                            <td>
                                <input class="edit__input" type="number" v-model.number="editData.year"
                                    style="width: 60px" />
                            </td>
                            <td><textarea class="edit__textarea" v-model="editData.title"></textarea></td>
                            <td><input class="edit__input" v-model="editData.journal" /></td>
                            <td>
                                <select class="edit__select" v-model="editData.wosIndex">
                                    <option v-for="w in wos" :key="w">{{ w }}</option>
                                </select>
                            </td>
                            <td><input class="edit__input" v-model="editData.keywords" /></td>
                            <td>
                                <select class="edit__select" v-model="editData.relevance">
                                    <option v-for="r in [...relevance, 'Pending']" :key="r">{{ r }}</option>
                                </select>
                            </td>
                            <td>
                                <select class="edit__select" v-model="editData.included">
                                    <option v-for="i in included" :key="i">{{ i }}</option>
                                </select>
                            </td>
                            <td><textarea class="edit__textarea" v-model="editData.notes"></textarea></td>
                            <td><input class="edit__input" v-model="editData.doi" /></td>
                            <td>
                                <div class="table__actions">
                                    <button class="btn btn--sm-green" @click="saveEdit">Save</button>
                                    <button class="btn btn--sm-gray" @click="editId = null">Cancel</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <footer class="table__footer">Showing {{ papers.length }} paper{{ papers.length !== 1 ? 's' : '' }}</footer>
    </section>
</template>
