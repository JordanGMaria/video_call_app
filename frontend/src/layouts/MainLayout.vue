<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { inject, onMounted } from "vue";

// Acessar socket via inject
const socket = inject("socket");

onMounted(() => {
  // Conectar socket quando a aplicação é montada
  if (socket && !socket.connected) {
    socket.connect();
  }
});
</script>
