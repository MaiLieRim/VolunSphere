<template>
    <div id="carouselIndicators" class="space carousel slide" data-bs-ride="carousel">
        <h2>{{ title }}</h2>
        <div class="carousel-indicators">
            <button v-for="(item, index) in items" :key="item.id" :data-bs-target="'#carouselIndicators'"
                :data-bs-slide-to="index" :class="{ 'active': index === 0 }" class="form-check-input"
                :aria-label="'Slide ' + (index + 1)"></button>
        </div>
        <div class="carousel-inner">
            <div v-for="(item, index) in items" :key="item.id" class="carousel-item"
                :class="{ 'active': index === activeIndex }">
                <RouterLink :to="{ name: 'task', params: { itemId: item.id } }" class="card text-decoration-none">
                    <div class="img-with-date">
                        <img :src="`/assets/images/tasks/${item.image}`" class="card-img-top img-fluid" height="215">
                        <div class="date date-box col-3">
                            <small>{{ item.club }}</small>
                            <h1>{{ item.day }}</h1>
                            <small>{{ item.month }}</small>
                        </div>
                    </div>
                    <div class="card-body">
                        <small class="opacity-50">{{ item.location }}, {{ item.industry }}</small>
                        <div class="card-text">
                            <h3>{{ item.title }}</h3>
                            <p>{{ item.description }}</p>
                        </div>
                        <small class="text-muted">ORT: {{ item.location }}</small>
                        <p><small class="text-muted">#keywords</small></p>
                        <div class="d-flex align-items-center text-muted gap-6">
                            <small class="col-3">
                                <img src="/src/assets/images/profile-pictures/liselotte.png" alt="twbs" width="20" height="20"
                                    class="rounded-circle flex-shrink-0">
                                {{ item.jobs }}+
                            </small>
                            <small>
                                <i class="bi bi-chat me-1"></i>messages 100+
                            </small>
                        </div>
                        <!-- Fortschrittsleiste -->
                       <TaskRecommendationBar :match="90-index*10"></TaskRecommendationBar>
                    </div>
                </RouterLink>
            </div>
        </div>

        <button class="carousel-control-prev bs-primary" type="button" data-bs-target="#carouselIndicators"
            data-bs-slide="prev">
            <span aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
            <span class="text-dark" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>

<script setup>
import { Carousel } from "bootstrap";
import { ref,onMounted } from "vue";
import TaskRecommendationBar from "@/components/tasks/TaskRecommendationBar.vue"

defineProps({
    title: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    }
});
onMounted(() => {
    const carousel = document.querySelector('#carouselIndicators');
    if (carousel) {
        new Carousel(carousel, {
            touch: true // Ensures touch support is enabled
        });
    }
});

const activeIndex = ref(0);


</script>

<style scoped>

.carousel-indicators {
    margin-bottom: -1.5rem;
}

.carousel-indicators .form-check-input {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    border: 2px solid var(--bs-primary);
    background-color: #ccc;
}

.carousel-indicators .active {
    border: 5px solid var(--bs-primary);
    box-sizing: border-box;
    width: calc(0.7rem + 5px);
    height: calc(0.7rem + 5px);
}

.img-with-date {
    position: relative;
}

.date {
    position: absolute;
    bottom: 0;
}

.card-text {
    height: 8rem;
}

.card-body p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.card-text h3 {
    height: 2.7rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
