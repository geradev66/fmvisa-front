<script setup lang="ts">
import Toast from 'primevue/toast';
import { useSettingsStore } from './stores/SettingsStore';
// Initialize settings store early so the dark class is applied before first render
useSettingsStore();
</script>

<template>
  <div id="app">
    <Toast position="top-right" />
    <router-view />
  </div>
</template>

<style scoped>

</style>
