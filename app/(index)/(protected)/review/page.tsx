"use client";
import { thirdwebClient } from "@/lib/thirdweb";
import { useState } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";

// Define proper types for the data structures
interface CompanyInfo {
	title: string;
	snippet: string;
	link: string;
}

interface SearchResult {
	id: string;
	name: string;
	// Add other properties as needed
}

interface FormData {
	name: string;
	link: string;
	address: string;
}

export default function ReviewPage() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [form, setForm] = useState<FormData>({ name: "", link: "", address: "" });
	const [checking, setChecking] = useState(false);
	const [checkResult, setCheckResult] = useState<null | "found" | "notfound">(null);
	const [review, setReview] = useState("");
	const [step, setStep] = useState<"search" | "create" | "review">("search");
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

	const account = useActiveAccount();
	const { connect } = useConnectModal();

	// Simulate search
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: call API search company
		setResults([]); // simulate not found
		setStep("search");
	};

	// Check website/Google Maps link
	const handleCheckLink = async () => {
		setChecking(true);
		setCheckResult(null);
		setCompanyInfo(null);
		try {
			const res = await fetch("/api/verify-link", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ website: form.link }),
			});
			const data = await res.json();
			if (data.verified) {
				setCheckResult("found");
				setCompanyInfo(data.info);
				setForm((f) => ({
					...f,
					name: f.name.trim() === "" ? data.info.title : f.name,
					link: data.info.link,
					address:
						data.info.link.includes("google.com/maps") && data.info.snippet
							? data.info.snippet
							: f.address,
				}));
			} else {
				setCheckResult("notfound");
				setCompanyInfo(null);
			}
		} catch {
			setCheckResult("notfound");
			setCompanyInfo(null);
		}
		setChecking(false);
	};

	// Handle create company
	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		setStep("review");
	};

	// Handle submit review
	const handleSubmitReview = (e: React.FormEvent) => {
		e.preventDefault();
		alert("Thank you for your review!");
		setStep("search");
		setForm({ name: "", link: "", address: "" });
		setReview("");
		setCheckResult(null);
	};

	// Khi nhấn nút tạo công ty, kiểm tra ví
	const handleCreateClick = () => {
		if (!account) {
			connect({ client: thirdwebClient });
			return;
		}
		setStep("create");
	};

	return (
		<div className="mx-auto max-w-xl py-8">
			<div className="mb-8 text-center">
				<h1 className="mb-2 flex items-center justify-center gap-2 text-3xl font-extrabold text-gray-900">
					<span>📝</span> Write a Review
				</h1>
				<p className="text-gray-500">Search for a company or create a new one to review.</p>
			</div>
			{step === "search" && (
				<>
					<form onSubmit={handleSearch} className="mb-4 flex gap-2">
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search company or category"
							className="flex-1 rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
						/>
						<button
							type="submit"
							className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
						>
							Search
						</button>
					</form>

					{results.length === 0 && (
						<div className="my-6 rounded-lg border bg-white p-6 text-center shadow-sm">
							<p className="mb-2 text-gray-700">
								No company found. Would you like to create one to review?
							</p>
							<button
								className="mt-3 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-green-700"
								onClick={handleCreateClick}
								type="button"
							>
								<span className="mr-2">➕</span> Create company to review
							</button>
						</div>
					)}
				</>
			)}

			{step === "create" && (
				<div className="mt-8 rounded-xl border bg-gray-50 p-6 shadow-md">
					<h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
						<span>🏢</span> Create a new company
					</h2>
					<form onSubmit={handleCreate}>
						<div className="mb-3">
							<label className="mb-1 block font-medium">Company name</label>
							<input
								value={form.name}
								onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
								className="w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
								required
							/>
						</div>
						<div className="mb-3">
							<label className="mb-1 block font-medium">Website or Google Maps link</label>
							<input
								value={form.link}
								onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
								className="w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
								required
								onBlur={handleCheckLink}
							/>
							{checking && (
								<div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
									<span className="animate-spin">⏳</span> Checking...
								</div>
							)}
							{checkResult === "found" && (
								<div className="mt-1 flex items-center gap-1 text-xs text-green-600">
									<span>✔️</span> Đã xác thực trên Google/website.
								</div>
							)}
							{companyInfo && (
								<div className="mt-2 rounded border bg-white p-2 text-xs">
									<div className="font-bold">{companyInfo.title}</div>
									<div className="mb-1">{companyInfo.snippet}</div>
									<a
										href={companyInfo.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 underline"
									>
										{companyInfo.link}
									</a>
									{companyInfo.link.includes("google.com/maps") && (
										<div className="mt-1">
											<span className="font-semibold">Địa chỉ:</span> {form.address}
										</div>
									)}
								</div>
							)}
							{checkResult === "notfound" && (
								<div className="mt-1 flex items-center gap-1 text-xs text-red-600">
									<span>❌</span> Not found. Please be careful when creating a new company.
								</div>
							)}
						</div>
						<div className="mb-3">
							<label className="mb-1 block font-medium">Địa chỉ</label>
							<input
								value={form.address}
								onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
								className="w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
								placeholder="Địa chỉ doanh nghiệp"
							/>
						</div>
						<button className="mt-3 rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white shadow transition hover:bg-blue-800">
							Create & Write review
						</button>
					</form>
				</div>
			)}

			{step === "review" && (
				<div className="mt-8 rounded-xl border bg-gray-50 p-6 shadow-md">
					<h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
						<span>✍️</span> Write a review for <span className="text-blue-700">{form.name}</span>
					</h2>
					<form onSubmit={handleSubmitReview}>
						<textarea
							value={review}
							onChange={(e) => setReview(e.target.value)}
							className="min-h-[100px] w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
							placeholder="Share your experience..."
							required
						/>
						<button className="mt-3 rounded-lg bg-green-700 px-5 py-2 font-semibold text-white shadow transition hover:bg-green-800">
							Submit review
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
