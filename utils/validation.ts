/**
 * Validation utility functions
 */

/**
 * Asserts that a value is not undefined
 * @param v - Value to check
 * @param errorMessage - Error message to throw if undefined
 * @returns The value if not undefined
 * @throws Error if value is undefined
 */
export function assertValue<T>(v: T | undefined, errorMessage: string): T {
	if (v === undefined) {
		throw new Error(errorMessage);
	}
	return v;
}

/**
 * Validates if a string is a valid email address
 * @param email - Email string to validate
 * @returns True if valid email, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
	if (!email) return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validates if a string is a valid Ethereum address
 * @param address - Address string to validate
 * @returns True if valid Ethereum address, false otherwise
 */
export const isValidEthereumAddress = (address: string): boolean => {
	if (!address) return false;
	const addressRegex = /^0x[a-fA-F0-9]{40}$/;
	return addressRegex.test(address);
};

/**
 * Validates if a string is a valid URL
 * @param url - URL string to validate
 * @returns True if valid URL, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
	if (!url) return false;
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

/**
 * Validates if a string is not empty and has minimum length
 * @param str - String to validate
 * @param minLength - Minimum length required (default: 1)
 * @returns True if valid, false otherwise
 */
export const isValidString = (str: string, minLength: number = 1): boolean => {
	return Boolean(str && str.trim().length >= minLength);
};

/**
 * Validates if a number is within a range
 * @param num - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range, false otherwise
 */
export const isInRange = (num: number, min: number, max: number): boolean => {
	return num >= min && num <= max;
};

/**
 * Validates if a rating is valid (1-5)
 * @param rating - Rating number to validate
 * @returns True if valid rating, false otherwise
 */
export const isValidRating = (rating: number): boolean => {
	return isInRange(rating, 1, 5);
};
