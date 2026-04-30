<template>
    <div v-if="visible" class="card">
        <div class="card-body">
            <h2>
                <span class="text-primary">1</span> abgeschlossene Aufgabe: <br>
                Gut gemacht!
            </h2>
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-primary" @click="visible = false">OK</button>
                <router-link :to="{ name: 'tasks', query: { tab: 'completed' } }" href="#" class="btn btn-primary">Jetzt Nachweis
                    Anfordern!</router-link>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";

const visible = ref(true);
</script>
