<script setup lang="ts">
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';

const router = useRouter();
</script>

<template>
  <div id="app">
    <Toast position="top-right" />
    <router-view />
  </div>
</template>

<style scoped>

</style>
