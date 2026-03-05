<script setup>
import Navbar from '@/components/navbars/Navbar.vue';
import Logo from '@/components/Logo.vue';
</script>

<template>
    <Navbar title="QR-Code"></Navbar>
    <div class="container py-2">
        <Logo/>
        <h1 class="mt-4 text-left">Dein Code in der Krise</h1>
        <p> Hier findest du alle Kompetenzen die in deinem Freiwilligenpass freigegeben wurden.</p>
        <div class="text-center">
            <img src="/src/assets/images/qrCode.png" class="bg-light w-50 img-fluid">
            <p class="mt-3"> erstellt am 14.6.2024, gültig bis 14.8.2024;
                Liselotte Pulver; 18051978; lise@email.at; +436506006670; 2411;  Strafregisterauszug super!;
                Gruppenleiterin St. Isidor; 1= Führerschein B, 12= Sprengmeisterin, Englisch, Deutsch</p>

            <button type="button" class="btn btn-outline-primary "><i class="bi bi-arrow-clockwise fs-2 fw-bold "></i>
                <br>
                Aktualisieren</button>
            <div class="mt-4 d-grid gap-3">
                <button class="btn btn-primary text-light" type="button">Zu meinem Phone Wallet hinzufügen</button>
                <button class="btn btn-primary text-light" type="button">Zu meinem EU Wallet hinzufügen</button>
            </div>
        </div>
    </div>

</template>
