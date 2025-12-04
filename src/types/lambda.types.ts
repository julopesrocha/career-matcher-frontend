import { Senioridade, Modalidade, TipoGraduacao } from './api.types'

// Estrutura de Competência da Lambda
export interface LambdaCompetencia {
  nome: string
}

// Estrutura de Graduação da Lambda
export interface LambdaGraduacao {
  instituicao: string
  tipoGraduacao: TipoGraduacao
  curso: string
  ano_conclusao: number
}

// Estrutura de Pós-Graduação da Lambda
export interface LambdaPosGraduacao {
  instituicao: string
  subarea: string
  curso: string
  ano_conclusao: number
}

// Estrutura de Experiência da Lambda
export interface LambdaExperiencia {
  duração_meses: number
  cargo: string
  senioridade: Senioridade
}

// Relacionamentos aninhados da Lambda
export interface LambdaRelationship {
  type: string
  target: LambdaCompetencia | LambdaExperiencia | LambdaGraduacao | LambdaPosGraduacao
  peso?: number
}

// Candidato escolhido (aninhado na vaga)
export interface LambdaCandidatoEscolhido {
  telefone: string
  cidade: string
  país: string
  nome: string
  id: number
  idVagaEscolhida: number
  cargo: string
  senioridade: Senioridade
  email: string
  relationshipsCandidato?: LambdaRelationship[] // Competências e outros dados do candidato
}

// Properties da Vaga
export interface LambdaVagaProperties {
  cidade: string
  idCandidatoEscolhido: number
  id: number
  cargo: string
  senioridade: Senioridade
  empresa: string
  modalidade: Modalidade
  candidatoEscolhido: LambdaCandidatoEscolhido
  relationshipsVaga: LambdaRelationship[]
  relationshipsCandidato: LambdaRelationship[]
}

// Vaga da Lambda
export interface LambdaVaga {
  id: number
  properties: LambdaVagaProperties
}

// Resposta completa da Lambda
export interface LambdaResponse {
  vagas: LambdaVaga[]
}

// Filtros para enviar à Lambda
export interface LambdaFilters {
  cargo?: string[]
  senioridade?: string[]
  modalidade?: string[]
  cidade?: string[]
  empresa?: string[]
  competencias?: string[]
}

export interface LambdaRequest {
  filters?: LambdaFilters
}
