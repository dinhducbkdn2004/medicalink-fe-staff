import { apiClient } from '@/api/core/client'

export interface Testimonial {
  id: string
  authorName: string
  authorAvatar: string | null
  authorTitle: string | null
  content: string
  rating: number | null
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface TestimonialAdminQueryParams {
  search?: string
  isFeatured?: boolean
}

export interface CreateTestimonialRequest {
  authorName: string
  authorAvatar?: string
  authorTitle?: string
  content: string
  rating?: number
  isFeatured?: boolean
}

export interface UpdateTestimonialRequest {
  id: string
  authorName?: string
  authorAvatar?: string | null
  authorTitle?: string | null
  content?: string
  rating?: number
  isFeatured?: boolean
}

class TestimonialService {
  async listAdmin(
    params?: TestimonialAdminQueryParams
  ): Promise<Testimonial[]> {
    const response = await apiClient.get<Testimonial[]>('/testimonials/admin', {
      params,
    })
    return response.data
  }

  async getById(id: string): Promise<Testimonial> {
    const response = await apiClient.get<Testimonial>(`/testimonials/${id}`)
    return response.data
  }

  async create(data: CreateTestimonialRequest): Promise<Testimonial> {
    const response = await apiClient.post<Testimonial>('/testimonials', data)
    return response.data
  }

  async update(
    id: string,
    data: Omit<UpdateTestimonialRequest, 'id'>
  ): Promise<Testimonial> {
    const response = await apiClient.patch<Testimonial>(`/testimonials/${id}`, {
      id,
      ...data,
    })
    return response.data
  }

  async toggleFeatured(id: string): Promise<Testimonial> {
    const response = await apiClient.patch<Testimonial>(
      `/testimonials/${id}/toggle-featured`,
      {}
    )
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/testimonials/${id}`)
  }
}

export const testimonialService = new TestimonialService()
