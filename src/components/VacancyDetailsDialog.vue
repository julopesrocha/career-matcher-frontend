<template>
  <v-dialog v-model="isOpen" max-width="700" scrollable>
    <v-card rounded="xl">
      <div class="dialog-header">
        <v-card-title class="dialog-title">
          <v-icon class="mr-2">mdi-briefcase</v-icon>
          {{ vacancy.cargo }}
        </v-card-title>
        <v-btn icon variant="text" @click="closeDialog" class="close-btn">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="dialog-content pa-6">
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="deep-purple" size="48"></v-progress-circular>
          <p class="mt-4 text-grey-darken-1">Carregando detalhes...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <v-icon size="48" color="error">mdi-alert-circle</v-icon>
          <p class="mt-4 text-error">{{ error }}</p>
          <v-btn color="deep-purple" variant="elevated" class="mt-4" @click="loadVacancyDetails">
            Tentar Novamente
          </v-btn>
        </div>

        <div v-else-if="vacancyDetails">
          <div class="info-section">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-domain</v-icon>
              Empresa
            </div>
            <p class="section-content">{{ vacancyDetails.empresa }}</p>
          </div>

          <v-divider class="my-4" />

          <div class="info-section">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
              Localização
            </div>
            <p class="section-content">{{ vacancyDetails.cidade }}</p>
          </div>

          <v-divider class="my-4" />

          <div class="info-section">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-briefcase-variant</v-icon>
              Informações da Vaga
            </div>
            <div class="chips-container mt-2">
              <v-chip size="small" color="deep-purple-lighten-1" variant="flat" class="mr-2 mb-2">
                <v-icon start>mdi-account-tie</v-icon>
                {{ seniorityDisplayMap[vacancyDetails.senioridade] || vacancyDetails.senioridade }}
              </v-chip>
              <v-chip size="small" color="blue-lighten-1" variant="flat" class="mr-2 mb-2">
                <v-icon start>mdi-laptop</v-icon>
                {{ modalityDisplayMap[vacancyDetails.modalidade] || vacancyDetails.modalidade }}
              </v-chip>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="info-section">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-code-tags</v-icon>
              Competências Requeridas
            </div>
            <div class="chips-container mt-2">
              <v-chip
                v-for="comp in vacancyDetails.competencias"
                :key="comp.id"
                size="small"
                variant="outlined"
                color="indigo-darken-1"
                class="mr-2 mb-2"
              >
                {{ comp.competencia.nome }}
                <v-chip size="x-small" color="indigo" class="ml-2" variant="flat">
                  {{ comp.peso }}/10
                </v-chip>
              </v-chip>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="info-section" v-if="vacancyDetails.graduacao && vacancyDetails.graduacao.length > 0">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-school</v-icon>
              Graduação Requerida
            </div>
            <div class="mt-2">
              <v-chip
                v-for="grad in vacancyDetails.graduacao"
                :key="grad.id"
                size="small"
                variant="tonal"
                color="green-darken-1"
                class="mr-2 mb-2"
              >
                {{ grad.curso }} - {{ grad.tipoGraduacao }}
              </v-chip>
            </div>
          </div>

          <v-divider class="my-4" v-if="vacancyDetails.graduacao && vacancyDetails.graduacao.length > 0" />

          <div class="info-section" v-if="vacancyDetails.experiencia">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-briefcase-clock</v-icon>
              Experiência Mínima
            </div>
            <p class="section-content">
              {{ vacancyDetails.experiencia.cargo }} -
              {{ Math.floor(vacancyDetails.experiencia.duracao_meses / 12) }} anos
              ({{ seniorityDisplayMap[vacancyDetails.experiencia.senioridade] }})
            </p>
          </div>

          <v-divider class="my-4" v-if="vacancyDetails.experiencia" />

          <div class="info-section" v-if="matchedCandidate">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-account-check</v-icon>
              Melhor Candidato (Matching)
            </div>
            <v-card class="mt-3 pa-4" variant="tonal" color="deep-purple-lighten-5">
              <div class="d-flex align-center">
                <v-avatar color="deep-purple" size="48" class="mr-3">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <p class="candidate-name-display mb-1">{{ matchedCandidate.nome }}</p>
                  <p class="candidate-info-display">
                    {{ matchedCandidate.cargo }} - {{ matchedCandidate.cidade }}
                  </p>
                  <p class="candidate-info-display">
                    {{ matchedCandidate.email }}
                  </p>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="deep-purple" variant="elevated" @click="closeDialog">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { apiService } from '@/services/api'
import type { Vaga, Candidato } from '@/types/api.types'
import { Senioridade, Modalidade } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  vacancyId: number
  vacancy: {
    cargo: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = ref(props.modelValue)
const loading = ref(false)
const error = ref<string | null>(null)
const vacancyDetails = ref<Vaga | null>(null)
const matchedCandidate = ref<Candidato | null>(null)

const seniorityDisplayMap: Record<Senioridade, string> = {
  [Senioridade.ESTAGIARIO]: 'Estagiário',
  [Senioridade.TRAINEE]: 'Trainee',
  [Senioridade.JUNIOR]: 'Júnior',
  [Senioridade.PLENO]: 'Pleno',
  [Senioridade.SENIOR]: 'Sênior',
  [Senioridade.GESTOR]: 'Gestor',
  [Senioridade.GERENTE]: 'Gerente',
  [Senioridade.ARQUITETO]: 'Arquiteto',
  [Senioridade.ESPECIALISTA]: 'Especialista',
}

const modalityDisplayMap: Record<Modalidade, string> = {
  [Modalidade.PRESENCIAL]: 'Presencial',
  [Modalidade.REMOTO]: 'Remoto',
  [Modalidade.HIBRIDO]: 'Híbrido',
}

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal
    if (newVal) {
      loadVacancyDetails()
    }
  }
)

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const closeDialog = () => {
  isOpen.value = false
}

const loadVacancyDetails = async () => {
  loading.value = true
  error.value = null

  try {
    // Busca apenas a vaga específica por ID
    const vacancy = await apiService.getVagaById(props.vacancyId)

    vacancyDetails.value = vacancy

    // Se a vaga tem um candidato escolhido, busca apenas esse candidato
    if (vacancy.idCandidatoEscolhido) {
      try {
        const candidate = await apiService.getCandidatoById(vacancy.idCandidatoEscolhido)
        matchedCandidate.value = candidate
      } catch (err) {
        console.error('Erro ao buscar candidato:', err)
        // Não mostra erro se não conseguir buscar o candidato, apenas não exibe
        matchedCandidate.value = null
      }
    }
  } catch (err) {
    console.error('Erro ao carregar detalhes da vaga:', err)
    error.value = 'Não foi possível carregar os detalhes da vaga'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px 24px 0 0;
}

.dialog-title {
  color: white !important;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.close-btn {
  color: white;
}

.dialog-content {
  max-height: 600px;
}

.info-section {
  margin-bottom: 8px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #5e35b1;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.section-content {
  font-size: 1rem;
  color: #424242;
  margin: 0;
  line-height: 1.6;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
}

.candidate-name-display {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
}

.candidate-info-display {
  font-size: 0.9rem;
  color: #424242;
  margin: 2px 0 0 0;
  line-height: 1.5;
}
</style>
