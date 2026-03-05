<script setup>
import CardCarousell from '@/components/CardCarousell.vue';
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/navbars/Navbar.vue';
import { useTasks } from '@/composables/useTasks';
</script>
<style>
.tags {
    padding-left: 0px;
    display: flex;
    flex-flow: wrap;
}

#tasks-nearby::after {
    content: "\f285";
    background-image: none;
    font-family: bootstrap-icons !important;
    font-weight:500 !important; 
    padding: 0.1rem;
}
</style>
<template>
    <Navbar title="Aufgaben Suche"></Navbar>

    <nav class="navbar bg-primary shadow">
        <div class="container py-2 p-0 ">
            <form class="d-flex w-100" role="search">
                <button type="submit" class="btn "><i class="bi bi-search fs-2 text-light"></i></button>
                <input class="form-control me-3" type="search" placeholder="Was möchtest du machen?"
                    aria-label="Search">
            </form>
        </div>
    </nav>

 
    <div class="content-container">
        <h3 class="mt-1">Aufgaben die du mögen könntest</h3>
        <ul class="mb-3 tags gap-2">
            <li class="btn badge bg-light text-dark">#Soziales</li>
            <li class="btn badge bg-light text-dark">#Organisatorisches</li>
            <li class="btn badge bg-light text-dark">#Websites</li>
            <li class="btn badge bg-light text-dark">#Kommunikation</li>
        </ul>

        <h3>Kategorien</h3>
        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button href="#alle_Aufgaben_in_der_Nähe"
                        class="text-decoration-none  accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        id="tasks-nearby" data-bs-target="#flush-collapse" aria-expanded="false"
                        aria-controls="flush-collapse">
                        Aufgaben in der Nähe
                    </button>
                </h2>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Sport
                    </button>
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div class="list-group list-group-flush">
                        <a href="#alle_Sport_Aufgaben"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Alle Anzeigen in Sport
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Ballsportarten"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Ballsportarten
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Laufsport"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Laufsport
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Fitness_und_Gymnastik"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Fitness und Gymnastik
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                        Musik
                    </button>
                </h2>
                <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div class="list-group list-group-flush">
                        <a href="#alle_Musik_Aufgaben"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Alle Anzeigen in Musik <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Instrumental"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Instrumental <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Gesang" class="list-group-item list-group-item-action d-flex justify-content-between">
                            Gesang <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Bands_und_Ensembles"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Bands und Ensembles <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                        Blaulichteinsätze
                    </button>
                </h2>
                <div id="flush-collapseThree" class="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <div class="list-group list-group-flush">
                        <a href="#alle_Blaulichteinsätze"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Alle Anzeigen in Blaulichteinsätze <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Polizei"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Polizei <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Feuerwehr"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Feuerwehr <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Rettungsdienst"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Rettungsdienst <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                        Soziales
                    </button>
                </h2>
                <div id="flush-collapseFour" class="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <div class="list-group list-group-flush">
                        <a href="#alle_Soziales"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Alle Anzeigen in Soziales <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Nachbarschaftshilfe"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Nachbarschaftshilfe <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Wohltätigkeit"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Wohltätigkeit <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Freiwilligenarbeit"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Freiwilligenarbeit <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                        Kinder und Jugendliche
                    </button>
                </h2>
                <div id="flush-collapseFive" class="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <div class="list-group list-group-flush">
                        <a href="#alle_Kinder_und_Jugendliche"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Alle Anzeigen in Kinder und Jugendliche <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Spielgruppen"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Spielgruppen <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Jugendtreffs"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Jugendtreffs <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#Bildung_und_Nachhilfe"
                            class="list-group-item list-group-item-action d-flex justify-content-between">
                            Bildung und Nachhilfe <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    
        <CardCarousell :items="items" title="Empfehlungen"></CardCarousell>
    </div>

    <Footer></Footer>

</template>
<script>
const { allTasks } = useTasks();
const items = allTasks;
</script>
