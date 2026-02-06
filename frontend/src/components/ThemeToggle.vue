<template>
  <q-btn flat round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleTheme">
    <q-tooltip>{{ $q.dark.isActive ? "Light mode" : "Dark mode" }}</q-tooltip>
  </q-btn>
</template>

<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();

function toggleTheme() {
  $q.dark.toggle();
  localStorage.setItem("darkMode", $q.dark.isActive ? "true" : "false");
}
</script>
