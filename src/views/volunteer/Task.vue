<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useTasks } from '@/composables/useTasks';

defineProps({
  itemId: String
});

const route = useRoute();
const { getTaskById } = useTasks();
const jobPosting = computed(() => getTaskById(route.params.itemId));

// Application form data
const application = ref({
  name: 'Liselotte Pulver',
  email: 'lisil@pulver.at',
  message: ''
});

// Function to handle form submission
const submitApplication = () => {
  alert('Bewerbung erfolgreich eingereicht!'); // Handle the actual submission logic here
};
</script>
<style scoped>
textarea.form-control {
  padding: 0.375rem 0.75rem !important;
}
.accordion-button:not(.collapsed) {
  background-color: var(--bs-accordion-active-bg);
  color: var(--bs-accordion-active-color);
}
</style>

<template>
  <Navbar title="Aufgabe"></Navbar>
  <div class="content-container">
    <div v-if="jobPosting">
      <!-- Job Title -->
      <h1>{{ jobPosting ? jobPosting.title : 'Aufgabe nicht gefunden' }} </h1>
      <p class="text-secondary d-flex flex-column">
        <small>
          <i class="bi bi-geo-alt"></i> {{ jobPosting?.jobLocation?.address?.streetAddress }}, {{
            jobPosting?.jobLocation?.address?.addressLocality }}
        </small>

        <small>
          <i class="bi bi-clock-history"></i> {{ jobPosting?.workHours }}
        </small>
      </p>

      <!-- Job Description -->
      <p class="card-body">
      <h5 class="card-title text-secondary"><i class="bi bi-file-earmark-text"></i> Beschreibung</h5>
      <div class="card-text">{{ jobPosting?.description }}</div>
      </p>

      <small class="text-secondary ">
        <i class="bi bi-info-circle"></i> Aufgabe Details
      </small>

      <div class="accordion accordion-flush" id="jobDetailsAccordion">
        <!-- Job Duration -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingDuration">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDuration"
              aria-expanded="false" aria-controls="collapseDuration">
              <i class="bi bi-clock"></i>
              <div class="mx-2">
                Zeitraum
              </div>
            </button>
          </h2>
          <div id="collapseDuration" class="accordion-collapse collapse show" aria-labelledby="headingDuration"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting?.datePosted }} bis {{ jobPosting?.validThrough }}
            </div>
          </div>
        </div>

        <!-- Work Hours -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingWorkHours">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseWorkHours" aria-expanded="false" aria-controls="collapseWorkHours">
              <i class="bi bi-clock-history"></i>
              <div class="mx-2">
                Stundenausmaß
              </div>
            </button>
          </h2>
          <div id="collapseWorkHours" class="accordion-collapse collapse" aria-labelledby="headingWorkHours"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting?.workHours }}
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingSkills">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseSkills" aria-expanded="false" aria-controls="collapseSkills">
              <i class="bi bi-gear"></i>
              <div class="mx-2">
                Skills
              </div>
            </button>
          </h2>
          <div id="collapseSkills" class="accordion-collapse collapse" aria-labelledby="headingSkills"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting?.skills }}
            </div>
          </div>
        </div>

        <!-- Qualifications -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingQualifications">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseQualifications" aria-expanded="false" aria-controls="collapseQualifications">
              <i class="bi bi-person-check"></i>
              <div class="mx-2">
                Qualifikationen
              </div>
            </button>
          </h2>
          <div id="collapseQualifications" class="accordion-collapse collapse" aria-labelledby="headingQualifications"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting?.qualifications }}
            </div>
          </div>
        </div>

        <!-- Experience Requirements -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingExperience">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseExperience" aria-expanded="false" aria-controls="collapseExperience">
              <i class="bi bi-briefcase"></i>
              <div class="mx-2">
                Voraussetzungen
              </div>
            </button>
          </h2>
          <div id="collapseExperience" class="accordion-collapse collapse" aria-labelledby="headingExperience"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting.experienceRequirements ? jobPosting.experienceRequirements.monthsOfExperience +
                ' Monate Erfahrung' : 'Keine speziellen Voraussetzungen' }}
            </div>
          </div>
        </div>
        <!-- Date Posted -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingDatePosted">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseDatePosted" aria-expanded="false">
              <i class="bi bi-calendar-day"></i>
              <div class="mx-2">
                Veröffentlicht am
              </div>
            </button>
          </h2>
          <div id="collapseDatePosted" class="accordion-collapse collapse " aria-labelledby="headingDatePosted"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting?.datePosted }}
            </div>
          </div>
        </div>

        <!-- Expiration Date -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingExpirationDate">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseExpirationDate" aria-expanded="false" aria-controls="collapseExpirationDate">
              <i class="bi bi-calendar-x"></i>
              <div class="mx-2">
                Ablaufdatum
              </div>
            </button>
          </h2>
          <div id="collapseExpirationDate" class="accordion-collapse collapse" aria-labelledby="headingExpirationDate"
            data-bs-parent="#jobDetailsAccordion">
            <div class="accordion-body">
              {{ jobPosting?.validThrough }}
            </div>
          </div>
        </div>
      </div>
      <div class="card mx-0 my-4 shadow-sm">
        <div class="card-header">
          <div class="text-secondary"><i class="bi bi-pencil-square"></i> Bewerbung</div>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitApplication">
            <!-- Name Field -->
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" id="name" disabled v-model="application.name" class="form-control" required />
            </div>

            <!-- Email Field -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" disabled v-model="application.email" class="form-control" required />
            </div>

            <!-- Message Field -->
            <div class="mb-3">
              <label for="message" class="form-label">Nachricht</label>
              <textarea id="message" v-model="application.message" class="form-control" rows="4" required></textarea>
            </div>

            <!-- Apply Button -->
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-send"></i> Bewerben
            </button>
          </form>
        </div>
      </div>
      <div class="card mx-0 mb-4 shadow-sm">
        <div class="card-header">
          <div class="text-secondary"><i class="bi bi-info-circle"></i> Aufgabe Zusammenfassung</div>
        </div>
        <div class="card-body">

          <p class="card-text">
            <strong>Aufgabe:</strong> {{ jobPosting?.title }} <br>
            <strong>Ort:</strong> {{ jobPosting?.jobLocation?.address?.streetAddress }}, {{
              jobPosting?.jobLocation?.address?.addressLocality }} <br>
            <strong>Veröffentlicht am:</strong> {{ jobPosting?.datePosted }} <br>
            <strong>Ablaufdatum:</strong> {{ jobPosting?.validThrough }} <br>
            <strong>Stundenausmaß:</strong> {{ jobPosting?.workHours }}
          </p>
        </div>
      </div>
      <div class="card mx-0 mb-4 shadow-sm">
        <div class="card-header">
          <div class="text-secondary"><i class="bi bi-envelope"></i> Organisation, Kontakt</div>
        </div>
        <div class="card-body">
          <p class="card-text">
            <strong>Organisation:</strong> {{ jobPosting?.hiringOrganization?.name }} <br>
            <strong>Website:</strong> <a :href="jobPosting?.hiringOrganization?.sameAs" target="_blank">{{
              jobPosting?.hiringOrganization?.sameAs }}</a> <br>


            <strong>Email:</strong> <a :href="'mailto:' + jobPosting?.applicationContact?.email">{{
              jobPosting?.applicationContact?.email }}</a> <br>
            <strong>Telefon:</strong> {{ jobPosting.applicationContact.telephone }} <br>
          
          </p>
        </div>
      </div>

    </div>

    <!-- Error Message -->
    <div v-else>
      <div class="alert alert-danger" role="alert">
        Diese Aufgabe gibt es nicht!
      </div>
    </div>

  </div>

  <Footer />
</template>
