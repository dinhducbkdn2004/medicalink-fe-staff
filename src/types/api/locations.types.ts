export interface WorkLocation {
	id: string;
	name: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	phone?: string;
	timezone?: string;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateWorkLocationRequest {
	name: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	phone?: string;
	timezone?: string;
}

export interface UpdateWorkLocationRequest {
	name?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	phone?: string;
	timezone?: string;
	isActive?: boolean;
}

export interface WorkLocationQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	isActive?: boolean;
	includeMetadata?: boolean;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
}

export interface WorkLocationStats {
	total: number;
	recentlyCreated: number;
	active?: number;
	inactive?: number;
}
