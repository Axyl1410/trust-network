"use client";

import { useState, useEffect } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompanies } from "@/service/read-function/companies";
import { useGetAllCommentsOfCompany } from "@/service/read-function/get-all-comments-of-company";
import CreateComment from "@/service/write-function/create-comment";
import { UpvoteButton, DownvoteButton } from "@/service/write-function/vote";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { PenLine } from "lucide-react";
import { useGetAverageRating } from "@/service/read-function/get-average-rating";
import { useGetCompanyRatingStats } from "@/service/read-function/get-company-rating-stats";
import { useGetReputation } from "@/service/read-function/get-reputation";
import { SEPOLIA } from "@/constant/chain";
import { useWalletBalance } from "thirdweb/react";
import ReviewList from "@/components/common/ReviewList";
import CompanyCard from "@/components/common/company-card";
import { useGetAllCompanies } from "@/service/read-function/get-all-companies";
import { Search } from "lucide-react";
import Link from "next/link";

export default function ReviewPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [companyNameResults, setCompanyNameResults] = useState<any[]>([]);
  const { data: allCompanies, isLoading: isLoadingCompanies } = useGetAllCompanies();

  // Lọc công ty theo search
  const filteredCompanies = search.trim()
    ? (allCompanies || []).filter((c: any) => c.name?.toLowerCase().includes(search.toLowerCase()))
    : allCompanies || [];

  // Xử lý search input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() && Array.isArray(allCompanies)) {
      const filtered = allCompanies.filter((c: any) => c.name?.toLowerCase().includes(value.toLowerCase()));
      setCompanyNameResults(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setCompanyNameResults([]);
      setShowDropdown(false);
    }
    setHighlight(-1);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <div className="flex gap-2 items-center">
          <Link href="/create-company" className="px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700 transition">Create Company</Link>
        </div>
      </div>
      {/* Search bar */}
      <form className="w-full max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg px-4 py-2 mb-6 border relative" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search company by name"
          className="flex-1 bg-transparent outline-none border-0 text-base px-2 py-2"
        />
        <button type="submit" className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition ml-2">
          <Search size={20} />
        </button>
      </form>
      {isLoadingCompanies ? (
        <div className="text-center text-gray-500">Loading company list...</div>
      ) : Array.isArray(filteredCompanies) && filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCompanies.map((company: any) => (
            <CompanyCard key={company.id} company={company} showRating />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No companies found on the blockchain.</div>
      )}
    </div>
  );
} 
