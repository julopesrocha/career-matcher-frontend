<template>
  <div class="user-component">
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom" offset="8">
      <template #activator="{ props: menuProps }">
        <v-chip
          color="deep-purple"
          v-bind="menuProps"
          variant="flat"
          class="candidate-chip"
          size="small"
          prepend-icon="mdi-account"
        >
          <span class="candidate-name">{{ data?.nome || candidateName || 'Sem candidato' }}</span>
        </v-chip>
      </template>

      <v-card class="popover-card" rounded="xl" elevation="8" min-width="320" max-width="380">
        <!-- LOADING -->
        <div v-if="loading" class="popover-content text-center pa-6">
          <v-progress-circular indeterminate color="deep-purple" size="40"></v-progress-circular>
          <p class="mt-3 text-grey-darken-1">Carregando...</p>
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="popover-content text-center pa-6">
          <v-icon size="48" color="error">mdi-alert-circle</v-icon>
          <p class="mt-3 text-error">Candidato não encontrado</p>
        </div>

        <!-- DADOS -->
        <div v-else class="popover-content">
          <div class="popover-header">
            <v-avatar size="64" class="avatar-shadow">
              <v-img v-if="data?.avatar" :src="data.avatar" cover />
              <v-icon v-else size="32" color="deep-purple">mdi-account-circle</v-icon>
            </v-avatar>
            <div class="header-info">
              <h3 class="candidate-title">{{ data?.nome }}</h3>
              <p class="candidate-subtitle">{{ data?.senioridade }}</p>
              <p class="candidate-location">
                <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                {{ data?.cidade }}
              </p>
            </div>
          </div>

          <v-divider class="my-3" />

          <div v-if="data?.competencias && data.competencias.length > 0" class="tech-section">
            <div class="section-title">
              <v-icon size="18" class="mr-1">mdi-code-tags</v-icon>
              Tecnologias
            </div>
            <div class="tech-chips">
              <v-chip
                v-for="tec in data?.competencias"
                :key="tec"
                size="small"
                color="indigo-lighten-4"
                variant="flat"
                class="tech-chip"
              >
                {{ tec }}
              </v-chip>
            </div>
          </div>
          <div v-else class="tech-section">
            <p class="text-caption text-grey-darken-1">
              Informações de competências não disponíveis
            </p>
          </div>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LambdaCandidatoEscolhido, LambdaRelationship, LambdaCompetencia } from '@/types/lambda.types'
import { Senioridade } from '@/types/api.types'

const menu = ref(false)

const props = defineProps<{
  candidateName?: string
  candidateId?: number
  candidateData?: LambdaCandidatoEscolhido
}>()

interface Candidate {
  nome: string
  senioridade: string
  cidade: string
  avatar: string | null
  competencias: string[]
}

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

const data = computed<Candidate | null>(() => {
  if (!props.candidateData) return null

  // Extrair competências dos relationshipsCandidato (se disponível)
  const competencias = props.candidateData.relationshipsCandidato
    ? props.candidateData.relationshipsCandidato
        .filter((rel: LambdaRelationship) => rel.type === 'HABIL_EM')
        .map((rel: LambdaRelationship) => (rel.target as LambdaCompetencia).nome)
    : []

  return {
    nome: props.candidateData.nome,
    senioridade: seniorityDisplayMap[props.candidateData.senioridade] || props.candidateData.senioridade,
    cidade: props.candidateData.cidade,
    avatar: null,
    competencias,
  }
})

const loading = ref(false)
const error = computed(() => !props.candidateData && props.candidateId !== undefined)
</script>

<style scoped>
.user-component {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.candidate-chip {
  font-weight: 500;
  color: white !important;
  max-width: 180px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.candidate-chip:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(103, 58, 183, 0.3);
}

.candidate-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popover-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.popover-content {
  padding: 20px;
}

.popover-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.avatar-shadow {
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.2);
}

.header-info {
  flex: 1;
}

.candidate-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
}

.candidate-subtitle {
  font-size: 0.875rem;
  color: #5e35b1;
  font-weight: 600;
  margin: 4px 0 2px 0;
}

.candidate-location {
  font-size: 0.8rem;
  color: #757575;
  display: flex;
  align-items: center;
  margin: 0;
}

.tech-section {
  margin-top: 8px;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #5e35b1;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-chip {
  font-weight: 500;
  color: #3f51b5 !important;
}
</style>
