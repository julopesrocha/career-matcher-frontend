<script setup lang="ts">
import VacancyComponent from './VacancyComponent.vue'
</script>

<template>
  <v-toolbar extended color="deep-purple accent-4" dark>
    <v-toolbar-title text="Career Matcher"></v-toolbar-title>

    <template v-slot:extension>
      <v-tabs>
        <v-tab text="Vagas"> </v-tab>
      </v-tabs>
    </template>
  </v-toolbar>
  <VacancyComponent />
</template>
