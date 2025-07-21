// Component Props Types
export interface CreateCommentProps {
	companyId: bigint;
	content: string;
	rating: bigint;
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

// Transaction Dialog Types
export type TransactionStep = "sent" | "confirmed" | "success" | "error";

export interface TransactionDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	currentStep: TransactionStep;
	title: string;
	message: string;
}
