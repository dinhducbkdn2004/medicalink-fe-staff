import { apiClient } from "./core/client";
import type {
	Question,
	CreateQuestionRequest,
	UpdateQuestionRequest,
	AnswerQuestionRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
	QuestionStatus,
	QuestionPriority,
} from "@/types";

/**
 * Question management API endpoints
 */

// Get all questions with pagination and filters
export const getQuestions = (
	params?: PaginationParams & {
		search?: string;
		status?: QuestionStatus;
		priority?: QuestionPriority;
		specialtyId?: string;
		doctorId?: string;
		isPublic?: boolean;
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Question>>>("/questions", {
		params,
	});

// Get public questions (for FAQ page)
export const getPublicQuestions = (
	params?: PaginationParams & {
		search?: string;
		specialtyId?: string;
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Question>>>("/questions/public", {
		params,
	});

// Get question by ID
export const getQuestionById = (id: string) =>
	apiClient.get<ApiResponse<Question>>(`/questions/${id}`);

// Create new question (public endpoint)
export const createQuestion = (data: CreateQuestionRequest) =>
	apiClient.post<ApiResponse<Question>>("/questions", data);

// Update question
export const updateQuestion = (id: string, data: UpdateQuestionRequest) =>
	apiClient.patch<ApiResponse<Question>>(`/questions/${id}`, data);

// Delete question (soft delete)
export const deleteQuestion = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/questions/${id}`);

// Answer question
export const answerQuestion = (id: string, data: AnswerQuestionRequest) =>
	apiClient.post<ApiResponse<Question>>(`/questions/${id}/answer`, data);

// Update question status
export const updateQuestionStatus = (id: string, status: QuestionStatus) =>
	apiClient.patch<ApiResponse<Question>>(`/questions/${id}/status`, {
		status,
	});

// Update question priority
export const updateQuestionPriority = (
	id: string,
	priority: QuestionPriority
) =>
	apiClient.patch<ApiResponse<Question>>(`/questions/${id}/priority`, {
		priority,
	});

// Assign question to doctor
export const assignQuestionToDoctor = (id: string, doctorId: string) =>
	apiClient.patch<ApiResponse<Question>>(`/questions/${id}/assign`, {
		doctorId,
	});

// Toggle question public visibility
export const toggleQuestionPublic = (id: string, isPublic: boolean) =>
	apiClient.patch<ApiResponse<Question>>(`/questions/${id}/public`, {
		isPublic,
	});

// Get questions by specialty
export const getQuestionsBySpecialty = (
	specialtyId: string,
	params?: PaginationParams
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Question>>>(
		`/questions/specialty/${specialtyId}`,
		{
			params,
		}
	);

// Get questions assigned to doctor
export const getQuestionsByDoctor = (
	doctorId: string,
	params?: PaginationParams
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Question>>>(
		`/questions/doctor/${doctorId}`,
		{
			params,
		}
	);

// Increment question view count
export const incrementQuestionView = (id: string) =>
	apiClient.post<ApiResponse<{ viewCount: number }>>(`/questions/${id}/view`);

// Get question statistics
export const getQuestionStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			pending: number;
			answered: number;
			closed: number;
			public: number;
			totalViews: number;
			bySpecialty: Array<{
				specialtyId: string;
				specialtyName: string;
				count: number;
			}>;
			byDoctor: Array<{ doctorId: string; doctorName: string; count: number }>;
			byStatus: Array<{ status: QuestionStatus; count: number }>;
			byPriority: Array<{ priority: QuestionPriority; count: number }>;
		}>
	>("/questions/stats");
