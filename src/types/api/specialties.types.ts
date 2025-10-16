export interface Specialty {
	id: string;
	name: string;
	slug: string;
	description?: string;
	isActive: boolean;
	infoSectionsCount: number;
	createdAt: string;
	updatedAt: string;
	infoSections?: InfoSection[];
}

export interface InfoSection {
	id: string;
	specialtyId: string;
	name: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSpecialtyRequest {
	name: string;
	description?: string;
}

export interface UpdateSpecialtyRequest {
	name?: string;
	description?: string;
}

export interface CreateInfoSectionRequest {
	specialtyId: string;
	name: string;
	content: string;
}

export interface UpdateInfoSectionRequest {
	name?: string;
	content?: string;
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
