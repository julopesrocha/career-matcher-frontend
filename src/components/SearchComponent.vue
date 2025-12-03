<template>
  <div class="search-container">
    <v-card rounded="xl" elevation="8" class="search-card">
      <div class="card-gradient-header">
        <v-icon color="white" size="24" class="mr-2">mdi-filter-variant</v-icon>
        <span class="header-title">Filtrar Vagas</span>
      </div>

      <v-card-text class="pa-5">
        <div class="filter-input-wrapper">
          <v-select
            v-model="selectedFilters"
            :items="filterItems"
            label="Selecione os critérios de busca..."
            multiple
            clearable
            rounded="xl"
            hide-details
            variant="solo"
            color="deep-purple"
            class="custom-select"
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            bg-color="grey-lighten-5"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip
                v-if="index < 3"
                size="small"
                color="deep-purple"
                variant="flat"
                closable
                @click:close="removeFilter(item.value)"
                class="selection-chip"
              >
                <v-icon start size="14">{{ getFilterIcon(item.value) }}</v-icon>
                {{ item.title }}
              </v-chip>

              <span
                v-if="index === 3"
                class="overflow-text"
              >
                (+{{ selectedFilters.length - 3 }})
              </span>
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :prepend-icon="getFilterIcon(item.value)"
                class="filter-list-item"
              >
                <template v-slot:title>
                  <span class="filter-item-text">{{ item.title }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-btn
            v-if="selectedFilters.length > 0"
            color="deep-purple"
            variant="elevated"
            rounded="xl"
            size="large"
            @click="applyFilters"
            class="apply-btn"
          >
            <v-icon start>mdi-check-circle</v-icon>
            Aplicar Filtros
          </v-btn>
        </div>

        <v-expand-transition>
          <div v-if="selectedFilters.length > 0" class="mt-4">
            <v-divider class="mb-4" />
            <div class="filters-summary">
              <div class="summary-header">
                <v-icon size="18" color="deep-purple" class="mr-2">mdi-filter-check</v-icon>
                <span class="summary-label">Filtros Selecionados</span>
                <v-chip size="x-small" color="deep-purple" variant="flat" class="ml-2">
                  {{ selectedFilters.length }}
                </v-chip>
              </div>
              <div class="chips-container mt-3">
                <v-chip
                  v-for="filter in selectedFilters"
                  :key="filter"
                  size="small"
                  color="deep-purple"
                  variant="tonal"
                  closable
                  @click:close="removeFilter(filter)"
                  class="filter-chip"
                >
                  <v-icon start size="14">{{ getFilterIcon(filter) }}</v-icon>
                  {{ getFilterLabel(filter) }}
                </v-chip>
              </div>
              <div class="text-center mt-3">
                <v-btn
                  variant="text"
                  color="error"
                  size="small"
                  @click="clearFilters"
                  prepend-icon="mdi-close-circle"
                >
                  Limpar Todos os Filtros
                </v-btn>
              </div>
            </div>
          </div>
        </v-expand-transition>
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

const getFilterIcon = (value: string): string => {
  const iconMap: Record<string, string> = {
    frontend: 'mdi-monitor',
    backend: 'mdi-server',
    fullstack: 'mdi-layers-triple',
    senior: 'mdi-star',
    pleno: 'mdi-star-half-full',
    junior: 'mdi-star-outline',
    estagiario: 'mdi-school',
    remoto: 'mdi-home',
    presencial: 'mdi-office-building',
    hibrido: 'mdi-swap-horizontal',
  }
  return iconMap[value] || 'mdi-filter'
}

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
  max-width: 950px;
  margin: 0 auto;
}

.search-card {
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  border: 2px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(103, 58, 183, 0.2) !important;
}

.card-gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

.header-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.filter-input-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
}

.custom-select {
  flex: 1;
  font-weight: 500;
}

.custom-select :deep(.v-field) {
  border: 2px solid rgba(103, 58, 183, 0.2);
  transition: all 0.3s ease;
}

.custom-select :deep(.v-field:hover) {
  border-color: rgba(103, 58, 183, 0.4);
}

.custom-select :deep(.v-field--focused) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(103, 58, 183, 0.1);
}

.selection-chip {
  margin-right: 6px;
  font-weight: 600;
  animation: chipSlideIn 0.3s ease;
}

@keyframes chipSlideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.overflow-text {
  color: #5e35b1;
  font-weight: 600;
  font-size: 0.85rem;
  margin-left: 4px;
}

.filter-list-item {
  transition: all 0.2s ease;
}

.filter-list-item:hover {
  background: rgba(103, 58, 183, 0.08);
}

.filter-item-text {
  font-weight: 500;
  color: #424242;
}

.apply-btn {
  min-width: 160px;
  height: 56px !important;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3) !important;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4) !important;
  transform: translateY(-2px);
}

.filters-summary {
  padding: 20px;
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 16px;
  border: 2px dashed rgba(103, 58, 183, 0.2);
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #5e35b1;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  font-weight: 600;
  transition: all 0.2s ease;
  animation: chipFadeIn 0.4s ease;
}

.filter-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(103, 58, 183, 0.2);
}

@keyframes chipFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 960px) {
  .filter-input-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .apply-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .card-gradient-header {
    padding: 12px 16px;
  }

  .header-title {
    font-size: 0.95rem;
  }

  .search-card {
    margin: 0 8px;
  }
}
</style>
