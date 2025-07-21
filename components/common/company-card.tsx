import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useGetAverageRating } from "@/service/read-function/get-average-rating";

interface CompanyCardProps {
  company: {
    id: string | number;
    name: string;
    location: string;
    admin: string;
    website: string;
  };
  showRating?: boolean;
}

const shortAddress = (address?: string) => {
  if (!address) return "";
  return address.slice(0, 8) + "..." + address.slice(-4);
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company, showRating }) => {
  const router = useRouter();
  const { data: avgRaw } = useGetAverageRating(company.id ? BigInt(company.id) : 0n);
  const averageRating = avgRaw ? (Number(avgRaw)).toFixed(1) : null;
  const companyUrl = `/review/${company.id}`;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/review?id=${company.id}` : '';
  return (
    <div
      className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex flex-col justify-between cursor-pointer group relative"
      onClick={e => {
        if ((e.target as HTMLElement).closest("a,button")) return;
        router.push(`/review/${company.id}`);
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-lg group-hover:text-blue-700 transition">{company.name}</div>
          {showRating && (
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-base">
              {averageRating || "-"}
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500 mb-2">{company.location}</div>
        <div className="text-xs text-gray-400 mb-2">Admin: {shortAddress(company.admin)}</div>
        <div className="text-xs text-gray-400 mb-2">
          Website: {company.website ? (
            <a href={company.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{company.website}</a>
          ) : (
            <span className="text-gray-300">N/A</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 w-full">
        <button
          className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition text-center text-sm font-medium shadow"
          onClick={e => {
            e.stopPropagation();
            router.push(`/review/${company.id}`);
          }}
        >
          View reviews
        </button>
        <button
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center text-sm font-medium shadow"
          onClick={e => {
            e.stopPropagation();
            router.push(`/review/${company.id}?write=1`);
          }}
        >
          Write review
        </button>
        <button
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-800 transition shadow ml-auto"
          title="Share company"
          onClick={e => {
            e.stopPropagation();
            const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/review/${company.id}` : '';
            if (navigator.share) {
              navigator.share({ title: `Check out ${company.name} on Trust Network!`, url: shareUrl });
            } else {
              navigator.clipboard.writeText(shareUrl);
            }
          }}
          style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CompanyCard; 