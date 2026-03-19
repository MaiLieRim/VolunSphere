<style scoped>
/* Search Navbar */
.tab-navigation {
    overflow-x: auto;
    width: 100%;
    white-space: nowrap;
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    width: 100%;
    padding: 8px calc(var(--bs-gutter-x)* 0.5);
}
.search-bar {
    transition: width 0.3s ease-in-out;
    width: 0px;
    background-color: transparent;
    z-index: 100 !important;
    position: relative;
    border: 0;
}

.search-bar:focus {
    width: 250px !important;
}
</style>

<template>
    <div :class="backgroundClass">
        <div class="container">
            <div class="tab-navigation" :class="backgroundClass">
                <div class="d-flex justify-content-between">
                    <div class="nav nav-underline d-inline-flex">

                        <!-- Optional search button -->
                        <div v-if="showSearch" class="nav-item">
                            <RouterLink class="nav-link" to="/task-search">
                                <i class="bi bi-search"></i>
                            </RouterLink>
                        </div>

                        <!-- Dynamic tabs -->
                        <div v-for="tab in tabs" :key="tab.name" class="nav-item">
                            <a class="nav-link" :class="{
                                'active text-primary': currentTab === tab.name,

                            }" href="#" @click.prevent="selectTab(tab.name)">
                                {{ tab.label }}
                            </a>
                        </div>
                    </div>
                     <div v-if="!showSearch" class="d-flex align-items-center ">
                        <div class="position-relative ">
                            <input type="text" class="form-control rounded-pill search-bar pe-5" placeholder="Search..."
                                aria-label="Search">
                            <button class="text-primary btn position-absolute top-50 end-0 translate-middle-y"
                                type="button">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    tabs: {
        type: Array,
        required: true
    },
    currentTab: {
        type: String,
        required: true
    },
    showSearch: {
        type: Boolean,
        default: true
    },
    backgroundClass: {
        type: String,
        default: "bg-white"
    }
})

const emit = defineEmits(['update:tab'])

function selectTab(tab) {
    emit('update:tab', tab)
}
</script>