<template>
  <Board />
</template>

<script setup lang="ts">
// The Board component will handle all the functionality
// This ensures the auth client is properly initialized
import '@modules/0000-auth/lib/auth.client'
</script>

<style>
@import '~/assets/styles/main.css';
</style>
