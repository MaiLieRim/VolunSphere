<template>
  <div class="content-container pt-0">
    <div class="d-flex justify-content-between align-items-center p-2 bg-light">
      <h3 class="fw-bold mb-0">Kompetenz-Details</h3>
      <button class="btn text-dark p-0" @click="$router.back()">
        <i class="bi bi-x fs-1"></i>
      </button>
    </div>
    <div class="card border-0 shadow-sm rounded-4 mb-4 p-3">
      <img src="/assets/images/competences.png" alt="Radar Chart" style="width: 80%;" class="mx-auto img-fluid">
      <div class="mb-4 p-4">
        <h5 class="fw-bold mb-3">Fortschritt nach Kompetenz</h5>
        <div v-for="c in competences" :key="c.name" class="mb-3">
          <div class="d-flex justify-content-between small mb-1">
            <span class="fw-medium">{{ c.name }}</span>
            <span class="text-primary fw-bold">{{ c.value }}%</span>
          </div>
          <div class="progress" style="height: 8px;">
            <div class="progress-bar bg-primary" :style="{ width: c.value + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 mb-4 p-4">
        <h5 class="fw-bold mb-3"><i class="bi bi-diagram-3 me-2"></i>ESCO-Mapping</h5>
        <p class="small text-muted">Aktuelle Zuordnung Ihrer Fähigkeiten zu europäischen Standards.</p>
        <div class="list-group list-group-flush">
          <div v-for="m in escoMappings" :key="m.id" class="list-group-item px-0 border-0">
            <div class="d-flex justify-content-between align-items-center">
              <span class="small">{{ m.skill }}</span>
              <span class="badge bg-light text-dark border">{{ m.code }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="d-grid mb-5">
        <button class="btn btn-outline-primary rounded-pill py-2" @click="exportData">
          <i class="bi bi-file-earmark-pdf me-2"></i>Kompetenz-Report exportieren
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Radar as RadarChart } from 'vue-chartjs'; // Benötigt Chart.js

const competences = ref([
  { name: 'Lernbereitschaft', value: 47 },
  { name: 'Anpassungsfähigkeit', value: 31 },
  { name: 'Organisationsstärke', value: 71 },
  { name: 'Selbstmanagement', value: 55 }
]);

const escoMappings = ref([
  { skill: 'Problemlösung', code: 'ESCO-1029' },
  { skill: 'Zeitmanagement', code: 'ESCO-9982' }
]);

// Chart-Konfiguration
const radarData = {
  labels: competences.value.map(c => c.name),
  datasets: [{ label: 'Aktuell', data: competences.value.map(c => c.value), backgroundColor: 'rgba(13, 110, 253, 0.2)' }]
};

const radarOptions = { responsive: true, maintainAspectRatio: false };

const exportData = () => alert("PDF-Export wird generiert...");
</script>