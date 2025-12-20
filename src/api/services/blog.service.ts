import { apiClient } from '@/api/core/client'
import {
  type PaginatedResponse as ApiListResponse,
  type ApiSuccessResponse as ApiResponse,
} from '@/api/types/common.types'

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
}

export interface BlogCategoryQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  includeMetadata?: boolean
}

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  thumbnailUrl?: string
  status: BlogStatus
  publishedAt?: string
  authorId: string
  categoryId: string
  category?: BlogCategory
  publicIds: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
  authorName?: string
}

export interface CreateBlogRequest {
  title: string
  content: string
  categoryId: string
  thumbnailUrl?: string
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  categoryId?: string
  thumbnailUrl?: string
  status?: BlogStatus
}

export interface BlogQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: BlogStatus
  categoryId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  includeMetadata?: boolean
}

class BlogService {
  private readonly BASE_PATH = '/blogs'

  /**
   * Get all blog categories
   */
  async getAllCategories(
    params?: BlogCategoryQueryParams
  ): Promise<ApiListResponse<BlogCategory>> {
    const response = await apiClient.get<ApiListResponse<BlogCategory>>(
      `${this.BASE_PATH}/categories`,
      {
        params,
      }
    )
    return response.data
  }

  /**
   * Create a new blog category
   */
  async createCategory(
    data: CreateCategoryRequest
  ): Promise<ApiResponse<BlogCategory>> {
    const response = await apiClient.post<ApiResponse<BlogCategory>>(
      `${this.BASE_PATH}/categories`,
      data
    )
    return response.data
  }

  /**
   * Update a blog category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<BlogCategory>> {
    const response = await apiClient.patch<ApiResponse<BlogCategory>>(
      `${this.BASE_PATH}/categories/${id}`,
      data
    )
    return response.data
  }

  /**
   * Delete a blog category
   */
  async deleteCategory(
    id: string,
    forceBulkDelete?: boolean
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/categories/${id}`,
      {
        params: {
          forceBulkDelete,
        },
      }
    )
    return response.data
  }

  // ============================================================================
  // Blog Posts
  // ============================================================================

  /**
   * Get all blogs
   */
  async getAllBlogs(params?: BlogQueryParams): Promise<ApiListResponse<Blog>> {
    const response = await apiClient.get<ApiListResponse<Blog>>(
      `${this.BASE_PATH}`,
      {
        params,
      }
    )
    return response.data
  }

  /**
   * Get a single blog by ID
   */
  async getBlog(id: string): Promise<ApiResponse<Blog>> {
    const response = await apiClient.get<ApiResponse<Blog>>(
      `${this.BASE_PATH}/${id}`
    )
    return response.data
  }

  /**
   * Create a new blog
   */
  async createBlog(data: CreateBlogRequest): Promise<ApiResponse<Blog>> {
    const response = await apiClient.post<ApiResponse<Blog>>(
      `${this.BASE_PATH}`,
      data
    )
    return response.data
  }

  /**
   * Update a blog
   */
  async updateBlog(
    id: string,
    data: UpdateBlogRequest
  ): Promise<ApiResponse<Blog>> {
    const response = await apiClient.patch<ApiResponse<Blog>>(
      `${this.BASE_PATH}/${id}`,
      data
    )
    return response.data
  }

  /**
   * Update a blog (Doctor only - limited fields)
   * Doctors can only update: title and content
   */
  async updateBlogAsDoctor(
    id: string,
    data: Pick<UpdateBlogRequest, 'title' | 'content'>
  ): Promise<ApiResponse<Blog>> {
    const response = await apiClient.patch<ApiResponse<Blog>>(
      `${this.BASE_PATH}/${id}/doctor`,
      data
    )
    return response.data
  }

  /**
   * Delete a blog
   */
  async deleteBlog(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    )
    return response.data
  }
}

export const blogService = new BlogService()
