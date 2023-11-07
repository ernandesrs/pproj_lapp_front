<template>
  <v-app>
    <v-main class="d-flex justify justify-center align-center px-5 px-md-10">
      <alert-comp />

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>

import AlertComp from '@/components/AlertComp.vue';

</script>
