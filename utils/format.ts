import { formatTimestamp } from "./date";
import { formatAddress } from "./string";

/**
 * Application-specific formatting functions
 */

/**
 * Formats a rating number to star display
 * @param rating - Rating number (1-5)
 * @returns Star string representation
 */
export const formatRating = (rating: number): string => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars);
};

/**
 * Formats a number with appropriate suffix (K, M, B)
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
	if (num >= 1000000000) {
		return (num / 1000000000).toFixed(1) + "B";
	}
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toString();
};

/**
 * Formats a company name for display
 * @param name - Company name
 * @returns Formatted company name
 */
export const formatCompanyName = (name: string): string => {
	if (!name) return "Unknown Company";
	return name.trim();
};

/**
 * Formats a comment content for display
 * @param content - Comment content
 * @param maxLength - Maximum length before truncation
 * @returns Formatted comment content
 */
export const formatCommentContent = (content: string, maxLength: number = 200): string => {
	if (!content) return "";
	if (content.length <= maxLength) return content;
	return content.substring(0, maxLength) + "...";
};

/**
 * Formats a user display name from address
 * @param address - User's wallet address
 * @returns Formatted display name
 */
export const formatUserDisplayName = (address: string): string => {
	if (!address) return "Anonymous";
	return formatAddress(address);
};

/**
 * Formats a timestamp for comment display
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export const formatCommentDate = (timestamp: bigint): string => {
	return formatTimestamp(timestamp, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * Formats a website URL for display
 * @param url - Website URL
 * @returns Formatted URL string
 */
export const formatWebsiteUrl = (url: string): string => {
	if (!url) return "";
	try {
		const urlObj = new URL(url);
		return urlObj.hostname.replace("www.", "");
	} catch {
		return url;
	}
};
