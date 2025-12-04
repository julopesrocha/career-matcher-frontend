<template>
  <div class="dashboard-wrapper">
    <ToolbarComponent @filter-change="handleFilterChange" />

    <div class="dashboard-content">
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
            {{ hasActiveFilters ? 'mdi-filter-off' : 'mdi-briefcase-off' }}
          </v-icon>
          <p class="mt-4 text-h5 text-grey-darken-1">
            {{ hasActiveFilters ? 'Nenhuma vaga corresponde aos filtros' : 'Nenhuma vaga encontrada' }}
          </p>
          <p class="text-body-2 text-grey">
            {{ hasActiveFilters ? 'Tente remover alguns filtros para ver mais resultados' : 'Tente ajustar seus filtros de busca' }}
          </p>
          <v-btn
            v-if="hasActiveFilters"
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
import type { Vaga } from '@/types/api.types'

interface FilterData {
  senioridade: string[]
  modalidade: string[]
  cargo?: string
  empresa?: string
  cidade?: string
}

const vacanciesPerpage = 8
const currentPage = ref(1)
const vacancies = ref<VacancyCard[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const activeFilters = ref<FilterData>({ senioridade: [], modalidade: [] })

const paginatedVacancies = computed(() => {
  const start = (currentPage.value - 1) * vacanciesPerpage
  const end = start + vacanciesPerpage
  return vacancies.value.slice(start, end)
})

const setPagination = () => {
  return Math.ceil(vacancies.value.length / vacanciesPerpage)
}

const hasActiveFilters = computed(() => {
  return (
    activeFilters.value.senioridade.length > 0 ||
    activeFilters.value.modalidade.length > 0 ||
    !!activeFilters.value.cargo ||
    !!activeFilters.value.empresa ||
    !!activeFilters.value.cidade
  )
})

const handleFilterChange = (filterData: FilterData) => {
  activeFilters.value = filterData
  currentPage.value = 1
  loadVacancies(filterData)
}

const clearFilters = () => {
  activeFilters.value = { senioridade: [], modalidade: [] }
  loadVacancies()
}

const loadVacancies = async (filterData: FilterData = { senioridade: [], modalidade: [] }) => {
  loading.value = true
  error.value = null

  try {
    const apiFilters: {
      senioridade?: string[]
      modalidade?: string[]
      cargo?: string[]
      empresa?: string
      cidade?: string
    } = {}

    if (filterData.senioridade.length > 0) {
      apiFilters.senioridade = filterData.senioridade
    }

    if (filterData.modalidade.length > 0) {
      apiFilters.modalidade = filterData.modalidade
    }

    // Cargo é enviado como array se existir
    if (filterData.cargo) {
      apiFilters.cargo = [filterData.cargo]
    }

    if (filterData.empresa) {
      apiFilters.empresa = filterData.empresa
    }

    if (filterData.cidade) {
      apiFilters.cidade = filterData.cidade
    }

    const hasFilters = Object.keys(apiFilters).length > 0
    const vagas = await (hasFilters ? apiService.getVagasWithFilters(apiFilters) : apiService.getVagas())

    vacancies.value = vagas.map((vacancy: Vaga) => vacancyToCard(vacancy))
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
