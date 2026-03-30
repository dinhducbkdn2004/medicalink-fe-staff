import { apiClient } from '@/api/core/client'

export interface Faq {
  id: string
  question: string
  answer: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FaqAdminQueryParams {
  search?: string
  isActive?: boolean
}

export interface CreateFaqRequest {
  question: string
  answer: string
  order?: number
  isActive?: boolean
}

export interface UpdateFaqRequest {
  id: string
  question?: string
  answer?: string
  order?: number
  isActive?: boolean
}

class FaqService {
  async listAdmin(params?: FaqAdminQueryParams): Promise<Faq[]> {
    const response = await apiClient.get<Faq[]>('/faqs/admin', { params })
    return response.data
  }

  async getById(id: string): Promise<Faq> {
    const response = await apiClient.get<Faq>(`/faqs/${id}`)
    return response.data
  }

  async create(data: CreateFaqRequest): Promise<Faq> {
    const response = await apiClient.post<Faq>('/faqs', data)
    return response.data
  }

  async update(id: string, data: Omit<UpdateFaqRequest, 'id'>): Promise<Faq> {
    const response = await apiClient.patch<Faq>(`/faqs/${id}`, {
      id,
      ...data,
    })
    return response.data
  }

  async toggleActive(id: string): Promise<Faq> {
    const response = await apiClient.patch<Faq>(`/faqs/${id}/toggle-active`, {})
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/faqs/${id}`)
  }
}

export const faqService = new FaqService()
