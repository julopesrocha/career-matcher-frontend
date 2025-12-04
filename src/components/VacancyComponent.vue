<template>
  <div>
    <v-card class="vacancy-card" rounded="xl" elevation="3" hover @click="openDetails">
      <div class="card-header">
        <v-card-title class="text-wrap card-title">
          {{ props.vacancy.cargo }}
        </v-card-title>
        <v-card-subtitle class="card-subtitle">
          <v-icon size="small" class="mr-1">mdi-domain</v-icon>
          {{ props.vacancy.empresa }}
        </v-card-subtitle>
      </div>

      <v-card-text class="d-flex flex-wrap gap-2 pb-2">
        <v-chip
          size="small"
          prepend-icon="mdi-briefcase-variant"
          variant="flat"
          color="deep-purple-lighten-1"
          class="chip-info"
        >
          {{ props.vacancy.senioridade }}
        </v-chip>
        <v-chip
          size="small"
          prepend-icon="mdi-laptop"
          variant="flat"
          color="blue-lighten-1"
          class="chip-info"
        >
          {{ props.vacancy.modalidade }}
        </v-chip>
        <v-chip
          size="small"
          prepend-icon="mdi-map-marker"
          variant="flat"
          color="teal-lighten-1"
          class="chip-info"
        >
          {{ props.vacancy.cidade }}
        </v-chip>
      </v-card-text>

      <v-divider class="mx-4 my-2" />

      <v-card-text class="pt-2">
        <div class="section-label mb-2">
          <v-icon size="small" class="mr-1">mdi-code-tags</v-icon>
          Competências Requeridas
        </div>
        <div class="competencias-container">
          <v-chip
            v-for="(comp, index) in props.vacancy.competencias"
            :key="index"
            size="small"
            variant="outlined"
            color="indigo-darken-1"
            class="mr-1 mb-1 chip-skill"
          >
            {{ comp }}
          </v-chip>
          <span v-if="props.vacancy.competencias.length === 0" class="text-grey-darken-1 text-caption">
            Nenhuma competência especificada
          </span>
        </div>
      </v-card-text>

      <v-divider class="mx-4 my-2" />

      <v-card-text class="d-flex align-center justify-space-between candidate-section">
        <div class="section-label">
          <v-icon size="small" class="mr-1">mdi-account-check</v-icon>
          Melhor Candidato
        </div>
        <UserComponent
          :candidate-name="props.vacancy.candidato"
          :candidate-id="props.vacancy.candidatoId"
          :candidate-data="{
            ...props.vacancy.fullData.properties.candidatoEscolhido,
            relationshipsCandidato: props.vacancy.fullData.properties.relationshipsCandidato
          }"
        />
      </v-card-text>
    </v-card>

    <VacancyDetailsDialog
      v-model="showDialog"
      :vacancy-data="props.vacancy.fullData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VacancyCard } from '@/types/vacancy.types'
import UserComponent from './UserComponent.vue'
import VacancyDetailsDialog from './VacancyDetailsDialog.vue'

const props = defineProps<{
  vacancy: VacancyCard
}>()

const showDialog = ref(false)

const openDetails = () => {
  showDialog.value = true
}
</script>

<style scoped>
.vacancy-card {
  max-width: 340px;
  min-height: 420px;
  height: 420px;
  margin: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.vacancy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(103, 58, 183, 0.15) !important;
}

.card-header {
  padding: 16px 16px 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px 24px 0 0;
}

.card-title {
  color: white !important;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: normal;
  word-wrap: break-word;
  margin-bottom: 4px;
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #5e35b1;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chip-info {
  font-weight: 500;
  color: white !important;
}

.chip-skill {
  font-weight: 500;
  border-width: 1.5px;
}

.competencias-container {
  min-height: 60px;
  max-height: 100px;
  overflow-y: auto;
}

.competencias-container::-webkit-scrollbar {
  width: 6px;
}

.competencias-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.competencias-container::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 10px;
}

.competencias-container::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}

.candidate-section {
  padding-top: 8px !important;
  padding-bottom: 12px !important;
  gap: 8px;
}

.gap-2 {
  gap: 8px;
}
</style>
