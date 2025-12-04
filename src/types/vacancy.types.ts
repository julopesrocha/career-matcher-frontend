import { Senioridade, Modalidade } from './api.types'
import type { Vaga, Candidato } from './api.types'

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
}

export interface VacancyFilters {
  cargo?: string[]
  senioridade?: string[]
  modalidade?: string[]
  competencias?: string[]
  cidade?: string
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

export function vacancyToCard(vacancy: Vaga, candidate?: Candidato): VacancyCard {
  return {
    id: vacancy.id,
    empresa: vacancy.empresa,
    cargo: vacancy.cargo,
    cidade: vacancy.cidade,
    senioridade: seniorityDisplayMap[vacancy.senioridade] || vacancy.senioridade,
    modalidade: modalityDisplayMap[vacancy.modalidade] || vacancy.modalidade,
    competencias: vacancy.competencias.map((c) => c.competencia.nome),
    candidato: candidate?.nome,
    candidatoId: candidate?.id,
  }
}
