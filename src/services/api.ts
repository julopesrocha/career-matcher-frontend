import axios, { type AxiosInstance } from 'axios'
import type { Candidato, Vaga } from '@/types/api.types'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/careermatcher',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // ==================== CANDIDATOS ====================

  async getCandidatos(): Promise<Candidato[]> {
    const response = await this.client.get<Candidato[]>('candidatos/')
    return response.data
  }

  async getCandidatoById(id: number): Promise<Candidato> {
    const response = await this.client.get<Candidato>(`candidatos/${id}`)
    return response.data
  }

  // ==================== VAGAS ====================

  async getVagas(): Promise<Vaga[]> {
    const response = await this.client.get<Vaga[]>('vagas/')
    return response.data
  }

  async getVagasWithFilters(filters: {
    senioridade?: string[]
    modalidade?: string[]
    cargo?: string[]
    empresa?: string
    cidade?: string
  }): Promise<Vaga[]> {
    const params = new URLSearchParams()

    if (filters.senioridade && filters.senioridade.length > 0) {
      filters.senioridade.forEach((s) => params.append('senioridade', s))
    }

    if (filters.modalidade && filters.modalidade.length > 0) {
      filters.modalidade.forEach((m) => params.append('modalidade', m))
    }

    if (filters.cargo && filters.cargo.length > 0) {
      filters.cargo.forEach((c) => params.append('cargo', c))
    }

    if (filters.empresa) {
      params.append('empresa', filters.empresa)
    }

    if (filters.cidade) {
      params.append('cidade', filters.cidade)
    }

    const queryString = params.toString()
    const url = queryString ? `vagas/?${queryString}` : 'vagas/'

    const response = await this.client.get<Vaga[]>(url)
    return response.data
  }

  async getVagaById(id: number): Promise<Vaga> {
    const response = await this.client.get<Vaga>(`vagas/${id}`)
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
