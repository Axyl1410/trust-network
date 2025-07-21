"use client";

import CompanyCard from "@/components/common/company-card";
import { Web3Avatar } from "@/components/ui/web3-avatar";
import { useCompanyNameToId } from "@/service/read-function/company-name-to-id";
import { useGetAllCommentsOfCompany } from "@/service/read-function/get-all-comments-of-company";
import { useGetAllCompanies } from "@/service/read-function/get-all-companies";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [highlight, setHighlight] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const [chainCheck, setChainCheck] = useState<null | "checking" | "found" | "notfound">(null);
	const { data: allCompanies, isLoading: isLoadingCompanies } = useGetAllCompanies();
	const { data: companyId, isLoading } = useCompanyNameToId(search);
	const [searchedCompany, setSearchedCompany] = useState<any | null>(null);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [companyNameResults, setCompanyNameResults] = useState<any[]>([]);
	const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

	// Bảng thống kê reviewer
	const [reviewStats, setReviewStats] = useState<{
		topReviewers: { address: string; count: number }[];
		topReputation: { address: string; reputation: number }[];
	}>({ topReviewers: [], topReputation: [] });
	const [reputationMap, setReputationMap] = useState<Record<string, number>>({});

	// KOC thực tế
	const [koc, setKoc] = useState<{
		mostActive: { address: string; count: number; reputation: number | null }[];
		mostReputable: { address: string; reputation: number }[];
	}>({ mostActive: [], mostReputable: [] });

	// Hàm lấy thông tin công ty theo id từ allCompanies
	const findCompanyById = (id: string | number) => {
		if (!Array.isArray(allCompanies)) return null;
		return allCompanies.find((c: any) => c.id?.toString() === id?.toString());
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		if (value.trim()) {
			// Tìm công ty theo tên
			if (Array.isArray(allCompanies)) {
				const filteredCompanies = allCompanies.filter((c: any) =>
					c.name?.toLowerCase().includes(value.toLowerCase()),
				);
				setCompanyNameResults(filteredCompanies);
				setShowCompanyDropdown(filteredCompanies.length > 0);
			} else {
				setCompanyNameResults([]);
				setShowCompanyDropdown(false);
			}
		} else {
			setSuggestions([]);
			setShowDropdown(false);
			setCompanyNameResults([]);
			setShowCompanyDropdown(false);
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
		setSearchedCompany(null);
		setSearchError(null);

		// Kiểm tra trên chain
		if (!isLoading && companyId && companyId?.toString() !== "0") {
			setChainCheck("found");
			// Tìm thông tin công ty trong allCompanies
			const found = findCompanyById(companyId?.toString());
			if (found) {
				setSearchedCompany(found);
			} else {
				setSearchError("Could not find company information on the blockchain.");
			}
		} else {
			setChainCheck("notfound");
			setSearchError("Could not find company on the blockchain.");
		}
	};

	useEffect(() => {
		if (!search || search.trim() === "") {
			setSearchedCompany(null);
			setSearchError(null);
			setCompanyNameResults([]);
			return;
		}
		// Nếu có gợi ý category thì không tìm công ty
		if (suggestions.length > 0) {
			setSearchedCompany(null);
			setSearchError(null);
			setCompanyNameResults([]);
			return;
		}
		// Tìm theo tên công ty (lọc local)
		if (Array.isArray(allCompanies)) {
			const filtered = allCompanies.filter((c: any) =>
				c.name?.toLowerCase().includes(search.toLowerCase()),
			);
			setCompanyNameResults(filtered);
			if (filtered.length > 0) {
				setSearchedCompany(null);
				setSearchError(null);
				return;
			}
		}
		// Nếu không có công ty local phù hợp, fallback sang tìm trên blockchain (companyId)
		if (!isLoading && companyId !== undefined) {
			if (companyId && companyId.toString() !== "0") {
				const found = findCompanyById(companyId?.toString());
				if (found) {
					setSearchedCompany(found);
					setSearchError(null);
				} else {
					setSearchedCompany(null);
					setSearchError("Could not find company information on the blockchain.");
				}
			} else {
				setSearchedCompany(null);
				setSearchError("Could not find company on the blockchain.");
			}
		}
	}, [search, isLoading, companyId, allCompanies, suggestions]);

	useEffect(() => {
		async function calcStats() {
			if (!Array.isArray(allCompanies)) return;
			// Lấy tất cả review của tất cả công ty
			const allReviews: any[] = [];
			for (const c of allCompanies) {
				try {
					const res = await fetch(`/api/company-reviews?id=${c.id}`);
					if (res.ok) {
						const data = await res.json();
						if (Array.isArray(data)) allReviews.push(...data);
					}
				} catch {}
			}
			// Đếm số review theo author
			const countMap: Record<string, number> = {};
			allReviews.forEach((r) => {
				if (r.author) countMap[r.author] = (countMap[r.author] || 0) + 1;
			});
			// Top 5 reviewer nhiều nhất
			const topReviewers = Object.entries(countMap)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([address, count]) => ({ address, count }));
			// Lấy reputation từng author (gọi API hoặc contract)
			const repMap: Record<string, number> = {};
			for (const addr of Object.keys(countMap)) {
				try {
					const res = await fetch(`/api/reputation?address=${addr}`);
					if (res.ok) {
						const data = await res.json();
						repMap[addr] = Number(data.reputation) || 0;
					}
				} catch {}
			}
			// Top 5 reputation cao nhất
			const topReputation = Object.entries(repMap)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([address, reputation]) => ({ address, reputation }));
			setReviewStats({ topReviewers, topReputation });
			setReputationMap(repMap);
		}
		calcStats();
	}, [allCompanies]);

	useEffect(() => {
		async function calcKOC() {
			if (!Array.isArray(allCompanies)) return;
			// Lấy tất cả review của tất cả công ty
			const allReviews: any[] = [];
			for (const c of allCompanies) {
				try {
					const contract = (await import("@/service/get-contract")).default;
					const { Contract } = await import("@/constant/contract");
					const getThirdwebContract = contract;
					const contractInstance = getThirdwebContract(Contract);
					const { readContract } = await import("thirdweb");
					const reviews = await readContract({
						contract: contractInstance,
						method:
							"function getAllCommentsOfCompany(uint256 companyId) view returns ((uint256 id, address author, string content, uint256 createdAt, int256 votes, uint256 upvotes, uint256 downvotes, bool hidden, uint256 reportCount, uint256 rating, uint256 companyId)[])",
						params: [BigInt(c.id)],
					});
					if (Array.isArray(reviews)) allReviews.push(...reviews);
				} catch {}
			}
			// Đếm số review theo author
			const countMap: Record<string, number> = {};
			allReviews.forEach((r) => {
				if (r.author && /^0x[a-fA-F0-9]{40}$/.test(r.author))
					countMap[r.author] = (countMap[r.author] || 0) + 1;
			});
			// Top 5 reviewer nhiều nhất
			const mostActive = Object.entries(countMap)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([address, count]) => ({ address, count }));
			// Lấy reputation cho top 5 reviewer nhiều nhất
			const repResults = await Promise.all(
				mostActive.map(async (r) => {
					try {
						const contract = (await import("@/service/get-contract")).default;
						const { Contract } = await import("@/constant/contract");
						const getThirdwebContract = contract;
						const contractInstance = getThirdwebContract(Contract);
						const { readContract } = await import("thirdweb");
						const rep = await readContract({
							contract: contractInstance,
							method: "function getReputation(address user) view returns (int256)",
							params: [r.address],
						});
						return { ...r, reputation: Number(rep) || 0 };
					} catch (err) {
						console.error("Error fetching reputation for", r.address, err);
						return { ...r, reputation: null };
					}
				}),
			);
			// Top 5 theo reputation trong số reviewer nhiều nhất
			const mostReputable = [...repResults]
				.filter((r) => typeof r.reputation === "number" && !isNaN(r.reputation))
				.sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0))
				.slice(0, 5)
				.map((r) => ({ address: r.address, reputation: r.reputation ?? 0 }));
			setKoc({ mostActive: repResults, mostReputable });
		}
		setKoc({ mostActive: [], mostReputable: [] }); // clear khi loading
		calcKOC();
	}, [allCompanies]);

	// Tạo một component nhỏ để render từng item trong dropdown, fetch số lượng review
	type CompanyDropdownItemProps = {
		company: any;
		highlight: number;
		onClick: () => void;
		onMouseEnter: () => void;
		index: number;
	};
	function CompanyDropdownItem({
		company,
		highlight,
		onClick,
		onMouseEnter,
		index,
	}: CompanyDropdownItemProps) {
		let companyId: bigint | undefined = undefined;
		try {
			companyId = BigInt(company.id);
		} catch {}
		// Call hook unconditionally at the top level
		const { data: comments } = useGetAllCommentsOfCompany(companyId ?? BigInt(0));
		return (
			<li
				className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition ${index === highlight ? "bg-blue-50" : ""}`}
				onMouseDown={onClick}
				onMouseEnter={onMouseEnter}
				style={{ minHeight: 56 }}
			>
				{/* Icon tròn */}
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
					{company.name?.[0] || "🏢"}
				</div>
				{/* Thông tin công ty */}
				<div className="min-w-0 flex-1">
					<div className="truncate text-base font-semibold">{company.name}</div>
					{company.website && (
						<div className="truncate text-xs text-blue-600">{company.website}</div>
					)}
				</div>
				{/* Số lượng đánh giá */}
				<div className="ml-2 flex items-center gap-1 text-xs text-gray-500">
					<svg width="16" height="16" fill="none" viewBox="0 0 24 24">
						<path
							d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
							fill="#fbbf24"
						/>
					</svg>
					{companyId !== undefined && Array.isArray(comments) ? comments.length : "..."}
				</div>
				{/* Nút xem đánh giá */}
				<button
					className="ml-4 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow transition hover:bg-blue-700"
					tabIndex={-1}
				>
					View
				</button>
			</li>
		);
	}

	return (
		<div className="min-h-screen w-full bg-white">
			{/* Hero Section */}
			<section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-white px-2 pt-16 pb-8">
				{/* Decorative circles */}
				<div className="absolute top-0 left-0 h-72 w-72 -translate-x-1/3 -translate-y-1/3 rounded-full bg-yellow-100" />
				<div className="absolute top-1/3 right-0 h-60 w-60 translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-100" />
				<div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-green-100" />
				<h1 className="relative mt-8 mb-4 text-center text-5xl font-extrabold text-gray-900 sm:text-6xl">
					Find a company you can trust
				</h1>
				<p className="relative mb-8 text-center text-lg text-gray-500">
					Discover, read, and write reviews
				</p>
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
						onChange={(e) => {
							const value = e.target.value;
							setSearch(value);

							setHighlight(-1);
							setChainCheck(null);
						}}
						onFocus={() => search && setShowDropdown(true)}
						onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
						onKeyDown={(e) => {
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
					<div className="relative my-6 rounded-lg border bg-white p-6 text-center shadow-sm">
						<p className="mb-2 text-gray-700">
							Could not find company. Would you like to{" "}
							<Link href="/create-company" className="text-blue-600 underline">
								create a new company
							</Link>
							?
						</p>
					</div>
				)}
				{searchedCompany && (
					<div className="relative mx-auto mb-6 w-full max-w-xl">
						<CompanyCard company={searchedCompany} />
					</div>
				)}
				{searchError && (
					<div className="relative mx-auto mb-6 w-full max-w-xl rounded-lg border bg-white p-4 text-center text-red-600 shadow-sm">
						{searchError}
					</div>
				)}
				{showCompanyDropdown && companyNameResults.length > 0 && (
					<ul className="absolute top-full left-0 z-20 mt-2 max-h-80 w-full overflow-auto rounded-xl border bg-white py-2 shadow-lg">
						{companyNameResults.map((company, i) => (
							<CompanyDropdownItem
								key={company.id}
								company={company}
								highlight={highlight}
								index={i}
								onClick={() => {
									setSearch(company.name);
									setShowCompanyDropdown(false);
									setShowDropdown(false);
									router.push(`/review?query=${encodeURIComponent(company.name)}`);
								}}
								onMouseEnter={() => setHighlight(i)}
							/>
						))}
					</ul>
				)}
				{companyNameResults.length > 0 && !showCompanyDropdown && (
					<div className="relative mx-auto mb-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
						{companyNameResults.map((company) => (
							<CompanyCard key={company.id} company={company} />
						))}
					</div>
				)}
				<div className="relative mb-2 text-sm text-gray-500">
					Bought something recently?{" "}
					<Link href="/review" className="font-semibold text-blue-700 hover:underline">
						Write a review →
					</Link>
				</div>
			</section>

			{/* Category Grid */}
			{/* <section className="w-full max-w-6xl mx-auto px-2 pb-16">
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
      </section> */}
			{/* Companies on chain */}
			<section className="mx-auto w-full max-w-6xl px-2 pb-8">
				<h2 className="mb-2 text-xl font-bold">Leaderboard</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex flex-col items-center rounded-xl bg-white p-4 shadow">
						<h3 className="mb-2 font-semibold text-blue-700">Top 5 Most Active Reviewers</h3>
						{koc.mostActive.length === 0 ? (
							<span>Loading...</span>
						) : (
							<ol className="ml-5 w-full list-decimal space-y-3">
								{koc.mostActive.map((r, i) => (
									<li key={r.address} className="flex items-center gap-3">
										<Link href={`/profile/${r.address}`} className="flex items-center gap-2">
											<Web3Avatar address={r.address} className="h-10 w-10" />
											<span className="font-mono text-base">
												{r.address.slice(0, 8)}...{r.address.slice(-4)}
											</span>
											<span className="text-sm text-gray-500">{r.count} reviews</span>
											<span className="ml-2 text-xs font-semibold text-green-700">
												{typeof r.reputation === "number" ? `${r.reputation} rep` : "N/A"}
											</span>
										</Link>
									</li>
								))}
							</ol>
						)}
					</div>
					<div className="flex flex-col items-center rounded-xl bg-white p-4 shadow">
						<h3 className="mb-2 font-semibold text-green-700">Top 5 Highest Reputation</h3>
						{koc.mostReputable.length === 0 ? (
							<span>Loading...</span>
						) : (
							<ol className="ml-5 w-full list-decimal space-y-3">
								{koc.mostReputable.map((r, i) => (
									<li key={r.address} className="flex items-center gap-3">
										<Link href={`/profile/${r.address}`} className="flex items-center gap-2">
											<Web3Avatar address={r.address} className="h-10 w-10" />
											<span className="font-mono text-base">
												{r.address.slice(0, 8)}...{r.address.slice(-4)}
											</span>
											<span className="ml-2 text-xs font-semibold text-green-700">
												{typeof r.reputation === "number" ? `${r.reputation} rep` : "N/A"}
											</span>
										</Link>
									</li>
								))}
							</ol>
						)}
					</div>
				</div>
			</section>
			<section className="mx-auto w-full max-w-6xl px-2 pb-16">
				<h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Companies</h2>
				{isLoadingCompanies ? (
					<div className="text-center text-gray-500">Loading company list...</div>
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{Array.isArray(allCompanies) && allCompanies.length > 0 ? (
							allCompanies.map((company: any) => <CompanyCard key={company.id} company={company} />)
						) : (
							<div className="col-span-full text-center text-gray-500">
								No companies found on the blockchain.
							</div>
						)}
					</div>
				)}
			</section>
		</div>
	);
}
