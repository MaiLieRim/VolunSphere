<template>
  <div class="form-group pull-right mb-3">
    <input
      v-model="searchQuery"
      type="text"
      class="form-control"
      placeholder="Wonach suchst du?"
    />
  </div>

  <!-- Tabelle -->
  <div class="table-responsive">
    <table class="table table-hover table-bordered">
      <thead class="table-light">
        <tr>
          <th class="text-wrap">Name</th>
          <th class="text-wrap">Rolle</th>
          <th class="text-wrap">Adresse</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedItems.length === 0">
          <td colspan="3" class="text-center text-muted">Keine Ergebnisse gefunden</td>
        </tr>
        <tr v-for="(person, index) in paginatedItems" :key="person.name">
          <td class="text-break">{{ person.name }}</td>
          <td class="text-wrap">{{ person.jobTitle || 'Volunteer' }}</td>
          <td class="text-wrap">{{ person.address || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <nav v-if="totalPages > 1" class="d-flex justify-content-between">
    <div>
      <span class="counter">{{ filteredItems.length }} Mitglieder</span>
    </div>

    <ul class="pagination justify-content-end">
      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <button class="page-link" @click="changePage(page)">{{ page }}</button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 4;

// Watch searchQuery to reset page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Filtered results based on search
const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter(person =>
    Object.values(person).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Total pages
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));

// Paginated items
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

// Change page
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};
</script>