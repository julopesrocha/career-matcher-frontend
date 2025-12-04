import axios, { type AxiosInstance } from 'axios'
import type { LambdaResponse, LambdaRequest } from '@/types/lambda.types'

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

  // ==================== LAMBDA AWS - REQUISIÇÃO ÚNICA ====================

  async getCareerMatcherData(filters?: LambdaRequest['filters']): Promise<LambdaResponse> {
    const requestBody: LambdaRequest = filters ? { filters } : {}

    const response = await this.client.post<LambdaResponse>('', requestBody)
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
