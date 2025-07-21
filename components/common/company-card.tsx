import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

interface CompanyCardProps {
  company: {
    id: string | number;
    name: string;
    location: string;
    admin: string;
    website: string;
  };
}

const shortAddress = (address?: string) => {
  if (!address) return "";
  return address.slice(0, 8) + "..." + address.slice(-4);
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const router = useRouter();
  return (
    <div
      className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex flex-col justify-between cursor-pointer group"
      onClick={e => {
        // Nếu click vào nút bên trong, không chuyển trang
        if ((e.target as HTMLElement).closest("a,button")) return;
        router.push(`/review?id=${company.id}`);
      }}
    >
      <div>
        <div className="font-bold text-lg mb-1 group-hover:text-blue-700 transition">{company.name}</div>
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
      <div className="flex gap-2 mt-3">
        <Link href={`/review?id=${company.id}`}
          className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition text-center text-sm font-medium shadow">
         View reviews
        </Link>
        <Link href={`/review?id=${company.id}&write=1`}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center text-sm font-medium shadow">
         Write review
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard; 