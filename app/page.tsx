"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const categories = [
	{ icon: "🏦", name: "Bank" },
	{ icon: "✈️", name: "Travel Insurance Company" },
	{ icon: "🚗", name: "Car Dealer" },
	{ icon: "🛋️", name: "Furniture Store" },
	{ icon: "💎", name: "Jewelry Store" },
	{ icon: "👕", name: "Clothing Store" },
	{ icon: "📱", name: "Electronics & Technology" },
	{ icon: "🥗", name: "Fitness and Nutrition Service" },
	{ icon: "❤️", name: "Health & Beauty" },
	{ icon: "🏠", name: "Home Services" },
	{ icon: "🛒", name: "Online Shopping" },
	{ icon: "🍽️", name: "Restaurants" },
];

const allSuggestions = categories.map((c) => c.name);

export default function HomePage() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [highlight, setHighlight] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		if (value.trim()) {
			setSuggestions(allSuggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())));
			setShowDropdown(true);
		} else {
			setSuggestions([]);
			setShowDropdown(false);
		}
		setHighlight(-1);
	};

	const handleSelect = (value: string) => {
		setSearch(value);
		setShowDropdown(false);
		router.push(`/review?query=${encodeURIComponent(value)}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!showDropdown || suggestions.length === 0) return;
		if (e.key === "ArrowDown") {
			setHighlight((h) => (h + 1) % suggestions.length);
		} else if (e.key === "ArrowUp") {
			setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
		} else if (e.key === "Enter") {
			if (highlight >= 0 && highlight < suggestions.length) {
				handleSelect(suggestions[highlight]);
			} else {
				router.push(`/review?query=${encodeURIComponent(search)}`);
			}
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		router.push(`/review?query=${encodeURIComponent(search)}`);
	};

	return (
		<div className="min-h-screen w-full bg-white">
			{/* Hero Section */}
			<section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-white px-2 pt-16 pb-8">
				{/* Decorative circles */}
				<div className="absolute top-0 left-0 -z-10 h-72 w-72 -translate-x-1/3 -translate-y-1/3 rounded-full bg-yellow-200" />
				<div className="absolute top-1/3 right-0 -z-10 h-60 w-60 translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-200" />
				<div className="absolute right-0 bottom-0 -z-10 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-green-200" />
				<h1 className="mt-8 mb-4 text-center text-5xl font-extrabold text-gray-900 sm:text-6xl">
					Find a company you can trust
				</h1>
				<p className="mb-8 text-center text-lg text-gray-500">Discover, read, and write reviews</p>
				{/* Search bar with suggestions */}
				<form
					onSubmit={handleSubmit}
					className="relative mx-auto mb-3 flex w-full max-w-xl items-center rounded-full border bg-white px-4 py-2 shadow-lg"
					autoComplete="off"
				>
					<input
						ref={inputRef}
						type="text"
						value={search}
						onChange={handleChange}
						onFocus={() => search && setShowDropdown(true)}
						onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
						onKeyDown={handleKeyDown}
						placeholder="Search company or category"
						className="flex-1 border-0 bg-transparent px-2 py-2 text-base outline-none"
					/>
					<button
						type="submit"
						className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white transition hover:bg-blue-800"
					>
						<Search size={20} />
					</button>
					{showDropdown && suggestions.length > 0 && (
						<ul className="absolute top-full left-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow">
							{suggestions.map((s, i) => (
								<li
									key={s}
									className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${i === highlight ? "bg-blue-100" : ""}`}
									onMouseDown={() => handleSelect(s)}
									onMouseEnter={() => setHighlight(i)}
								>
									{s}
								</li>
							))}
						</ul>
					)}
				</form>
				<div className="mb-2 text-sm text-gray-500">
					Bought something recently?{" "}
					<Link href="/review" className="font-semibold text-blue-700 hover:underline">
						Write a review →
					</Link>
				</div>
			</section>

			{/* Category Grid */}
			<section className="mx-auto w-full max-w-6xl px-2 pb-16">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
						What are you looking for?
					</h2>
					<Link
						href="#"
						className="rounded border bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
					>
						See more
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{categories.map((cat) => (
						<div
							key={cat.name}
							className="flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-white px-2 py-6 shadow-sm transition hover:shadow-md"
						>
							<span className="mb-2 text-3xl">{cat.icon}</span>
							<span className="text-center text-base leading-tight font-medium text-gray-800">
								{cat.name}
							</span>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
