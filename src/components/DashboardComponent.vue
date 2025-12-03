<template>
  <div class="dashboard-wrapper">
    <ToolbarComponent @filter-change="handleFilterChange" />

    <div class="dashboard-content">
      <!-- Active Filters Display -->
      <div v-if="activeFilters.length > 0" class="active-filters-banner mb-4">
        <v-icon size="small" class="mr-2">mdi-filter-check</v-icon>
        <span class="filter-text">Filtrando por: {{ activeFilters.length }} critério(s)</span>
        <v-btn
          size="x-small"
          variant="text"
          color="deep-purple"
          @click="clearFilters"
          class="ml-2"
        >
          Remover filtros
        </v-btn>
      </div>

      <!-- Loading State -->
      <v-row v-if="loading" dense class="loading-state" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="deep-purple" size="64"></v-progress-circular>
          <p class="mt-4 text-h6 text-grey-darken-1">Carregando vagas...</p>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="error" dense class="error-state" justify="center">
        <v-col cols="12" md="6">
          <v-alert type="error" variant="tonal" prominent rounded="lg">
            <v-alert-title class="mb-2">Erro ao carregar vagas</v-alert-title>
            {{ error }}
          </v-alert>
          <div class="text-center mt-4">
            <v-btn
              color="deep-purple"
              variant="elevated"
              size="large"
              prepend-icon="mdi-refresh"
              @click="loadVacancies"
            >
              Tentar Novamente
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else-if="vacancies.length === 0" dense class="empty-state" justify="center">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="grey-lighten-1">
            {{ activeFilters.length > 0 ? 'mdi-filter-off' : 'mdi-briefcase-off' }}
          </v-icon>
          <p class="mt-4 text-h5 text-grey-darken-1">
            {{ activeFilters.length > 0 ? 'Nenhuma vaga corresponde aos filtros' : 'Nenhuma vaga encontrada' }}
          </p>
          <p class="text-body-2 text-grey">
            {{ activeFilters.length > 0 ? 'Tente remover alguns filtros para ver mais resultados' : 'Tente ajustar seus filtros de busca' }}
          </p>
          <v-btn
            v-if="activeFilters.length > 0"
            color="deep-purple"
            variant="elevated"
            class="mt-4"
            @click="clearFilters"
          >
            <v-icon start>mdi-filter-remove</v-icon>
            Limpar Filtros
          </v-btn>
        </v-col>
      </v-row>

      <!-- Vacancies Grid -->
      <v-row v-else dense class="vacancies-grid">
        <v-col cols="12" sm="6" md="4" lg="3" v-for="v in paginatedVacancies" :key="v.id">
          <VacancyComponent :vacancy="v" />
        </v-col>
      </v-row>

      <!-- Pagination -->
      <div v-if="!loading && !error && vacancies.length > 0" class="pagination-wrapper">
        <v-pagination
          v-model="currentPage"
          :length="setPagination()"
          :total-visible="7"
          rounded="circle"
          color="deep-purple"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ToolbarComponent from './ToolbarComponent.vue'
import VacancyComponent from './VacancyComponent.vue'
import { apiService } from '@/services/api'
import { vacancyToCard, type VacancyCard } from '@/types/vacancy.types'
import type { Vaga, Candidato } from '@/types/api.types'

const vacanciesPerpage = 8
const currentPage = ref(1)
const vacancies = ref<VacancyCard[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const activeFilters = ref<string[]>([])

const paginatedVacancies = computed(() => {
  const start = (currentPage.value - 1) * vacanciesPerpage
  const end = start + vacanciesPerpage
  return vacancies.value.slice(start, end)
})

const setPagination = () => {
  return Math.ceil(vacancies.value.length / vacanciesPerpage)
}

const handleFilterChange = (filters: string[]) => {
  activeFilters.value = filters
  currentPage.value = 1 // Reset para primeira página ao filtrar
  loadVacancies(filters)
}

const clearFilters = () => {
  activeFilters.value = []
  loadVacancies()
}

const loadVacancies = async (filters: string[] = []) => {
  loading.value = true
  error.value = null

  try {
    // TODO: Quando o backend estiver pronto, passar os filtros aqui
    // const [vagas, candidatos] = await Promise.all([
    //   apiService.getVagas(filters),
    //   apiService.getCandidatos(),
    // ])
    
    const [vagas, candidatos] = await Promise.all([
      apiService.getVagas(),
      apiService.getCandidatos(),
    ])

    const candidatosMap = new Map(candidatos.map((c: Candidato) => [c.id, c]))

    const vacanciesWithCandidates: VacancyCard[] = vagas.map((vacancy: Vaga) => {
      if (!vacancy.idCandidatoEscolhido) {
        return vacancyToCard(vacancy)
      }

      const matchedCandidate = candidatosMap.get(vacancy.idCandidatoEscolhido)

      return matchedCandidate ? vacancyToCard(vacancy, matchedCandidate) : vacancyToCard(vacancy)
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

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
}

.dashboard-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 16px 48px;
}

.loading-state,
.error-state,
.empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  padding: 48px 16px;
}

.vacancies-grid {
  margin: 0 -8px;
}

.active-filters-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(103, 58, 183, 0.2);
  max-width: 600px;
  margin: 0 auto;
}

.filter-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5e35b1;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  margin-bottom: 24px;
}

@media (max-width: 960px) {
  .dashboard-content {
    padding: 24px 12px 36px;
  }
}

@media (max-width: 600px) {
  .dashboard-content {
    padding: 16px 8px 24px;
  }

  .pagination-wrapper {
    margin-top: 32px;
  }
}
</style>
