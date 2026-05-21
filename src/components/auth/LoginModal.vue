<template>
  <!-- Login Modal -->
  <div
    class="modal fade"
    :class="{ show: isVisible }"
    :style="{ display: isVisible ? 'block' : 'none' }"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Login erforderlich</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Um diese Aktion durchzuführen, müssen Sie sich anmelden.</p>
          <p class="text-muted small">
            Wenn Sie noch kein Konto haben, können Sie sich jetzt registrieren.
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="close"
          >
            Abbrechen
          </button>
          <router-link
            to="/login"
            class="btn btn-primary"
            @click="close"
          >
            Zum Login
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div
    v-if="isVisible"
    class="modal-backdrop fade show"
    @click="close"
  ></div>
</template>

<script setup>
import { ref } from 'vue';

const isVisible = ref(false);

const open = () => {
  isVisible.value = true;
  document.body.style.overflow = 'hidden';
};

const close = () => {
  isVisible.value = false;
  document.body.style.overflow = 'auto';
};

defineExpose({
  open,
  close
});
</script>

<style scoped>
.modal.show {
  z-index: 1050;
}

.modal-backdrop.show {
  z-index: 1040;
}
</style>
