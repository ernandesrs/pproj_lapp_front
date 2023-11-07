<template>
  <v-app>
    <v-app-bar flat>
      <v-app-bar-title>
        <v-btn color="success"
          @click="() => { alertStore.addMessage('Uma mensagem de sucesso qualquer.', 'Título de sucesso', 'success') }">Success
          alert</v-btn>

        <v-btn color="danger"
          @click="() => { alertStore.addMessage('Uma mensagem de perigo qualquer.', 'Título de perigo', 'danger') }">Danger
          alert</v-btn>

        <v-btn color="info"
          @click="() => { alertStore.addMessage('Uma mensagem de informação qualquer.', 'Título de informação', 'info') }">Info
          alert</v-btn>

        <v-btn color="warning"
          @click="() => { alertStore.addMessage('Uma mensagem de alert qualquer.', 'Título de alerta', 'warning') }">Warning
          alert</v-btn>

      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <alert-comp />

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>

import AlertComp from '@/components/AlertComp.vue';
import { useAlertStore } from '@/store/alert';

const alertStore = useAlertStore();

</script>
