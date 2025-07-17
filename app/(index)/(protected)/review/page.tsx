"use client"
import { useState } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";
import {
  Search,
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCircle2,
  PenLine,
  PlusCircle,
  Wallet,
} from "lucide-react";

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
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

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
    setCompanies(prev => [
      ...prev,
      { ...form, creator: account?.address }
    ]);
    setForm({ name: "", link: "", address: "" });
    setStep("search");
    setShowCreate(false);
    setCheckResult(null);
    setCompanyInfo(null);
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

  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    setStep("review");
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <PenLine className="text-blue-600" /> Write a Review
        </h1>
        <p className="text-gray-500">Search for a company or create a new one to review.</p>
      </div>
      {step === "search" && (
        <>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company or category"
                className="w-full border rounded-lg px-9 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-1">
              <Search size={18} /> Search
            </button>
          </form>
          {results.length === 0 && (
            <div className="text-center my-6 bg-white border rounded-lg p-6 shadow-sm">
              <p className="mb-2 text-gray-700">No company found. Would you like to create one to review?</p>
              <button
                className="mt-3 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition flex items-center gap-2"
                onClick={handleCreateClick}
                type="button"
              >
                <PlusCircle size={18} /> Create company to review
              </button>
            </div>
          )}
        </>
      )}

      {step === "create" && (
        <div className="mt-8 border rounded-xl p-6 bg-gray-50 shadow-md">
          <h2 className="font-bold mb-2 text-xl flex items-center gap-2">
            <Building2 className="text-blue-600" /> Create a new company
          </h2>
          <form onSubmit={handleCreate}>
            <div className="mb-3">
              <label className="block mb-1 font-medium flex items-center gap-1">
                <Globe size={16} /> Website link
              </label>
              <input
                value={form.link}
                onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
                required
                onBlur={handleCheckLink}
              />
              {checking && (
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Loader2 className="animate-spin" size={16} /> Checking...
                </div>
              )}
              {checkResult === "found" && (
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={16} /> Verified on Google/website.
                </div>
              )}
              {companyInfo && (
                <div className="mt-2 p-2 border rounded bg-white text-xs">
                  <div className="font-bold flex items-center gap-1">
                    <Building2 size={14} /> {companyInfo.title}
                  </div>
                  <div className="mb-1">{companyInfo.snippet}</div>
                  <a href={companyInfo.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
                    <Globe size={14} /> {companyInfo.link}
                  </a>
                  {companyInfo.link.includes('google.com/maps') && (
                    <div className="mt-1 flex items-center gap-1">
                      <MapPin size={14} /> <span className="font-semibold">Address:</span> {form.address}
                    </div>
                  )}
                </div>
              )}
              {checkResult === "notfound" && (
                <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <XCircle size={16} /> Not found. Please be careful when creating a new company.
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium flex items-center gap-1">
                <Building2 size={16} /> Company name
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium flex items-center gap-1">
                <MapPin size={16} /> Address
              </label>
              <input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
                placeholder="Company address or Google Maps link"
              />
            </div>
            <button className="mt-3 px-5 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition flex items-center gap-2">
              <PenLine size={16} /> Create & Write review
            </button>
          </form>
        </div>
      )}

      {companies.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">Created Companies</h3>
          <div className="space-y-2">
            {companies.map((c, idx) => (
              <div key={idx} className="border rounded p-3 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.address}</div>
                  <a href={c.link} className="text-blue-600 text-xs underline" target="_blank">{c.link}</a>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Wallet size={14} /> Created by: {shortAddress(c.creator)}
                  </div>
                </div>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition ml-4"
                  onClick={() => handleSelectCompany(c)}
                >
                  Write review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "review" && selectedCompany && (
        <div className="mt-8 border rounded-xl p-6 bg-gray-50 shadow-md">
          <h2 className="font-bold mb-2 text-xl flex items-center gap-2">
            <UserCircle2 className="text-blue-600" /> Write a review for <span className="text-blue-700">{selectedCompany.name}</span>
          </h2>
          <form onSubmit={handleSubmitReview}>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 min-h-[100px] shadow-sm focus:ring-2 focus:ring-blue-200"
              placeholder="Share your experience..."
              required
            />
            <button className="mt-3 px-5 py-2 bg-green-700 text-white rounded-lg font-semibold shadow hover:bg-green-800 transition flex items-center gap-2">
              <CheckCircle2 size={16} /> Submit review
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 