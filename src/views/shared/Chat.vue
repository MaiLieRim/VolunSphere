<script setup>
import { useRoute } from 'vue-router';
import ChatHistory from '@/components/chat/ChatHistory.vue';
import ChatNavbar from '@/components/chat/ChatNavbar.vue';
import Footer from '@/components/common/Footer.vue';

const route = useRoute();

</script>

<template>
  <ChatNavbar :name="route.params.name"></ChatNavbar>

  <div class="content-container">
    <ChatHistory :name="route.params.name"></ChatHistory>
  </div>
</template>

<style></style>
