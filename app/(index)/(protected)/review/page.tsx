"use client"
import { useState } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";

function shortAddress(address?: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function ReviewPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", link: "", address: "" });
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | "found" | "notfound">(null);
  const [review, setReview] = useState("");
  const [step, setStep] = useState<"search" | "create" | "review">("search");
  const [companyInfo, setCompanyInfo] = useState<any>(null);

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
      const res = await fetch('/api/verify-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: form.link })
      });
      const data = await res.json();
      if (data.verified) {
        setCheckResult('found');
        setCompanyInfo(data.info);
        setForm(f => ({
          ...f,
          name: f.name.trim() === '' ? data.info.title : f.name,
          link: data.info.link,
          address: (data.info.link.includes('google.com/maps') && data.info.snippet) ? data.info.snippet : f.address
        }));
      } else {
        setCheckResult('notfound');
        setCompanyInfo(null);
      }
    } catch (e) {
      setCheckResult('notfound');
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
    setShowCreate(false);
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
    setShowCreate(true);
    setStep("create");
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <span>📝</span> Write a Review
        </h1>
        <p className="text-gray-500">Search for a company or create a new one to review.</p>
      </div>
      {step === "search" && (
        <>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company or category"
              className="flex-1 border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Search</button>
          </form>

          {results.length === 0 && (
            <div className="text-center my-6 bg-white border rounded-lg p-6 shadow-sm">
              <p className="mb-2 text-gray-700">No company found. Would you like to create one to review?</p>
              <button
                className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
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
        <div className="mt-8 border rounded-xl p-6 bg-gray-50 shadow-md">
          <h2 className="font-bold mb-2 text-xl flex items-center gap-2"><span>🏢</span> Create a new company</h2>
          <form onSubmit={handleCreate}>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Company name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Website or Google Maps link</label>
              <input
                value={form.link}
                onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
                required
                onBlur={handleCheckLink}
              />
              {checking && <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><span className="animate-spin">⏳</span> Checking...</div>}
              {checkResult === "found" && (
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1"><span>✔️</span> Đã xác thực trên Google/website.</div>
              )}
              {companyInfo && (
                <div className="mt-2 p-2 border rounded bg-white text-xs">
                  <div className="font-bold">{companyInfo.title}</div>
                  <div className="mb-1">{companyInfo.snippet}</div>
                  <a href={companyInfo.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{companyInfo.link}</a>
                  {companyInfo.link.includes('google.com/maps') && (
                    <div className="mt-1"><span className="font-semibold">Địa chỉ:</span> {form.address}</div>
                  )}
                </div>
              )}
              {checkResult === "notfound" && (
                <div className="text-xs text-red-600 mt-1 flex items-center gap-1"><span>❌</span> Not found. Please be careful when creating a new company.</div>
              )}
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Địa chỉ</label>
              <input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
                placeholder="Địa chỉ doanh nghiệp"
              />
            </div>
            <button className="mt-3 px-5 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition">Create & Write review</button>
          </form>
        </div>
      )}

      {step === "review" && (
        <div className="mt-8 border rounded-xl p-6 bg-gray-50 shadow-md">
          <h2 className="font-bold mb-2 text-xl flex items-center gap-2"><span>✍️</span> Write a review for <span className="text-blue-700">{form.name}</span></h2>
          <form onSubmit={handleSubmitReview}>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 min-h-[100px] shadow-sm focus:ring-2 focus:ring-blue-200"
              placeholder="Share your experience..."
              required
            />
            <button className="mt-3 px-5 py-2 bg-green-700 text-white rounded-lg font-semibold shadow hover:bg-green-800 transition">Submit review</button>
          </form>
        </div>
      )}
    </div>
  );
} 