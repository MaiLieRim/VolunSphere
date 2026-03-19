<template>
  <div class="d-flex align-items-center">
    <i class="bi bi-moon"></i>
    <label class="me-2" for="flexSwitchCheckDefault">Dark Mode</label>
    <div class="form-check form-switch">
      <input id="darkModeToggle" class="form-check-input" type="checkbox" role="switch" v-model="isDarkMode" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const theme = ref(localStorage.getItem('theme') || 'light');

watch(theme, (newTheme) => {
  document.documentElement.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Computed property for checking if dark mode is enabled
const isDarkMode = computed({
  get() {
    return theme.value === 'dark';
  },
  set(value) {
    theme.value = value ? 'dark' : 'blue';
  }
});
</script>