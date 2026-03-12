<template>
    <div class="card">
        <div class="card-body">
            <h2 v-html="highlightNumbers(message)"></h2>
        </div>
    </div>
</template>

<script setup>


defineProps({
    message: {
        type: String,
        required: true,
        default: 'Sie haben 0 neue Nachweisanfragen.'
    }
});

const highlightNumbers = (text) => {
    if (!text) return '';
    return text.replace(/(\d+)/g, '<span class="text-primary fw-bold">$1</span>');
};
</script>
<style scoped>
.card-body  {
   margin: 0.50rem;
}
</style>

