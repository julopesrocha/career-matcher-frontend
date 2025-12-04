<template>
  <div class="search-container">
    <!-- Botão compacto para abrir o filtro -->
    <v-btn
      color="deep-purple"
      variant="elevated"
      rounded="lg"
      size="large"
      @click="openDialog"
      class="filter-trigger-btn"
      prepend-icon="mdi-filter-variant"
    >
      <span class="btn-text">Filtrar Vagas</span>
      <v-badge
        v-if="totalActiveFilters > 0"
        :content="totalActiveFilters"
        color="transparent"
        inline
        class="ml-2 custom-badge"
      />
    </v-btn>

    <!-- Dialog com o filtro completo -->
    <v-dialog v-model="dialogOpen" max-width="900" scrollable>
      <v-card rounded="xl" class="filter-dialog-card">
        <div class="card-gradient-header">
          <div class="header-content">
            <div class="header-icon-wrapper">
              <v-icon color="white" size="32">mdi-filter-variant</v-icon>
            </div>
            <h2 class="header-title">Filtrar Vagas</h2>
            <span class="header-separator">—</span>
            <p class="header-subtitle">Refine sua busca por critérios específicos</p>
          </div>
          <v-btn
            icon
            variant="text"
            @click="closeDialog"
            class="close-btn"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="pa-6">
        <!-- Campos de busca por texto -->
        <div class="search-fields mb-6">
          <div class="search-field-group">
            <div class="field-header">
              <v-icon size="18" color="indigo" class="mr-2">mdi-briefcase</v-icon>
              <span class="field-label">Cargo</span>
            </div>
            <v-text-field
              v-model="cargoSearch"
              placeholder="Ex: Desenvolvedor, Analista, Engenheiro..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              class="search-input"
            />
          </div>

          <div class="search-field-group">
            <div class="field-header">
              <v-icon size="18" color="purple" class="mr-2">mdi-domain</v-icon>
              <span class="field-label">Empresa</span>
            </div>
            <v-text-field
              v-model="empresaSearch"
              placeholder="Ex: Google, Amazon, Microsoft..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              class="search-input"
            />
          </div>

          <div class="search-field-group">
            <div class="field-header">
              <v-icon size="18" color="orange" class="mr-2">mdi-map-marker</v-icon>
              <span class="field-label">Cidade</span>
            </div>
            <v-text-field
              v-model="cidadeSearch"
              placeholder="Ex: São Paulo, Rio de Janeiro..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              class="search-input"
            />
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Categorias com chips -->
        <div class="filter-categories mb-4">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-section"
          >
            <div class="category-header">
              <v-icon size="18" :color="category.color" class="mr-2">{{ category.icon }}</v-icon>
              <span class="category-label">{{ category.name }}</span>
            </div>
            <div class="category-chips">
              <v-chip
                v-for="item in category.items"
                :key="item.value"
                :color="isSelected(item.value) ? category.color : 'grey-lighten-2'"
                :variant="isSelected(item.value) ? 'flat' : 'outlined'"
                size="small"
                class="filter-option-chip"
                @click="toggleFilter(item.value)"
              >
                <v-icon start size="16">{{ getFilterIcon(item.value) }}</v-icon>
                {{ item.title }}
                <v-icon
                  v-if="isSelected(item.value)"
                  end
                  size="16"
                  class="ml-1"
                >
                  mdi-check-circle
                </v-icon>
              </v-chip>
            </div>
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="action-bar">
          <div class="selected-count">
            <v-icon
              :color="totalActiveFilters > 0 ? 'deep-purple' : 'grey'"
              size="20"
              class="mr-2"
            >
              mdi-filter-check
            </v-icon>
            <span :class="totalActiveFilters > 0 ? 'count-active' : 'count-inactive'">
              {{ totalActiveFilters }} {{ totalActiveFilters === 1 ? 'filtro selecionado' : 'filtros selecionados' }}
            </span>
          </div>
          <div class="action-buttons">
            <v-btn
              v-if="totalActiveFilters > 0"
              color="error"
              variant="elevated"
              rounded="lg"
              @click="clearFilters"
              prepend-icon="mdi-close-circle"
              class="clear-btn"
            >
              Limpar Filtros
            </v-btn>
            <v-btn
              :disabled="!hasAnyFilter"
              color="deep-purple"
              variant="elevated"
              rounded="lg"
              @click="applyFilters"
              class="apply-btn"
              prepend-icon="mdi-check-bold"
            >
              Aplicar Filtros
            </v-btn>
          </div>
        </div>

        <v-expand-transition>
          <div v-if="totalActiveFilters > 0" class="mt-4">
            <div class="active-filters">
              <div class="active-filters-header">
                <v-icon size="16" color="deep-purple" class="mr-2">mdi-filter</v-icon>
                <span class="active-filters-title">Filtros Ativos</span>
              </div>
              <div class="active-chips-container">
                <!-- Chips de senioridade e modalidade -->
                <v-chip
                  v-for="filter in selectedFilters"
                  :key="filter"
                  size="small"
                  color="deep-purple"
                  variant="tonal"
                  closable
                  @click:close="removeFilter(filter)"
                  class="active-filter-chip"
                >
                  <v-icon start size="14">{{ getFilterIcon(filter) }}</v-icon>
                  {{ getFilterLabel(filter) }}
                </v-chip>
                
                <!-- Chip de cargo -->
                <v-chip
                  v-if="cargoSearch.trim()"
                  size="small"
                  color="deep-purple"
                  variant="tonal"
                  closable
                  @click:close="cargoSearch = ''"
                  class="active-filter-chip"
                >
                  <v-icon start size="14">mdi-briefcase</v-icon>
                  Cargo: {{ cargoSearch }}
                </v-chip>
                
                <!-- Chip de empresa -->
                <v-chip
                  v-if="empresaSearch.trim()"
                  size="small"
                  color="deep-purple"
                  variant="tonal"
                  closable
                  @click:close="empresaSearch = ''"
                  class="active-filter-chip"
                >
                  <v-icon start size="14">mdi-domain</v-icon>
                  Empresa: {{ empresaSearch }}
                </v-chip>
                
                <!-- Chip de cidade -->
                <v-chip
                  v-if="cidadeSearch.trim()"
                  size="small"
                  color="deep-purple"
                  variant="tonal"
                  closable
                  @click:close="cidadeSearch = ''"
                  class="active-filter-chip"
                >
                  <v-icon start size="14">mdi-map-marker</v-icon>
                  Cidade: {{ cidadeSearch }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FilterData {
  senioridade: string[]
  modalidade: string[]
  cargo?: string
  empresa?: string
  cidade?: string
}

const emit = defineEmits<{
  (e: 'filter-change', filters: FilterData): void
}>()

const selectedFilters = ref<string[]>([])
const dialogOpen = ref(false)

const initialFiltersState = ref<{
  chips: string[]
  cargo: string
  empresa: string
  cidade: string
} | null>(null)

const openDialog = () => {
  initialFiltersState.value = {
    chips: [...selectedFilters.value],
    cargo: cargoSearch.value,
    empresa: empresaSearch.value,
    cidade: cidadeSearch.value,
  }
  dialogOpen.value = true
}

const closeDialog = () => {
  const hasChanges = 
    JSON.stringify(selectedFilters.value) !== JSON.stringify(initialFiltersState.value?.chips) ||
    cargoSearch.value !== initialFiltersState.value?.cargo ||
    empresaSearch.value !== initialFiltersState.value?.empresa ||
    cidadeSearch.value !== initialFiltersState.value?.cidade

  if (hasChanges) {
    applyFilters()
  }
  
  dialogOpen.value = false
  initialFiltersState.value = null
}

interface FilterItem {
  title: string
  value: string
}

interface FilterCategory {
  name: string
  icon: string
  color: string
  items: FilterItem[]
}

const categories: FilterCategory[] = [
  {
    name: 'Nível de Senioridade',
    icon: 'mdi-chart-line',
    color: 'blue',
    items: [
      { title: 'Estagiário', value: 'estagiario' },
      { title: 'Trainee', value: 'trainee' },
      { title: 'Júnior', value: 'junior' },
      { title: 'Pleno', value: 'pleno' },
      { title: 'Sênior', value: 'senior' },
      { title: 'Gestor', value: 'gestor' },
      { title: 'Gerente', value: 'gerente' },
      { title: 'Arquiteto', value: 'arquiteto' },
      { title: 'Especialista', value: 'especialista' },
    ],
  },
  {
    name: 'Modalidade de Trabalho',
    icon: 'mdi-map-marker',
    color: 'teal',
    items: [
      { title: 'Remoto', value: 'remoto' },
      { title: 'Presencial', value: 'presencial' },
      { title: 'Híbrido', value: 'hibrido' },
    ],
  },
]

const cargoSearch = ref('')
const empresaSearch = ref('')
const cidadeSearch = ref('')

const totalActiveFilters = computed(() => {
  let count = selectedFilters.value.length
  if (cargoSearch.value.trim()) count++
  if (empresaSearch.value.trim()) count++
  if (cidadeSearch.value.trim()) count++
  return count
})

const hasAnyFilter = computed(() => {
  return totalActiveFilters.value > 0
})

const filterItems = [
  { title: 'Estagiário', value: 'estagiario' },
  { title: 'Trainee', value: 'trainee' },
  { title: 'Júnior', value: 'junior' },
  { title: 'Pleno', value: 'pleno' },
  { title: 'Sênior', value: 'senior' },
  { title: 'Gestor', value: 'gestor' },
  { title: 'Gerente', value: 'gerente' },
  { title: 'Arquiteto', value: 'arquiteto' },
  { title: 'Especialista', value: 'especialista' },
  { title: 'Remoto', value: 'remoto' },
  { title: 'Presencial', value: 'presencial' },
  { title: 'Híbrido', value: 'hibrido' },
]

const getFilterIcon = (value: string): string => {
  const iconMap: Record<string, string> = {
    estagiario: 'mdi-school',
    trainee: 'mdi-account-school',
    junior: 'mdi-star-outline',
    pleno: 'mdi-star-half-full',
    senior: 'mdi-star',
    gestor: 'mdi-account-tie',
    gerente: 'mdi-briefcase-account',
    arquiteto: 'mdi-draw',
    especialista: 'mdi-medal',
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

const isSelected = (value: string): boolean => {
  return selectedFilters.value.includes(value)
}

const toggleFilter = (value: string) => {
  if (isSelected(value)) {
    removeFilter(value)
  } else {
    selectedFilters.value.push(value)
  }
}

const removeFilter = (value: string) => {
  selectedFilters.value = selectedFilters.value.filter((f) => f !== value)
}

const clearFilters = () => {
  selectedFilters.value = []
  cargoSearch.value = ''
  empresaSearch.value = ''
  cidadeSearch.value = ''

  emit('filter-change', {
    senioridade: [],
    modalidade: [],
    cargo: undefined,
    empresa: undefined,
    cidade: undefined,
  })
  
  dialogOpen.value = false
  initialFiltersState.value = null
}

const applyFilters = () => {
  const senioridadeValues = ['estagiario', 'trainee', 'junior', 'pleno', 'senior', 'gestor', 'gerente', 'arquiteto', 'especialista']
  const modalidadeValues = ['remoto', 'presencial', 'hibrido']
  
  const senioridade = selectedFilters.value.filter(f => senioridadeValues.includes(f))
  const modalidade = selectedFilters.value.filter(f => modalidadeValues.includes(f))

  const filterData: FilterData = {
    senioridade,
    modalidade,
    cargo: cargoSearch.value.trim() || undefined,
    empresa: empresaSearch.value.trim() || undefined,
    cidade: cidadeSearch.value.trim() || undefined,
  }

  emit('filter-change', filterData)
  console.log('Aplicando filtros:', filterData)
  dialogOpen.value = false
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.filter-trigger-btn {
  height: 56px !important;
  padding: 0 32px !important;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(103, 58, 183, 0.3) !important;
  transition: all 0.3s ease;
  text-transform: none;
}

.filter-trigger-btn:hover {
  box-shadow: 0 6px 24px rgba(103, 58, 183, 0.45) !important;
  transform: translateY(-2px);
}

.btn-text {
  font-size: 1rem;
  font-weight: 700;
}

.custom-badge :deep(.v-badge__badge) {
  border: 2px solid white !important;
  color: white !important;
  font-weight: 700;
  background-color: transparent !important;
}

.filter-dialog-card {
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  overflow: hidden;
}

.card-gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

.card-gradient-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.header-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
}

.header-separator {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0 4px;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.875rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.2px;
  line-height: 1;
}

.filter-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section {
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.category-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #424242;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-option-chip {
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border-width: 2px;
}

.filter-option-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.selected-count {
  display: flex;
  align-items: center;
}

.count-active {
  font-size: 0.95rem;
  font-weight: 600;
  color: #5e35b1;
}

.count-inactive {
  font-size: 0.95rem;
  font-weight: 500;
  color: #9e9e9e;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.clear-btn {
  min-width: 160px;
  height: 44px !important;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.45) !important;
  transform: translateY(-2px);
}

.apply-btn {
  min-width: 160px;
  height: 44px !important;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3) !important;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.45) !important;
  transform: translateY(-2px);
}

.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.active-filters {
  padding: 20px;
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.06) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(103, 58, 183, 0.15);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.active-filters-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.active-filters-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #5e35b1;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.active-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.active-filter-chip {
  font-weight: 600;
  transition: all 0.2s ease;
  animation: chipPopIn 0.3s ease;
}

.active-filter-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(103, 58, 183, 0.25);
}

@keyframes chipPopIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.search-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-header {
  display: flex;
  align-items: center;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #424242;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.search-input :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(103, 58, 183, 0.15);
}

.search-input :deep(.v-field--focused) {
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.25);
  border-color: #5e35b1 !important;
}

.search-input :deep(.v-field__input) {
  font-size: 0.9rem;
  color: #424242;
}

.search-input :deep(.v-field__input::placeholder) {
  color: #9e9e9e;
  opacity: 1;
}

@media (max-width: 960px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .apply-btn {
    flex: 1;
  }
}

@media (max-width: 960px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-separator {
    display: none;
  }

  .header-subtitle {
    width: 100%;
    margin-top: 8px;
    margin-left: 72px;
  }
}

@media (max-width: 600px) {
  .card-gradient-header {
    padding: 20px 20px;
  }

  .header-content {
    gap: 12px;
    flex-wrap: wrap;
  }

  .header-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  .header-icon-wrapper .v-icon {
    font-size: 28px !important;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .header-separator {
    display: none;
  }

  .header-subtitle {
    font-size: 0.8rem;
    width: 100%;
    margin-left: 60px;
    margin-top: 4px;
  }

  .search-card {
    margin: 0 8px;
  }

  .category-chips {
    gap: 8px;
  }

  .filter-option-chip {
    font-size: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .clear-btn,
  .apply-btn {
    width: 100%;
    min-width: auto;
  }
}
</style>
