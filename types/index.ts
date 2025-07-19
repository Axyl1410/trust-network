// Smart Contract Data Types
export interface Company {
	id: bigint;
	name: string;
	description: string;
	location: string;
	website: string;
	admin: string;
	createdAt: bigint;
	exists: boolean;
	totalComments: bigint;
	totalRating: bigint;
}

export interface Comment {
	id: bigint;
	author: string;
	content: string;
	createdAt: bigint;
	votes: bigint;
	upvotes: bigint;
	downvotes: bigint;
	hidden: boolean;
	reportCount: bigint;
	rating: bigint;
	companyId: bigint;
}

export interface CompanyRatingStats {
	averageRating: bigint;
	totalComments: bigint;
	totalRating: bigint;
}

export interface CompanySearchResult {
	id: bigint;
	name: string;
	exists: boolean;
}

// Contract function return types (tuples)
export type CommentTuple = readonly [
	bigint, // id
	string, // author
	string, // content
	bigint, // createdAt
	bigint, // votes
	bigint, // upvotes
	bigint, // downvotes
	boolean, // hidden
	bigint, // reportCount
	bigint, // rating
	bigint, // companyId
];

export type CompanyTuple = readonly [
	bigint, // id
	string, // name
	string, // description
	string, // location
	string, // website
	string, // admin
	bigint, // createdAt
	boolean, // exists
	bigint, // totalComments
	bigint, // totalRating
];

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
export type ReadonlyCompany = Readonly<Company>;
export type ReadonlyComment = Readonly<Comment>;
export type ReadonlyCompanyArray = readonly ReadonlyCompany[];
export type ReadonlyCommentArray = readonly ReadonlyComment[];

// Component Props Types
export interface CreateCommentProps {
	companyId: bigint;
	content: string;
	rating: number;
}

export interface CreateCompanyProps {
	name: string;
	description: string;
	location: string;
	website: string;
}

export interface VoteProps {
	commentId: bigint;
	isUpvote: boolean;
}

export interface ReportCommentProps {
	commentId: bigint;
}

export interface HideCommentProps {
	commentId: bigint;
}

// UI Component Types
export interface ProfileUserData {
	name: string;
	username: string;
	bio: string;
	following: number;
	followers: number;
	website: string;
	joinedDate: string;
}

export interface FeedPost {
	id: number;
	title: string;
	content: string;
	date: string;
	readTime: string;
	tags: string[];
	likes: number;
	comments: number;
	shares: number;
}

// Contract Event Types
export interface CompanyCreatedEvent {
	id: bigint;
	name: string;
	admin: string;
}

export interface CommentCreatedEvent {
	companyId: bigint;
	commentId: bigint;
	author: string;
	content: string;
	rating: bigint;
}

export interface VotedEvent {
	commentId: bigint;
	voter: string;
	isUpvote: boolean;
}

export interface CommentReportedEvent {
	commentId: bigint;
	reporter: string;
}

export interface CommentHiddenEvent {
	commentId: bigint;
	admin: string;
}

// Utility Types
export type TransactionStep = "sent" | "confirmed" | "success" | "error";

export interface TransactionDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	currentStep: TransactionStep;
	title: string;
	message: string;
}

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

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

// Wallet and Account Types
export interface WalletInfo {
	address: string;
	chainId: number;
	isConnected: boolean;
}

// Error Types
export interface ContractError {
	code: string;
	message: string;
	details?: any;
}

// Loading States
export interface LoadingState {
	isLoading: boolean;
	isError: boolean;
	error?: Error | null;
}

// Navigation Types
export interface NavigationItem {
	label: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	children?: NavigationItem[];
}
