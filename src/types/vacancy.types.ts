import { Senioridade, Modalidade } from './api.types'
import type { LambdaVaga, LambdaCompetencia, LambdaRelationship } from './lambda.types'

export interface VacancyCard {
  id: number
  empresa: string
  cargo: string
  cidade: string
  senioridade: string
  modalidade: string
  competencias: string[]
  candidato?: string
  candidatoId?: number
  // Dados completos da Lambda para o modal
  fullData: LambdaVaga
}

export interface VacancyFilters {
  cargo?: string[]
  senioridade?: string[]
  modalidade?: string[]
  competencias?: string[]
  cidade?: string
  empresa?: string[]
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

const modalityDisplayMap: Record<Modalidade, string> = {
  [Modalidade.PRESENCIAL]: 'Presencial',
  [Modalidade.REMOTO]: 'Remoto',
  [Modalidade.HIBRIDO]: 'Híbrido',
}

export function lambdaVagaToCard(vaga: LambdaVaga): VacancyCard {
  const { properties } = vaga

  // Extrair competências dos relacionamentos da vaga
  const competencias = properties.relationshipsVaga
    .filter((rel: LambdaRelationship) => rel.type === 'REQUISITA_COMPETENCIA_EM')
    .map((rel: LambdaRelationship) => (rel.target as LambdaCompetencia).nome)

  return {
    id: properties.id,
    empresa: properties.empresa,
    cargo: properties.cargo,
    cidade: properties.cidade,
    senioridade: seniorityDisplayMap[properties.senioridade] || properties.senioridade,
    modalidade: modalityDisplayMap[properties.modalidade] || properties.modalidade,
    competencias,
    candidato: properties.candidatoEscolhido?.nome,
    candidatoId: properties.candidatoEscolhido?.id,
    fullData: vaga,
  }
}
