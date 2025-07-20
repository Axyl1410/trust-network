// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
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
	details?: unknown;
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

// Feed Post Types
export interface FeedPost {
	id: string;
	user: string;
	content: string;
	timestamp: bigint;
	likes: number;
	comments: number;
	shares: number;
}
