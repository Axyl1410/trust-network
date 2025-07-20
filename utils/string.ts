/**
 * String utility functions
 */

/**
 * Formats a wallet address by showing first 6 and last 4 characters
 * @param address - The full wallet address
 * @returns Formatted address string (e.g., "0x1234...5678")
 */
export const formatAddress = (address: string): string => {
	if (!address || address.length < 10) return address;
	return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Capitalizes the first letter of a string
 * @param str - The input string
 * @returns String with first letter capitalized
 */
export const capitalize = (str: string): string => {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 * @param str - The input string
 * @returns String in title case
 */
export const toTitleCase = (str: string): string => {
	if (!str) return str;
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => capitalize(word))
		.join(" ");
};

/**
 * Truncates a string to a specified length
 * @param str - The input string
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number, suffix: string = "..."): string => {
	if (!str || str.length <= maxLength) return str;
	return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Removes HTML tags from a string
 * @param html - HTML string
 * @returns Plain text string
 */
export const stripHtml = (html: string): string => {
	if (!html) return html;
	return html.replace(/<[^>]*>/g, "");
};

/**
 * Converts a string to slug format
 * @param str - The input string
 * @returns Slug string
 */
export const toSlug = (str: string): string => {
	if (!str) return str;
	return str
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
};
