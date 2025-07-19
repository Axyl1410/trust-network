"use client";

import { cn } from "@/utils";
import { useId, useMemo } from "react";

function hexToNumber(hex: string): bigint {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	return hex === "" ? 0n : BigInt("0x" + hex);
}

const COLOR_OPTIONS = [
	["#fca5a5", "#b91c1c"],
	["#fdba74", "#c2410c"],
	["#fcd34d", "#b45309"],
	["#fde047", "#a16207"],
	["#a3e635", "#4d7c0f"],
	["#86efac", "#15803d"],
	["#67e8f9", "#0e7490"],
	["#7dd3fc", "#0369a1"],
	["#93c5fd", "#1d4ed8"],
	["#a5b4fc", "#4338ca"],
	["#c4b5fd", "#6d28d9"],
	["#d8b4fe", "#7e22ce"],
	["#f0abfc", "#a21caf"],
	["#f9a8d4", "#be185d"],
	["#fda4af", "#be123c"],
];

type Web3AvatarProps = {
	address: string;
	style?: Omit<React.CSSProperties, "backgroundImage">;
	className?: string;
	size?: number;
};

export function Web3Avatar(props: Web3AvatarProps) {
	const id = useId();
	const colors = useMemo(
		() =>
			COLOR_OPTIONS[Number(hexToNumber(props.address.slice(2, 4))) % COLOR_OPTIONS.length] as [
				string,
				string,
			],
		[props.address],
	);

	return (
		<div
			className={cn(
				props.className,
				"rounded-full",
				!props.address && "cursor-not-allowed opacity-80",
			)}
			id={id}
			style={{
				...props.style,
				backgroundImage: `radial-gradient(ellipse at left bottom, ${colors[0]}, ${colors[1]})`,
				...(props.size
					? {
							height: `${props.size}px`,
							width: `${props.size}px`,
						}
					: undefined),
			}}
		/>
	);
}
