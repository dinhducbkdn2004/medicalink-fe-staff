import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getBlogs,
	getPublishedBlogs,
	getBlogById,
	getBlogBySlug,
	createBlog,
	updateBlog,
	deleteBlog,
	toggleBlogStatus,
	toggleBlogActive,
	getBlogsByAuthor,
	getBlogsBySpecialty,
	getBlogTags,
	incrementBlogView,
	getBlogStats,
} from "@/api/blogs";
import { extractApiData } from "@/api/client";
import type {
	PaginationParams,
	CreateBlogRequest,
	UpdateBlogRequest,
	BlogStatus,
} from "@/types/api";

// Query keys
export const blogKeys = {
	all: ["blogs"] as const,
	lists: () => [...blogKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			search?: string;
			status?: BlogStatus;
			authorId?: string;
			specialtyId?: string;
			tags?: string[];
			isActive?: boolean;
		}
	) => [...blogKeys.lists(), params] as const,
	published: (
		params?: PaginationParams & {
			search?: string;
			specialtyId?: string;
			tags?: string[];
		}
	) => [...blogKeys.all, "published", params] as const,
	details: () => [...blogKeys.all, "detail"] as const,
	detail: (id: string) => [...blogKeys.details(), id] as const,
	bySlug: (slug: string) => [...blogKeys.all, "slug", slug] as const,
	byAuthor: (authorId: string, params?: PaginationParams) =>
		[...blogKeys.all, "author", authorId, params] as const,
	bySpecialty: (specialtyId: string, params?: PaginationParams) =>
		[...blogKeys.all, "specialty", specialtyId, params] as const,
	tags: () => [...blogKeys.all, "tags"] as const,
	stats: () => [...blogKeys.all, "stats"] as const,
};

/**
 * Blog Query Hooks
 */

// Get blogs with pagination and filters
export const useBlogs = (
	params?: PaginationParams & {
		search?: string;
		status?: BlogStatus;
		authorId?: string;
		specialtyId?: string;
		tags?: string[];
		isActive?: boolean;
	}
) =>
	useQuery({
		queryKey: blogKeys.list(params),
		queryFn: async () => extractApiData(await getBlogs(params)),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

// Get published blogs (public)
export const usePublishedBlogs = (
	params?: PaginationParams & {
		search?: string;
		specialtyId?: string;
		tags?: string[];
	}
) =>
	useQuery({
		queryKey: blogKeys.published(params),
		queryFn: async () => extractApiData(await getPublishedBlogs(params)),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

// Get blog by ID
export const useBlog = (id: string) =>
	useQuery({
		queryKey: blogKeys.detail(id),
		queryFn: async () => extractApiData(await getBlogById(id)),
		enabled: !!id,
	});

// Get blog by slug (public)
export const useBlogBySlug = (slug: string) =>
	useQuery({
		queryKey: blogKeys.bySlug(slug),
		queryFn: async () => extractApiData(await getBlogBySlug(slug)),
		enabled: !!slug,
	});

// Get blogs by author
export const useBlogsByAuthor = (authorId: string, params?: PaginationParams) =>
	useQuery({
		queryKey: blogKeys.byAuthor(authorId, params),
		queryFn: async () =>
			extractApiData(await getBlogsByAuthor(authorId, params)),
		enabled: !!authorId,
	});

// Get blogs by specialty
export const useBlogsBySpecialty = (
	specialtyId: string,
	params?: PaginationParams
) =>
	useQuery({
		queryKey: blogKeys.bySpecialty(specialtyId, params),
		queryFn: async () =>
			extractApiData(await getBlogsBySpecialty(specialtyId, params)),
		enabled: !!specialtyId,
	});

// Get blog tags
export const useBlogTags = () =>
	useQuery({
		queryKey: blogKeys.tags(),
		queryFn: async () => extractApiData(await getBlogTags()),
		staleTime: 1000 * 60 * 10, // 10 minutes
	});

// Get blog statistics
export const useBlogStats = () =>
	useQuery({
		queryKey: blogKeys.stats(),
		queryFn: async () => extractApiData(await getBlogStats()),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Blog Mutation Hooks
 */

// Create blog mutation
export const useCreateBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateBlogRequest) =>
			extractApiData(await createBlog(data)),
		onSuccess: () => {
			// Invalidate blog lists and stats
			void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
		},
	});
};

// Update blog mutation
export const useUpdateBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateBlogRequest }) =>
			extractApiData(await updateBlog(id, data)),
		onSuccess: (_, { id }) => {
			// Invalidate blog lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
		},
	});
};

// Delete blog mutation
export const useDeleteBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => extractApiData(await deleteBlog(id)),
		onSuccess: (_, id) => {
			// Invalidate blog lists and stats
			void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
			// Remove detail from cache
			void queryClient.removeQueries({ queryKey: blogKeys.detail(id) });
		},
	});
};

// Toggle blog status mutation
export const useToggleBlogStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, status }: { id: string; status: BlogStatus }) =>
			extractApiData(await toggleBlogStatus(id, status)),
		onSuccess: (_, { id }) => {
			// Invalidate blog lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
		},
	});
};

// Toggle blog active mutation
export const useToggleBlogActive = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
			extractApiData(await toggleBlogActive(id, isActive)),
		onSuccess: (_, { id }) => {
			// Invalidate blog lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
		},
	});
};

// Increment blog view mutation
export const useIncrementBlogView = () =>
	useMutation({
		mutationFn: async (id: string) =>
			extractApiData(await incrementBlogView(id)),
		// Don't invalidate queries for view increments to avoid excessive refetches
	});
