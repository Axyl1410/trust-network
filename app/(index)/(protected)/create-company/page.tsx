"use client";
import { useState } from "react";
import { Building2, Globe, MapPin, CheckCircle2, Loader2, Sparkles, FileText } from "lucide-react";
import CreateCompany from "@/service/write-function/create-company";

export default function CreateCompanyPage() {
  const [form, setForm] = useState({ name: "", link: "", address: "", description: "" });
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | "found" | "notfound">(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);


  // Hàm kiểm tra link
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

  // const handleGenerateDescription = async () => {
  //   if (!form.link) {
  //     alert("Please provide a website link first.");
  //     return;
  //   }
  //   setIsSummarizing(true);
  //   try {
  //     const res = await fetch('/api/summarize-url', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ url: form.link }),
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setForm(f => ({ ...f, description: data.summary }));
  //     } else {
  //       alert("Failed to generate description. Please try again.");
  //     }
  //   } catch (e) {
  //     alert("An error occurred while generating the description.");
  //   }
  //   setIsSummarizing(false);
  // };

  // Khi submit form, show CreateCompany
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Building2 className="text-blue-600" /> Create a new company
      </h1>
      <form onSubmit={handleSubmit} className="border rounded-xl p-6 bg-gray-50 shadow-md">
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
        </div>
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
          <label className="block mb-1 font-medium flex items-center gap-1">
            <FileText size={16} /> Company description
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 min-h-[120px] shadow-sm focus:ring-2 focus:ring-blue-200"
            required
            placeholder="Describe the company, its products, or services..."
          />
          <button
            type="button"
            // onClick={handleGenerateDescription}
            disabled={isSummarizing || !form.link}
            className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSummarizing ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Auto-generate description from website
              </>
            )}
          </button>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Address</label>
          <input
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        {/* <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
          Create
        </button> */}
      </form>
      { (
        <CreateCompany
          name={form.name}
          description={form.description}
          location={form.address}
          website={form.link}
        />
      )}
    </div>
  );
} 