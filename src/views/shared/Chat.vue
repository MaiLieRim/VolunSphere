<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ChatHistory from '@/components/chat/ChatHistory.vue';
import ChatNavbar from '@/components/chat/ChatNavbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

</script>

<template>
  <ChatNavbar :name="route.params.name"></ChatNavbar>

  <div class="content-container">
    <ChatHistory :name="route.params.name"></ChatHistory>
  </div>
  <Footer></Footer>
</template>

<style></style>
