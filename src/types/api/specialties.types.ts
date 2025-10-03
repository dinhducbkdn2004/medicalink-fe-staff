export interface Specialty {
	id: string;
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	infoSections?: InfoSection[];
}

export interface InfoSection {
	id: string;
	specialtyId: string;
	title: string;
	content: string;
	order?: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSpecialtyRequest {
	name: string;
	slug: string;
	description?: string;
	icon?: string;
}

export interface UpdateSpecialtyRequest {
	name?: string;
	slug?: string;
	description?: string;
	icon?: string;
	isActive?: boolean;
}

export interface CreateInfoSectionRequest {
	specialtyId: string;
	title: string;
	content: string;
	order?: number;
}

export interface UpdateInfoSectionRequest {
	title?: string;
	content?: string;
	order?: number;
}

export interface SpecialtyQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	isActive?: boolean;
}

export interface SpecialtyStats {
	total: number;
	active: number;
	inactive: number;
	withDoctors: number;
}
