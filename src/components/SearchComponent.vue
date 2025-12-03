<template>
  <div class="search-container">
    <v-card rounded="xl" elevation="4" class="search-card">
      <v-card-text class="pa-4">
        <div class="d-flex align-center gap-3">
          <v-icon color="deep-purple" size="28">mdi-filter-variant</v-icon>
          
          <v-select
            v-model="selectedFilters"
            :items="filterItems"
            label="Filtrar vagas por..."
            multiple
            clearable
            rounded="lg"
            hide-details
            variant="outlined"
            color="deep-purple"
            class="flex-grow-1"
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip
                v-if="index < 2"
                size="small"
                color="deep-purple"
                variant="flat"
                closable
                @click:close="removeFilter(item.value)"
                class="mr-1"
              >
                {{ item.title }}
              </v-chip>

              <span
                v-if="index === 2"
                class="text-grey-darken-1 text-caption align-self-center ml-1"
              >
                (+{{ selectedFilters.length - 2 }} mais)
              </span>
            </template>

            <template v-slot:chip="{ item }">
              <v-chip
                size="small"
                color="deep-purple"
                variant="flat"
              >
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>

          <v-btn
            v-if="selectedFilters.length > 0"
            color="deep-purple"
            variant="elevated"
            rounded="lg"
            size="large"
            @click="applyFilters"
            class="filter-btn"
          >
            <v-icon start>mdi-check</v-icon>
            Aplicar
          </v-btn>
        </div>

        <div v-if="selectedFilters.length > 0" class="mt-3">
          <div class="filters-summary">
            <span class="summary-label">Filtros ativos:</span>
            <v-chip
              v-for="filter in selectedFilters"
              :key="filter"
              size="small"
              color="deep-purple"
              variant="tonal"
              closable
              @click:close="removeFilter(filter)"
              class="mr-2 mb-1"
            >
              {{ getFilterLabel(filter) }}
            </v-chip>
            <v-btn
              variant="text"
              color="error"
              size="x-small"
              @click="clearFilters"
              class="ml-2"
            >
              Limpar todos
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'filter-change', filters: string[]): void
}>()

const selectedFilters = ref<string[]>([])

const filterItems = [
  { title: 'Frontend', value: 'frontend' },
  { title: 'Backend', value: 'backend' },
  { title: 'Full Stack', value: 'fullstack' },
  { title: 'Sênior', value: 'senior' },
  { title: 'Pleno', value: 'pleno' },
  { title: 'Júnior', value: 'junior' },
  { title: 'Estagiário', value: 'estagiario' },
  { title: 'Remoto', value: 'remoto' },
  { title: 'Presencial', value: 'presencial' },
  { title: 'Híbrido', value: 'hibrido' },
]

const getFilterLabel = (value: string): string => {
  const item = filterItems.find((i) => i.value === value)
  return item ? item.title : value
}

const removeFilter = (value: string) => {
  selectedFilters.value = selectedFilters.value.filter((f) => f !== value)
}

const clearFilters = () => {
  selectedFilters.value = []
  emit('filter-change', [])
}

const applyFilters = () => {
  emit('filter-change', selectedFilters.value)
  console.log('Aplicando filtros:', selectedFilters.value)
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.search-card {
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  border: 1px solid rgba(103, 58, 183, 0.1);
}

.gap-3 {
  gap: 12px;
}

.filter-btn {
  min-width: 120px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
}

.filters-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px;
  background: rgba(103, 58, 183, 0.05);
  border-radius: 12px;
}

.summary-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5e35b1;
  margin-right: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 960px) {
  .filter-btn {
    min-width: 100px;
  }
}

@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
    align-items: stretch !important;
  }

  .filter-btn {
    width: 100%;
  }
}
</style>
