<template>
  <v-dialog v-model="isOpen" max-width="700" scrollable>
    <v-card rounded="xl">
      <div class="dialog-header">
        <v-card-title class="dialog-title">
          <v-icon class="mr-2">mdi-briefcase</v-icon>
          {{ vacancyData.properties.cargo }}
        </v-card-title>
        <v-btn icon variant="text" @click="closeDialog" class="close-btn">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="dialog-content pa-6">
        <div v-if="vacancyDetails">
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
            <div class="education-cards mt-2">
              <v-card
                v-for="grad in vacancyDetails.graduacao"
                :key="grad.id"
                variant="tonal"
                color="green-lighten-5"
                class="education-card mb-3"
              >
                <v-card-text class="pa-3">
                  <div class="education-item">
                    <v-icon size="20" color="green-darken-2" class="mr-2">mdi-school</v-icon>
                    <div class="education-details">
                      <p class="education-course">{{ grad.curso }}</p>
                      <p class="education-meta">
                        <span class="education-type">{{ grad.tipoGraduacao }}</span>
                        <span class="education-separator">•</span>
                        <span class="education-institution">{{ grad.instituicao }}</span>
                        <span v-if="grad.ano_conclusao" class="education-separator">•</span>
                        <span v-if="grad.ano_conclusao" class="education-year">{{ grad.ano_conclusao }}</span>
                      </p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
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
              {{ vacancyDetails.experiencia.duração_meses ? Math.floor(vacancyDetails.experiencia.duração_meses / 12) : 0 }} anos
              ({{ seniorityDisplayMap[vacancyDetails.experiencia.senioridade] }})
            </p>
          </div>

          <v-divider class="my-4" v-if="vacancyDetails.experiencia" />

          <!-- Mestrado -->
          <div class="info-section" v-if="vacancyDetails.mestrado">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-school</v-icon>
              Mestrado Requerido
            </div>
            <v-card variant="tonal" color="blue-lighten-5" class="education-card mt-2">
              <v-card-text class="pa-3">
                <div class="education-item">
                  <v-icon size="20" color="blue-darken-2" class="mr-2">mdi-school</v-icon>
                  <div class="education-details">
                    <p class="education-course">{{ vacancyDetails.mestrado.curso }}</p>
                    <p class="education-meta">
                      <span class="education-institution">{{ vacancyDetails.mestrado.instituicao }}</span>
                      <span v-if="vacancyDetails.mestrado.subarea" class="education-separator">•</span>
                      <span v-if="vacancyDetails.mestrado.subarea" class="education-subarea">{{ vacancyDetails.mestrado.subarea }}</span>
                      <span v-if="vacancyDetails.mestrado.ano_conclusao" class="education-separator">•</span>
                      <span v-if="vacancyDetails.mestrado.ano_conclusao" class="education-year">{{ vacancyDetails.mestrado.ano_conclusao }}</span>
                    </p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-divider class="my-4" v-if="vacancyDetails.mestrado" />

          <!-- Doutorado -->
          <div class="info-section" v-if="vacancyDetails.doutorado">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-school</v-icon>
              Doutorado Requerido
            </div>
            <v-card variant="tonal" color="purple-lighten-5" class="education-card mt-2">
              <v-card-text class="pa-3">
                <div class="education-item">
                  <v-icon size="20" color="purple-darken-2" class="mr-2">mdi-school</v-icon>
                  <div class="education-details">
                    <p class="education-course">{{ vacancyDetails.doutorado.curso }}</p>
                    <p class="education-meta">
                      <span class="education-institution">{{ vacancyDetails.doutorado.instituicao }}</span>
                      <span v-if="vacancyDetails.doutorado.subarea" class="education-separator">•</span>
                      <span v-if="vacancyDetails.doutorado.subarea" class="education-subarea">{{ vacancyDetails.doutorado.subarea }}</span>
                      <span v-if="vacancyDetails.doutorado.ano_conclusao" class="education-separator">•</span>
                      <span v-if="vacancyDetails.doutorado.ano_conclusao" class="education-year">{{ vacancyDetails.doutorado.ano_conclusao }}</span>
                    </p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-divider class="my-4" v-if="vacancyDetails.doutorado" />

          <!-- Pós-Doutorado -->
          <div class="info-section" v-if="vacancyDetails.posDoutorado">
            <div class="section-title">
              <v-icon size="small" class="mr-2">mdi-school</v-icon>
              Pós-Doutorado Requerido
            </div>
            <v-card variant="tonal" color="amber-lighten-5" class="education-card mt-2">
              <v-card-text class="pa-3">
                <div class="education-item">
                  <v-icon size="20" color="amber-darken-3" class="mr-2">mdi-school</v-icon>
                  <div class="education-details">
                    <p class="education-course">{{ vacancyDetails.posDoutorado.curso }}</p>
                    <p class="education-meta">
                      <span class="education-institution">{{ vacancyDetails.posDoutorado.instituicao }}</span>
                      <span v-if="vacancyDetails.posDoutorado.subarea" class="education-separator">•</span>
                      <span v-if="vacancyDetails.posDoutorado.subarea" class="education-subarea">{{ vacancyDetails.posDoutorado.subarea }}</span>
                      <span v-if="vacancyDetails.posDoutorado.ano_conclusao" class="education-separator">•</span>
                      <span v-if="vacancyDetails.posDoutorado.ano_conclusao" class="education-year">{{ vacancyDetails.posDoutorado.ano_conclusao }}</span>
                    </p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-divider class="my-4" v-if="vacancyDetails.posDoutorado" />

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
import { ref, watch, computed } from 'vue'
import type { LambdaVaga, LambdaCompetencia, LambdaRelationship, LambdaExperiencia, LambdaGraduacao, LambdaPosGraduacao } from '@/types/lambda.types'
import { Senioridade, Modalidade } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  vacancyData: LambdaVaga
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = ref(props.modelValue)

// Extrair dados da Lambda
const vacancyDetails = computed(() => {
  if (!props.vacancyData) return null
  return {
    empresa: props.vacancyData.properties.empresa,
    cargo: props.vacancyData.properties.cargo,
    cidade: props.vacancyData.properties.cidade,
    senioridade: props.vacancyData.properties.senioridade,
    modalidade: props.vacancyData.properties.modalidade,
    competencias: props.vacancyData.properties.relationshipsVaga
      .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_COMPETENCIA_EM')
      .map((rel: LambdaRelationship) => ({
        competencia: { nome: (rel.target as LambdaCompetencia).nome },
        peso: rel.peso || 0,
        id: Math.random()
      })),
    graduacao: props.vacancyData.properties.relationshipsVaga
      .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_GRADUACAO_EM')
      .map((rel: LambdaRelationship) => ({
        ...(rel.target as LambdaGraduacao),
        id: Math.random()
      })),
    experiencia: props.vacancyData.properties.relationshipsVaga
      .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_EXPERIENCIA_EM')
      .map((rel: LambdaRelationship) => rel.target as LambdaExperiencia)[0] || null,
    mestrado: props.vacancyData.properties.relationshipsVaga
      .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_MESTRADO_EM')
      .map((rel: LambdaRelationship) => rel.target as LambdaPosGraduacao)[0] || null,
    doutorado: props.vacancyData.properties.relationshipsVaga
      .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_DOUTORADO_EM')
      .map((rel: LambdaRelationship) => rel.target as LambdaPosGraduacao)[0] || null,
    posDoutorado: props.vacancyData.properties.relationshipsVaga
      .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_POSDOUTORADO_EM')
      .map((rel: LambdaRelationship) => rel.target as LambdaPosGraduacao)[0] || null,
  }
})

const matchedCandidate = computed(() => {
  if (!props.vacancyData?.properties?.candidatoEscolhido) return null
  return props.vacancyData.properties.candidatoEscolhido
})

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
      console.log('Modal opened with data:', props.vacancyData)
      console.log('Candidato:', props.vacancyData?.properties?.candidatoEscolhido)
    }
  }
)

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const closeDialog = () => {
  isOpen.value = false
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

.education-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.education-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.education-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.education-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.education-details {
  flex: 1;
}

.education-course {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.education-meta {
  font-size: 0.875rem;
  color: #616161;
  margin: 0;
  line-height: 1.4;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.education-type {
  font-weight: 600;
  color: #43a047;
}

.education-institution {
  font-weight: 500;
  color: #424242;
}

.education-subarea {
  font-style: italic;
  color: #757575;
}

.education-year {
  color: #9e9e9e;
}

.education-separator {
  color: #bdbdbd;
  margin: 0 2px;
}
</style>
