"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useCompanyNameToId } from "@/service/read-function/company-name-to-id";

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
  const [chainCheck, setChainCheck] = useState<null | "checking" | "found" | "notfound">(null);

  const { data: companyId, isLoading } = useCompanyNameToId(search);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChainCheck("checking");
    // Nếu có trong local suggestions thì chuyển luôn
    if (suggestions.includes(search)) {
      router.push(`/review?query=${encodeURIComponent(search)}`);
      return;
    }
    // Kiểm tra trên chain
    if (!isLoading && companyId && companyId?.toString() !== '0') {
      setChainCheck("found");
      router.push(`/review?query=${encodeURIComponent(search)}`);
    } else {
      setChainCheck("notfound");
    }
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
            onChange={e => {
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
              setChainCheck(null);
            }}
            onFocus={() => search && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
            onKeyDown={e => {
              if (!showDropdown || suggestions.length === 0) return;
              if (e.key === "ArrowDown") {
                setHighlight((h) => (h + 1) % suggestions.length);
              } else if (e.key === "ArrowUp") {
                setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
              } else if (e.key === "Enter") {
                if (highlight >= 0 && highlight < suggestions.length) {
                  setSearch(suggestions[highlight]);
                  setShowDropdown(false);
                  router.push(`/review?query=${encodeURIComponent(suggestions[highlight])}`);
                } else {
                  handleSubmit(e as any);
                }
              }
            }}
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
                  onMouseDown={() => {
                    setSearch(s);
                    setShowDropdown(false);
                    router.push(`/review?query=${encodeURIComponent(s)}`);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </form>
        {chainCheck === "notfound" && (
          <div className="text-center my-6 bg-white border rounded-lg p-6 shadow-sm">
            <p className="mb-2 text-gray-700">Không tìm thấy công ty. Bạn muốn <Link href="/create-company" className="text-blue-600 underline">tạo mới doanh nghiệp</Link>?</p>
          </div>
        )}
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
}
