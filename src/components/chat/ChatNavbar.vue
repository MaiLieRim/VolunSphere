<template>
    <nav class="navbar bg-dark navbar sticky-top ">
        <div class="container">
            <router-link class="col-8 navbar-brand d-flex align-items-center "
                to="/chatarchiv">
                <i class="bi bi-arrow-left me-2"></i>
                <span class=" text-truncate">
                    {{ name }}
                </span>
            </router-link>
            <form class="d-flex col-4 d-flex justify-content-end">
                <button class="fs-2 py-0 btn btn-dark">
                    <i class="bi bi-camera-video"></i>
                </button>
                <button class="fs-3 p-y btn btn-dark" type="submit"><i class="bi bi-telephone-plus"></i></button>
            </form>
        </div>
    </nav>
</template>
<script setup>
defineProps({
    name: {
        type: String,
        required: true
    }
});
</script>
<style></style>
