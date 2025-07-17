"use client";

<<<<<<< HEAD

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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

const allSuggestions = categories.map(c => c.name);

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
      setSuggestions(
        allSuggestions.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      );
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
    <div className="w-full min-h-screen bg-white">

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-8 px-2 bg-white relative overflow-x-hidden">
        {/* Decorative circles */}
        <div className="absolute left-0 top-0 w-72 h-72 bg-yellow-100 rounded-full -z-10 -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute right-0 top-1/3 w-60 h-60 bg-orange-100 rounded-full -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-green-100 rounded-full -z-10 translate-x-1/3 translate-y-1/3" />
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-gray-900 mb-4 mt-8">Find a company you can trust</h1>
        <p className="text-lg text-gray-500 text-center mb-8">Discover, read, and write reviews</p>
        {/* Search bar with suggestions */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg px-4 py-2 mb-3 border relative"
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
            className="flex-1 bg-transparent outline-none border-0 text-base px-2 py-2"
          />
          <button type="submit" className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition ml-2">
            <Search size={20} />
          </button>
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-10 max-h-60 overflow-auto">
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${i === highlight ? "bg-blue-100" : ""}`}
                  onMouseDown={() => handleSelect(s)}
                  onMouseEnter={() => setHighlight(i)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </form>
        <div className="text-sm text-gray-500 mb-2">
          Bought something recently?{' '}
          <Link href="/review" className="text-blue-700 font-semibold hover:underline">Write a review →</Link>
        </div>
      </section>

      {/* Category Grid */}
      <section className="w-full max-w-6xl mx-auto px-2 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What are you looking for?</h2>
          <Link href="#" className="px-4 py-2 rounded border text-gray-700 bg-white hover:bg-gray-50 transition text-sm">See more</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center justify-center rounded-xl border bg-white py-6 px-2 shadow-sm hover:shadow-md transition cursor-pointer">
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-base font-medium text-gray-800 text-center leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
=======
import { WalletConnectButton } from "@/components/common/wallet-button";
import { thirdwebClient } from "@/lib/thirdweb";
import CreateComment from "@/service/write-function/create-comment";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";

export default function Home() {
	return (
		<div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
			<WalletConnectButton />
			<div className="sr-only">
				<ConnectButton client={thirdwebClient} />
			</div>
			<CreateComment companyId={0n} content={""} />
			<main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<ol className="list-inside list-decimal text-center font-mono text-sm/6 sm:text-left">
					<li className="mb-2 tracking-[-.01em]">
						Get started by editing{" "}
						<code className="rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]">
							app/page.tsx
						</code>
						.
					</li>
					<li className="tracking-[-.01em]">Save and see your changes instantly.</li>
				</ol>

				<div className="flex flex-col items-center gap-4 sm:flex-row">
					<a
						className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							className="dark:invert"
							src="/vercel.svg"
							alt="Vercel logomark"
							width={20}
							height={20}
						/>
						Deploy now
					</a>
					<a
						className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Read our docs
					</a>
				</div>
			</main>
			<footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
					Learn
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
					Examples
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
					Go to nextjs.org →
				</a>
			</footer>
		</div>
	);
>>>>>>> origin/dev
}
