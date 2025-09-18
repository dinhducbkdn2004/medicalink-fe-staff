import { apiClient } from "./core/client";
import type {
	Blog,
	CreateBlogRequest,
	UpdateBlogRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
	BlogStatus,
} from "@/types";

/**
 * Blog management API endpoints
 */

// Get all blogs with pagination and filters
export const getBlogs = (
	params?: PaginationParams & {
		search?: string;
		status?: BlogStatus;
		authorId?: string;
		specialtyId?: string;
		tags?: string[];
		isActive?: boolean;
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Blog>>>("/blogs", {
		params: {
			...params,
			tags: params?.tags?.join(","),
		},
	});

// Get published blogs (public endpoint)
export const getPublishedBlogs = (
	params?: PaginationParams & {
		search?: string;
		specialtyId?: string;
		tags?: string[];
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Blog>>>("/blogs/published", {
		params: {
			...params,
			tags: params?.tags?.join(","),
		},
	});

// Get blog by ID
export const getBlogById = (id: string) =>
	apiClient.get<ApiResponse<Blog>>(`/blogs/${id}`);

// Get blog by slug (public endpoint)
export const getBlogBySlug = (slug: string) =>
	apiClient.get<ApiResponse<Blog>>(`/blogs/slug/${slug}`);

// Create new blog
export const createBlog = (data: CreateBlogRequest) =>
	apiClient.post<ApiResponse<Blog>>("/blogs", data);

// Update blog
export const updateBlog = (id: string, data: UpdateBlogRequest) =>
	apiClient.patch<ApiResponse<Blog>>(`/blogs/${id}`, data);

// Delete blog (soft delete)
export const deleteBlog = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/blogs/${id}`);

// Publish/Unpublish blog
export const toggleBlogStatus = (id: string, status: BlogStatus) =>
	apiClient.patch<ApiResponse<Blog>>(`/blogs/${id}/status`, {
		status,
	});

// Activate/Deactivate blog
export const toggleBlogActive = (id: string, isActive: boolean) =>
	apiClient.patch<ApiResponse<Blog>>(`/blogs/${id}/active`, {
		isActive,
	});

// Get blogs by author
export const getBlogsByAuthor = (authorId: string, params?: PaginationParams) =>
	apiClient.get<ApiResponse<PaginatedResponse<Blog>>>(
		`/blogs/author/${authorId}`,
		{
			params,
		}
	);

// Get blogs by specialty
export const getBlogsBySpecialty = (
	specialtyId: string,
	params?: PaginationParams
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Blog>>>(
		`/blogs/specialty/${specialtyId}`,
		{
			params,
		}
	);

// Get blog tags
export const getBlogTags = () =>
	apiClient.get<ApiResponse<string[]>>("/blogs/tags");

// Increment blog view count
export const incrementBlogView = (id: string) =>
	apiClient.post<ApiResponse<{ viewCount: number }>>(`/blogs/${id}/view`);

// Get blog statistics
export const getBlogStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			published: number;
			draft: number;
			archived: number;
			totalViews: number;
			byAuthor: Array<{ authorId: string; authorName: string; count: number }>;
			bySpecialty: Array<{
				specialtyId: string;
				specialtyName: string;
				count: number;
			}>;
			byStatus: Array<{ status: BlogStatus; count: number }>;
		}>
	>("/blogs/stats");
