import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getQuestions,
	getPublicQuestions,
	getQuestionById,
	createQuestion,
	updateQuestion,
	deleteQuestion,
	answerQuestion,
	updateQuestionStatus,
	updateQuestionPriority,
	assignQuestionToDoctor,
	toggleQuestionPublic,
	getQuestionsBySpecialty,
	getQuestionsByDoctor,
	incrementQuestionView,
	getQuestionStats,
} from "@/api/questions";
import { extractApiData } from "@/api/client";
import type {
	PaginationParams,
	CreateQuestionRequest,
	UpdateQuestionRequest,
	AnswerQuestionRequest,
	QuestionStatus,
	QuestionPriority,
} from "@/types/api";

// Query keys
export const questionKeys = {
	all: ["questions"] as const,
	lists: () => [...questionKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			search?: string;
			status?: QuestionStatus;
			priority?: QuestionPriority;
			specialtyId?: string;
			doctorId?: string;
			isPublic?: boolean;
		}
	) => [...questionKeys.lists(), params] as const,
	public: (
		params?: PaginationParams & {
			search?: string;
			specialtyId?: string;
		}
	) => [...questionKeys.all, "public", params] as const,
	details: () => [...questionKeys.all, "detail"] as const,
	detail: (id: string) => [...questionKeys.details(), id] as const,
	bySpecialty: (specialtyId: string, params?: PaginationParams) =>
		[...questionKeys.all, "specialty", specialtyId, params] as const,
	byDoctor: (doctorId: string, params?: PaginationParams) =>
		[...questionKeys.all, "doctor", doctorId, params] as const,
	stats: () => [...questionKeys.all, "stats"] as const,
};

/**
 * Question Query Hooks
 */

// Get questions with pagination and filters
export const useQuestions = (
	params?: PaginationParams & {
		search?: string;
		status?: QuestionStatus;
		priority?: QuestionPriority;
		specialtyId?: string;
		doctorId?: string;
		isPublic?: boolean;
	}
) =>
	useQuery({
		queryKey: questionKeys.list(params),
		queryFn: async () => extractApiData(await getQuestions(params)),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

// Get public questions (for FAQ)
export const usePublicQuestions = (
	params?: PaginationParams & {
		search?: string;
		specialtyId?: string;
	}
) =>
	useQuery({
		queryKey: questionKeys.public(params),
		queryFn: async () => extractApiData(await getPublicQuestions(params)),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

// Get question by ID
export const useQuestion = (id: string) =>
	useQuery({
		queryKey: questionKeys.detail(id),
		queryFn: async () => extractApiData(await getQuestionById(id)),
		enabled: !!id,
	});

// Get questions by specialty
export const useQuestionsBySpecialty = (
	specialtyId: string,
	params?: PaginationParams
) =>
	useQuery({
		queryKey: questionKeys.bySpecialty(specialtyId, params),
		queryFn: async () =>
			extractApiData(await getQuestionsBySpecialty(specialtyId, params)),
		enabled: !!specialtyId,
	});

// Get questions by doctor
export const useQuestionsByDoctor = (
	doctorId: string,
	params?: PaginationParams
) =>
	useQuery({
		queryKey: questionKeys.byDoctor(doctorId, params),
		queryFn: async () =>
			extractApiData(await getQuestionsByDoctor(doctorId, params)),
		enabled: !!doctorId,
	});

// Get question statistics
export const useQuestionStats = () =>
	useQuery({
		queryKey: questionKeys.stats(),
		queryFn: async () => extractApiData(await getQuestionStats()),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Question Mutation Hooks
 */

// Create question mutation (public)
export const useCreateQuestion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateQuestionRequest) =>
			extractApiData(await createQuestion(data)),
		onSuccess: () => {
			// Invalidate question lists and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Update question mutation
export const useUpdateQuestion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateQuestionRequest;
		}) => extractApiData(await updateQuestion(id, data)),
		onSuccess: (_, { id }) => {
			// Invalidate question lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Delete question mutation
export const useDeleteQuestion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => extractApiData(await deleteQuestion(id)),
		onSuccess: (_, id) => {
			// Invalidate question lists and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
			// Remove detail from cache
			void queryClient.removeQueries({ queryKey: questionKeys.detail(id) });
		},
	});
};

// Answer question mutation
export const useAnswerQuestion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: AnswerQuestionRequest;
		}) => extractApiData(await answerQuestion(id, data)),
		onSuccess: (_, { id }) => {
			// Invalidate question lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Update question status mutation
export const useUpdateQuestionStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			status,
		}: {
			id: string;
			status: QuestionStatus;
		}) => extractApiData(await updateQuestionStatus(id, status)),
		onSuccess: (_, { id }) => {
			// Invalidate question lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Update question priority mutation
export const useUpdateQuestionPriority = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			priority,
		}: {
			id: string;
			priority: QuestionPriority;
		}) => extractApiData(await updateQuestionPriority(id, priority)),
		onSuccess: (_, { id }) => {
			// Invalidate question lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Assign question to doctor mutation
export const useAssignQuestionToDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, doctorId }: { id: string; doctorId: string }) =>
			extractApiData(await assignQuestionToDoctor(id, doctorId)),
		onSuccess: (_, { id }) => {
			// Invalidate question lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Toggle question public visibility mutation
export const useToggleQuestionPublic = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) =>
			extractApiData(await toggleQuestionPublic(id, isPublic)),
		onSuccess: (_, { id }) => {
			// Invalidate question lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
		},
	});
};

// Increment question view mutation
export const useIncrementQuestionView = () =>
	useMutation({
		mutationFn: async (id: string) =>
			extractApiData(await incrementQuestionView(id)),
		// Don't invalidate queries for view increments to avoid excessive refetches
	});
