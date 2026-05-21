<template>
    <div class="container d-flex flex-column min-vh-100 bg-white px-3 py-2" style="max-width: 500px; margin: 0 auto;">
        
        <div class="d-flex justify-content-between align-items-start mt-3 mb-4 w-100">
            <router-link to="/" title="Zurück zur Startseite" class="text-decoration-none">
                <Logo style="max-width: 120px;" />
            </router-link>
            
            <router-link to="/" class="btn btn-link text-muted p-1 text-decoration-none" title="Login abbrechen">
                <i class="bi bi-x-lg fs-4"></i>
            </router-link>
        </div>

        <div class="mb-5">
            <h1 class="fw-bolder text-dark" style="letter-spacing: -0.5px;">Freiwilligenpass</h1>
            <p class="text-muted fs-5 mt-2">Bereit für den nächsten Einsatz?</p>
        </div>
        
       <form ref="loginForm" class="needs-validation" novalidate @submit.prevent="login">
            
            <div class="form-floating mb-3">
                <input type="text" class="form-control bg-light border-0 rounded-3" id="inputUsername" placeholder="Benutzername / E-Mail" required v-model="username">
                <label for="inputUsername" class="text-muted">Benutzer / E-Mail</label>
                <div class="invalid-feedback">Bitte gib deinen Benutzernamen oder deine E-Mail ein.</div>
            </div>

            <div class="form-floating mb-3">
                <input type="password" class="form-control bg-light border-0 rounded-3" id="floatingPassword" placeholder="Passwort" required v-model="password">
                <label for="floatingPassword" class="text-muted">Passwort</label>
                <div class="invalid-feedback">Bitte gib dein Passwort ein.</div>
            </div>

            <div v-if="loginError" class="alert alert-danger py-2 small d-flex align-items-center rounded-3">
                <i class="bi bi-shield-exclamation fs-5 me-2"></i>
                Benutzername oder Passwort ist falsch.
            </div>

            <div class="d-flex justify-content-end mb-4">
                <a class="small text-decoration-none fw-medium text-primary" href="#">Passwort vergessen?</a>
            </div>

            <button class="btn btn-primary w-100 rounded-pill py-3 mb-2" type="submit">
                Anmelden
            </button>
        </form>

        <div class="d-flex flex-column gap-3 mt-2">
            <div class="d-flex align-items-center">
                <hr class="flex-grow-1 text-muted opacity-25">
                <span class="mx-3 text-muted small fw-medium">Oder anmelden mit</span>
                <hr class="flex-grow-1 text-muted opacity-25">
            </div>

            <button class="btn btn-outline-dark w-100 rounded-pill py-2 fw-medium d-flex align-items-center justify-content-center" type="button">
                <i class="bi bi-person-vcard fs-5 me-2"></i> ID Austria
            </button>
            
            <div class="d-flex gap-3 justify-content-center mt-2">
                <button class="btn btn-light border rounded-circle d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;" type="button" title="Mit Google anmelden">
                    <i class="bi bi-google fs-5 text-dark"></i>
                </button>
                <button class="btn btn-light border rounded-circle d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;" type="button" title="Mit Apple anmelden">
                    <i class="bi bi-apple fs-5 text-dark"></i>
                </button>
            </div>
        </div>

        <div class="mt-auto pt-5 pb-3 w-100">
            
            <div class="text-center mb-4 bg-light p-3 rounded-4">
                <span class="text-muted d-block mb-1">Neu beim Freiwilligenpass?</span>
                <router-link to="/registry" class="text-primary text-decoration-none fw-bold small">
                    Als Freiwillige:r registrieren
                </router-link>
            </div>
            
            <div class="text-center">
                <span class="text-muted small me-2">Sie vertreten eine Einrichtung?</span>
                <router-link to="/registry-org" class="text-dark text-decoration-none fw-bold small">
                    Organisation registrieren <i class="bi bi-arrow-right-short align-middle"></i>
                </router-link>
            </div>

        </div>
    </div>
</template>


<script setup>
import { useAuth } from '@/assets/js/auth';
import Logo from '@/components/common/Logo.vue';

const { loginForm, username, password, loginError, login } = useAuth();
</script>

<style scoped>
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px var(--bs-light) inset !important;
}
</style>