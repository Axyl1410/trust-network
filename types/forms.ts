// Form Types
export interface ReviewFormData {
	companyId: bigint;
	content: string;
	rating: number;
}

export interface CompanyFormData {
	name: string;
	description: string;
	location: string;
	website: string;
}

// Search and Filter Types
export interface SearchFilters {
	keyword?: string;
	category?: string;
	rating?: number;
	sortBy?: "date" | "rating" | "votes";
	sortOrder?: "asc" | "desc";
}

// Pagination Types
export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
