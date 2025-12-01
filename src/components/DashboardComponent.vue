<template>
  <ToolbarComponent />

  <!-- Loading State -->
  <v-row v-if="loading" dense class="ma-3 pa-4" justify="center">
    <v-col cols="12" class="text-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">Carregando vagas...</p>
    </v-col>
  </v-row>

  <!-- Error State -->
  <v-row v-else-if="error" dense class="ma-3 pa-4" justify="center">
    <v-col cols="12" md="6">
      <v-alert type="error" variant="tonal" closable>
        <v-alert-title>Erro ao carregar vagas</v-alert-title>
        {{ error }}
      </v-alert>
      <div class="text-center mt-4">
        <v-btn color="primary" @click="loadVacancies">Tentar Novamente</v-btn>
      </div>
    </v-col>
  </v-row>

  <!-- Empty State -->
  <v-row v-else-if="vacancies.length === 0" dense class="ma-3 pa-4" justify="center">
    <v-col cols="12" class="text-center">
      <v-icon size="64" color="grey">mdi-briefcase-off</v-icon>
      <p class="mt-4 text-h6">Nenhuma vaga encontrada</p>
    </v-col>
  </v-row>

  <!-- Vacancies Grid -->
  <v-row v-else dense class="ma-3 pa-4">
    <v-col cols="12" md="3" v-for="v in paginatedVacancies" :key="v.id">
      <VacancyComponent :vacancy="v" />
    </v-col>
  </v-row>

  <!-- Pagination -->
  <v-pagination
    v-if="!loading && !error && vacancies.length > 0"
    v-model="currentPage"
    :length="setPagination()"
  ></v-pagination>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ToolbarComponent from './ToolbarComponent.vue'
import VacancyComponent from './VacancyComponent.vue'
import { apiService } from '@/services/api'
import { vacancyToCard, calculateCompatibility, type VacancyCard } from '@/types/vacancy.types'
import type { Vaga, Candidato } from '@/types/api.types'

const vacanciesPerpage = 8
const currentPage = ref(1)
const vacancies = ref<VacancyCard[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const paginatedVacancies = computed(() => {
  const start = (currentPage.value - 1) * vacanciesPerpage
  const end = start + vacanciesPerpage
  return vacancies.value.slice(start, end)
})

const setPagination = () => {
  return Math.ceil(vacancies.value.length / vacanciesPerpage)
}

const loadVacancies = async () => {
  loading.value = true
  error.value = null

  try {
    // Buscar vagas e candidatos em paralelo
    const [vagas, candidatos] = await Promise.all([
      apiService.getVagas(),
      apiService.getCandidatos(),
    ])

    // Para cada vaga, encontrar o melhor candidato
    const vacanciesWithCandidates: VacancyCard[] = vagas.map((vacancy: Vaga) => {
      if (candidatos.length === 0) {
        return vacancyToCard(vacancy)
      }

      const candidatesWithScore = candidatos.map((candidate: Candidato) => ({
        candidate,
        score: calculateCompatibility(vacancy, candidate),
      }))

      candidatesWithScore.sort((a, b) => b.score - a.score)

      const bestMatch = candidatesWithScore[0]

      return bestMatch ? vacancyToCard(vacancy, bestMatch.candidate) : vacancyToCard(vacancy)
    })

    vacancies.value = vacanciesWithCandidates
  } catch (err) {
    console.error('Erro ao carregar vagas:', err)
    error.value =
      err instanceof Error
        ? err.message
        : 'Não foi possível carregar as vagas. Verifique se o backend está rodando em http://localhost:8081'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadVacancies()
})
</script>

<style scoped></style>
