import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * CSS and styling utility functions
 */

/**
 * Merges class names with Tailwind CSS conflict resolution
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Generates a gradient background style object
 * @param from - Starting color
 * @param to - Ending color
 * @param direction - Gradient direction (default: "to right")
 * @returns CSS style object
 */
export const createGradient = (
	from: string,
	to: string,
	direction: string = "to right",
): React.CSSProperties => ({
	background: `linear-gradient(${direction}, ${from}, ${to})`,
});

/**
 * Generates a radial gradient background style object
 * @param from - Starting color
 * @param to - Ending color
 * @param shape - Gradient shape (default: "circle")
 * @returns CSS style object
 */
export const createRadialGradient = (
	from: string,
	to: string,
	shape: string = "circle",
): React.CSSProperties => ({
	background: `radial-gradient(${shape}, ${from}, ${to})`,
});

/**
 * Creates a box shadow style object
 * @param x - Horizontal offset
 * @param y - Vertical offset
 * @param blur - Blur radius
 * @param spread - Spread radius
 * @param color - Shadow color
 * @returns CSS style object
 */
export const createBoxShadow = (
	x: number = 0,
	y: number = 0,
	blur: number = 0,
	spread: number = 0,
	color: string = "rgba(0, 0, 0, 0.1)",
): React.CSSProperties => ({
	boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}`,
});

/**
 * Generates responsive breakpoint classes
 * @param base - Base classes
 * @param sm - Small screen classes
 * @param md - Medium screen classes
 * @param lg - Large screen classes
 * @param xl - Extra large screen classes
 * @returns Merged class string
 */
export const responsive = (
	base: string,
	sm?: string,
	md?: string,
	lg?: string,
	xl?: string,
): string => {
	return cn(base, sm && `sm:${sm}`, md && `md:${md}`, lg && `lg:${lg}`, xl && `xl:${xl}`);
};
