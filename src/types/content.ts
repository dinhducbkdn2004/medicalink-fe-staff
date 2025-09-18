/**
 * Content Types - Blogs and Questions
 */

/**
 * Blog Types
 */
export interface Blog {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	imageUrl?: string;
	authorId: string;
	author?: {
		id: string;
		fullName: string;
		email: string;
	};
	specialtyId?: string;
	specialty?: {
		id: string;
		name: string;
	};
	tags?: string[];
	status: BlogStatus;
	isActive: boolean;
	viewCount: number;
	publishedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CreateBlogRequest {
	title: string;
	content: string;
	excerpt?: string;
	imageUrl?: string;
	specialtyId?: string;
	tags?: string[];
	status?: BlogStatus;
}

export interface UpdateBlogRequest {
	title?: string;
	content?: string;
	excerpt?: string;
	imageUrl?: string;
	specialtyId?: string;
	tags?: string[];
	status?: BlogStatus;
	isActive?: boolean;
}

/**
 * Question Types
 */
export interface Question {
	id: string;
	title: string;
	content: string;
	authorId: string;
	author?: {
		id: string;
		fullName: string;
		email: string;
	};
	specialtyId?: string;
	specialty?: {
		id: string;
		name: string;
	};
	doctorId?: string;
	doctor?: {
		id: string;
		fullName: string;
		email: string;
	};
	tags?: string[];
	status: QuestionStatus;
	priority: QuestionPriority;
	isPublic: boolean;
	isAnswered: boolean;
	viewCount: number;
	answers?: Answer[];
	createdAt: string;
	updatedAt: string;
}

export type QuestionStatus = "PENDING" | "ANSWERED" | "CLOSED" | "ARCHIVED";
export type QuestionPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Answer {
	id: string;
	questionId: string;
	content: string;
	authorId: string;
	author?: {
		id: string;
		fullName: string;
		email: string;
	};
	isAccepted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateQuestionRequest {
	title: string;
	content: string;
	specialtyId?: string;
	tags?: string[];
	isPublic?: boolean;
}

export interface UpdateQuestionRequest {
	title?: string;
	content?: string;
	specialtyId?: string;
	tags?: string[];
	status?: QuestionStatus;
	priority?: QuestionPriority;
	isPublic?: boolean;
}

export interface AnswerQuestionRequest {
	content: string;
	isAccepted?: boolean;
}
