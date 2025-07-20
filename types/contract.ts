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

export interface StatusUpdatedEvent {
	user: string;
	newStatus: string;
	timestamp: bigint;
}
