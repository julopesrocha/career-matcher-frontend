<template>
  <v-card class="ma-1 px-2 pt-2" rounded="lg" max-width="340" elevation="2">
    <v-card-title class="text-wrap"> {{ props.vacancy.cargo }} </v-card-title>
    <v-card-subtitle>{{ props.vacancy.empresa }}</v-card-subtitle>
    
    <v-card-text class="d-flex flex-wrap">
      <v-chip
        size="small"
        prepend-icon="mdi-briefcase-variant"
        variant="tonal"
        color="green darken-6"
        class="mr-1 mb-1"
      >
        {{ props.vacancy.senioridade }}
      </v-chip>
      <v-chip
        size="small"
        prepend-icon="mdi-laptop"
        color="green darken-6"
        class="mr-1 mb-1"
      >
        {{ props.vacancy.modalidade }}
      </v-chip>
      <v-chip
        size="small"
        prepend-icon="mdi-map-marker"
        color="green darken-6"
        class="mr-1 mb-1"
      >
        {{ props.vacancy.cidade }}
      </v-chip>
    </v-card-text>

    <v-card-subtitle>Competências Requeridas</v-card-subtitle>
    <v-card-text class="custom-competencias-height">
      <v-chip
        v-for="(comp, index) in props.vacancy.competencias"
        :key="index"
        size="small"
        color="blue-grey"
        variant="outlined"
        class="mr-1 mb-1"
      >
        {{ comp }}
      </v-chip>
      <span v-if="props.vacancy.competencias.length === 0" class="text-grey">
        Nenhuma competência especificada
      </span>
    </v-card-text>

    <v-divider class="mx-4" />
    
    <v-row align="center" justify="space-between" class="py-1">
      <v-col>
        <v-card-subtitle>Melhor Candidato</v-card-subtitle>
      </v-col>
      <v-col align-self="end">
        <v-chip
          v-if="props.vacancy.candidato"
          class="ma-2"
          color="indigo"
          prepend-icon="mdi-account-circle"
        >
          {{ props.vacancy.candidato }}
        </v-chip>
        <v-chip
          v-else
          class="ma-2"
          color="grey"
          prepend-icon="mdi-account-off"
          variant="outlined"
        >
          Nenhum candidato
        </v-chip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { VacancyCard } from '@/types/vacancy.types'

const props = defineProps<{
  vacancy: VacancyCard
}>()
</script>

<style scoped>
.custom-competencias-height {
  min-height: 60px;
  max-height: 100px;
  overflow-y: auto;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
}
</style>
