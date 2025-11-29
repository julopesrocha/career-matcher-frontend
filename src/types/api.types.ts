// Enums baseados em API.md
export enum TipoGraduacao {
  TECNOLOGO = 'TECNOLOGO',
  LICENCIATURA = 'LICENCIATURA',
  BACHARELADO = 'BACHARELADO',
}

export enum Senioridade {
  ESTAGIARIO = 'ESTAGIARIO',
  TRAINEE = 'TRAINEE',
  JUNIOR = 'JUNIOR',
  PLENO = 'PLENO',
  SENIOR = 'SENIOR',
  GESTOR = 'GESTOR',
  GERENTE = 'GERENTE',
  ARQUITETO = 'ARQUITETO',
  ESPECIALISTA = 'ESPECIALISTA',
}

export enum Modalidade {
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO',
  PRESENCIAL = 'PRESENCIAL',
}

// Graduação
export interface Graduacao {
  id: number
  curso: string
  instituicao: string
  tipoGraduacao: TipoGraduacao
  ano_conclusao: number
  concluido: boolean
}

// Mestrado, Doutorado, Pós-Doutorado (mesma estrutura)
export interface PosGraduacao {
  id: number
  curso: string
  instituicao: string
  subarea: string
  ano_conclusao: number
  concluido: boolean
}

export type Mestrado = PosGraduacao
export type Doutorado = PosGraduacao
export type PosDoutorado = PosGraduacao

// Experiência Profissional
export interface Experiencia {
  id: number
  cargo: string
  duracao_meses: number
  senioridade: Senioridade
}

// Competência
export interface Competencia {
  id: number
  nome: string
}

// Candidato (conforme API.md)
export interface Candidato {
  id: number
  nome: string
  cargo: string
  país: string
  cidade: string
  telefone: string
  email: string
  senioridade: Senioridade
  competencias: Competencia[]
  experiencias: Experiencia[]
  graduacao: Graduacao | null
  mestrado: Mestrado | null
  doutorado: Doutorado | null
  posDoutorado: PosDoutorado | null
}

// Vaga (conforme API.md)
export interface Vaga {
  id: number
  empresa: string
  cargo: string
  cidade: string
  senioridade: Senioridade
  modalidade: Modalidade
  graduacao: Graduacao[] | null
  experiencia: Experiencia | null
  competencias: Competencia[]
  mestrado: Mestrado | null
  doutorado: Doutorado | null
  posDoutorado: PosDoutorado | null
}
