/**
 * Date and time utility functions
 */

/**
 * Formats a timestamp (bigint) to a readable date string
 * @param timestamp - Unix timestamp in seconds
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export const formatTimestamp = (
	timestamp: bigint,
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	},
): string => {
	const date = new Date(Number(timestamp) * 1000);
	return date.toLocaleDateString(undefined, options);
};

/**
 * Formats a date to relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return "just now";
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

/**
 * Gets the current timestamp in seconds
 * @returns Current timestamp as bigint
 */
export const getCurrentTimestamp = (): bigint => {
	return BigInt(Math.floor(Date.now() / 1000));
};

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if date is today, false otherwise
 */
export const isToday = (date: Date): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

/**
 * Checks if a date is yesterday
 * @param date - Date to check
 * @returns True if date is yesterday, false otherwise
 */
export const isYesterday = (date: Date): boolean => {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return date.toDateString() === yesterday.toDateString();
};

/**
 * Formats a date for display with smart formatting
 * @param date - Date to format
 * @returns Smart formatted date string
 */
export const formatSmartDate = (date: Date): string => {
	if (isToday(date)) {
		return "Today";
	}
	if (isYesterday(date)) {
		return "Yesterday";
	}
	return formatTimestamp(BigInt(Math.floor(date.getTime() / 1000)));
};
