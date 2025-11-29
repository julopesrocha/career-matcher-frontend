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
    competencias: vacancy.competencias.map((c) => c.nome),
    candidato: candidate?.nome,
    candidatoId: candidate?.id,
  }
}

export function calculateCompatibility(vacancy: Vaga, candidate: Candidato): number {
  let points = 0
  let total = 0

  total += 3
  if (vacancy.senioridade === candidate.senioridade) {
    points += 3
  }

  total += 2
  if (vacancy.cidade.toLowerCase() === candidate.cidade.toLowerCase()) {
    points += 2
  }

  total += 5
  const vacancySkills = vacancy.competencias.map((c) => c.nome.toLowerCase())
  const candidateSkills = candidate.competencias.map((c) => c.nome.toLowerCase())
  const skillsMatch = vacancySkills.filter((s) => candidateSkills.includes(s)).length

  if (vacancySkills.length > 0) {
    points += (skillsMatch / vacancySkills.length) * 5
  }

  return total > 0 ? Math.round((points / total) * 100) : 0
}
