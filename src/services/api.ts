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

  // ==================== VAGAS ====================

  async getVagas(): Promise<Vaga[]> {
    const response = await this.client.get<Vaga[]>('vagas/')
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
