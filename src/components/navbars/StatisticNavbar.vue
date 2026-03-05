<style scoped>
h4,
h1 {
    margin-bottom: 0 !important;
}
</style>

<template>
    <nav class="shadow navbar bg-primary">
        <div class="container text-center">
            <div>
                <h1>221</h1>
                <h4>Badges</h4>
            </div>
            <div>
                <h1>6</h1>

                <h4 v-if="userRole === 'volunteer'">Organisationen</h4>
                <h4 v-if="userRole === 'admin'">Funktionen</h4>
            </div>
            <div>
                <div>
                    <h1>21</h1>
                </div>
                <h4>Aufgaben</h4>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { ref } from 'vue';
const userRole = ref(localStorage.getItem('userRole')); 
</script>