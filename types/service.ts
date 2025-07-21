// Service Function Parameter Types
export interface CreateCommentParams {
	companyId: bigint;
	content: string;
	rating: number;
}

export interface CreateCompanyParams {
	name: string;
	description: string;
	location: string;
	website: string;
}

export interface VoteParams {
	commentId: bigint;
	isUpvote: boolean;
}

export interface ReportCommentParams {
	commentId: bigint;
}

export interface HideCommentParams {
	commentId: bigint;
}

export interface FindCompanyParams {
	keyword: string;
}

// Service Function Return Types
export interface ServiceResult<T> {
	data: T | undefined;
	isLoading: boolean;
	error: Error | null;
}

export interface ReadFunctionResult<T> extends ServiceResult<T> {
	refetch: () => void;
}

export interface WriteFunctionResult {
	isLoading: boolean;
	error: Error | null;
	execute: () => Promise<void>;
}

// Thirdweb specific types for readonly data
export type ReadonlyCompany = Readonly<import("./contract").Company>;
export type ReadonlyComment = Readonly<import("./contract").Comment>;
export type ReadonlyCompanyArray = readonly ReadonlyCompany[];
export type ReadonlyCommentArray = readonly ReadonlyComment[];
