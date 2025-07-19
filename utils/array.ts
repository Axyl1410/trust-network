/**
 * Array utility functions
 */

/**
 * Removes duplicate items from an array
 * @param array - Array to deduplicate
 * @returns Array with unique items
 */
export const unique = <T>(array: T[]): T[] => {
	return [...new Set(array)];
};

/**
 * Groups array items by a key function
 * @param array - Array to group
 * @param keyFn - Function to extract key from item
 * @returns Object with grouped items
 */
export const groupBy = <T, K extends string | number>(
	array: T[],
	keyFn: (item: T) => K,
): Record<K, T[]> => {
	return array.reduce(
		(groups, item) => {
			const key = keyFn(item);
			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(item);
			return groups;
		},
		{} as Record<K, T[]>,
	);
};

/**
 * Sorts array by multiple criteria
 * @param array - Array to sort
 * @param sortFns - Array of sort functions
 * @returns Sorted array
 */
export const sortByMultiple = <T>(array: T[], ...sortFns: ((a: T, b: T) => number)[]): T[] => {
	return [...array].sort((a, b) => {
		for (const sortFn of sortFns) {
			const result = sortFn(a, b);
			if (result !== 0) return result;
		}
		return 0;
	});
};

/**
 * Chunks an array into smaller arrays
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

/**
 * Flattens a nested array
 * @param array - Array to flatten
 * @returns Flattened array
 */
export const flatten = <T>(array: T[][]): T[] => {
	return array.reduce((flat, item) => flat.concat(item), [] as T[]);
};

/**
 * Finds the first item that matches a predicate
 * @param array - Array to search
 * @param predicate - Function to test each item
 * @returns First matching item or undefined
 */
export const findFirst = <T>(
	array: T[],
	predicate: (item: T, index: number) => boolean,
): T | undefined => {
	return array.find(predicate);
};

/**
 * Filters array and returns both matching and non-matching items
 * @param array - Array to partition
 * @param predicate - Function to test each item
 * @returns Tuple of [matching, non-matching] arrays
 */
export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
	return array.reduce(
		([pass, fail], item) => {
			return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
		},
		[[], []] as [T[], T[]],
	);
};
