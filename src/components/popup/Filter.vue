<script setup>
import { ref, onMounted, defineExpose, watch } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
    initialFilters: Object
})
const emit = defineEmits(['applyFilters'])

const filterModal = ref(null)
let modalInstance = null
const today = new Date().toISOString().split('T')[0]

// Local reactive copy of filters for editing inside modal
const localFilters = ref({ ...props.initialFilters })

// Sync modal filters whenever parent filters change
watch(
    () => props.initialFilters,
    (newFilters) => {
        localFilters.value = { ...newFilters }
    },
    { deep: true, immediate: true }
)

onMounted(() => {
    modalInstance = new Modal(filterModal.value)

    // Reset modal filters whenever it is hidden
    filterModal.value.addEventListener('hidden.bs.modal', () => {
        localFilters.value = { ...props.initialFilters }
    })
})

const open = () => modalInstance.show()
const close = () => modalInstance.hide()
defineExpose({ open, close })

const resetFilters = () => {
    localFilters.value = {
        area: '',
        organization: '',
        distance: '',
        duration: '',
        from: today,
        to: ''
    }
}

const applyFilters = () => {
    emit('applyFilters', { ...localFilters.value })
    close()
}
</script>

<template>
    <Teleport to="body">
        <div class="modal fade" tabindex="-1" ref="filterModal" aria-hidden="true">
            <div class="modal-dialog  modal-dialog-centered">
                <div class="modal-content bg-primary text-white rounded-4">
                    <div class="modal-header px-4 border-bottom-0">
                        <h2 class="modal-title">Suche einschränken</h2>
                        <button type="button" class="btn-close btn-close-white" @click="close"></button>
                    </div>

                    <div class="modal-body row">

                        <div class="col-12">
                            <label class="form-label">Bereiche</label>
                            <select class="form-select   rounded-pill" v-model="localFilters.area">
                                <option value="">...</option>
                                <option>Soziales</option>
                                <option>Sport</option>
                                <option>Musik</option>
                            </select>
                        </div>

                        <div class="col-12 mt-3">
                            <label class="form-label">Organisationen</label>
                            <select class="form-select rounded-pill" v-model="localFilters.organization">
                                <option value="">...</option>
                                <option>Organisation A</option>
                                <option>Organisation B</option>
                            </select>
                        </div>

                        <div class="col-6 mt-3">
                            <label class="form-label">Entfernung</label>
                            <select class="form-select rounded-pill" v-model="localFilters.distance">
                                <option value="">...</option>
                                <option>5 km</option>
                                <option>10 km</option>
                                <option>15 km</option>
                                <option>20 km</option>

                            </select>
                        </div>

                        <div class="col-6 mt-3">
                            <label class="form-label">Dauer</label>
                            <select class="form-select rounded-pill" v-model="localFilters.duration">
                                <option value="">...</option>
                                <option>2 Stunden</option>
                                <option>4 Stunden</option>
                                <option>8 Stunden</option>
                                <option>16 Stunden</option>
                            </select>
                        </div>

                        <h4 class="mt-3">Zeitraum</h4>
                        <div class="col-6">
                            <label class="form-label text-white-50">von</label>
                            <input type="date" class="form-control rounded-pill" v-model="localFilters.from" />
                        </div>
                        <div class="col-6">
                            <label class="form-label text-white-50">bis</label>
                            <input type="date" class="form-control rounded-pill" v-model="localFilters.to" />
                        </div>
                    </div>

                    <div class="modal-footer border-top-0">
                        <button class="btn text-white-50" @click="resetFilters">zurücksetzen</button>
                        <button class="btn btn-outline-light" @click="applyFilters">Filter setzen</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>