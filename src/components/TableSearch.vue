<template>
  <div class="d-flex justify-content-between align-items-center mb-3 px-1">
    <h2 class="text-center fw-bold mt-1">Mitglieder</h2>
    <button class="btn btn-sm btn-outline-primary rounded-pill" @click="goToProfile('new')">
      <i class="bi bi-person-plus me-1"></i>Neues Mitglied
    </button>
  </div>

  <div class="search-container mb-3">
    <div class="input-group shadow-sm rounded-pill overflow-hidden border">
      <span class="input-group-text bg-white border-0 text-muted"><i class="bi bi-search"></i></span>
      <input v-model="searchQuery" type="text" class="form-control border-0 shadow-none ps-0"
        placeholder="Mitglieder suchen..." />
    </div>

  </div>

  <div class="card shadow-sm border-0  overflow-hidden">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th class="ps-3 py-3">Name</th>
          <th class="py-3">Rolle</th>
          <th class="py-3 text-end pe-3"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="person in paginatedItems" :key="person.id">
          <tr @click="toggleMember(person)" style="cursor: pointer;">
            <td class="ps-3 py-3">
              <span class="fw-bold text-dark">{{ person.name }}</span>

            </td>
            <td class="py-3">
              <span class="badge bg-primary-subtle text-primary rounded-pill">{{ person.jobTitle || 'Volunteer'
              }}</span>
            </td>
            <td class="text-end pe-3 py-3">
              <i class="bi" :class="person.expanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </td>
          </tr>

          <tr v-if="person.expanded" class="bg-light">
            <td colspan="3" class="p-3">
              <div class="d-flex flex-column gap-2">
                <small class="text-muted">
                  <strong>Adresse:</strong> {{ person.address || 'Hauptstraße 1, 4202 Eidenberg' }}
                  <small class="text-muted d-block" style="font-size: 0.75rem;"><strong>Mitglied</strong> seit
                    23.07.2023 </small>
                </small>

                <div class="d-flex gap-2 mt-2 justify-content-end">
                  <button class="btn btn-sm btn-primary rounded-pill " @click="goToProfile(person.id)">
                    <i class="bi bi-person me-1"></i>Profil
                  </button>

                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary rounded-pill" data-bs-toggle="dropdown">
                      <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><button class="dropdown-item" @click="changeRights(person)">Rechte ändern</button></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><button class="dropdown-item text-danger" @click="handleRemove(person)">Entfernen</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ items: { type: Array, default: () => [] } });
const router = useRouter();

// Erweitere Items lokal um 'expanded'-Status
const internalItems = ref(props.items.map(i => ({ ...i, expanded: false })));

const toggleMember = (person) => { person.expanded = !person.expanded; };

const goToProfile = (id) => router.push({ name: 'user-profile', params: { id: id } });

const changeRights = (person) => {
  const newRole = prompt("Neue Rolle eingeben:", person.jobTitle);
  if (newRole) person.jobTitle = newRole;
};

const handleRemove = (person) => {
  if (confirm("Wirklich entfernen?")) {
    internalItems.value = internalItems.value.filter(i => i.id !== person.id);
  }
};

// Such- und Paginierungs-Logik (wie gehabt)
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredItems = computed(() => {
  return internalItems.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));
const changePage = (page) => { currentPage.value = page; };
</script>