"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCompanyNameToId } from "@/service/read-function/company-name-to-id";
import { useGetAllCompanies } from "@/service/read-function/get-all-companies";
import { useGetAllCommentsOfCompany } from "@/service/read-function/get-all-comments-of-company";
import CompanyCard from "@/components/common/company-card";

// const categories = [
// 	{ icon: "🏦", name: "Bank" },
// 	{ icon: "✈️", name: "Travel Insurance Company" },
// 	{ icon: "🚗", name: "Car Dealer" },
// 	{ icon: "🛋️", name: "Furniture Store" },
// 	{ icon: "💎", name: "Jewelry Store" },
// 	{ icon: "👕", name: "Clothing Store" },
// 	{ icon: "📱", name: "Electronics & Technology" },
// 	{ icon: "🥗", name: "Fitness and Nutrition Service" },
// 	{ icon: "❤️", name: "Health & Beauty" },
// 	{ icon: "🏠", name: "Home Services" },
// 	{ icon: "🛒", name: "Online Shopping" },
// 	{ icon: "🍽️", name: "Restaurants" },
// ];



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

  // const allSuggestions = categories.map(c => c.name);

  // Hàm lấy thông tin công ty theo id từ allCompanies
  const findCompanyById = (id: string | number) => {
    if (!Array.isArray(allCompanies)) return null;
    return allCompanies.find((c: any) => c.id?.toString() === id?.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      // const filtered = allSuggestions.filter((s) =>
      //   s.toLowerCase().includes(value.toLowerCase())
      // );
      // setSuggestions(filtered);
      // setShowDropdown(filtered.length > 0);
      // Tìm công ty theo tên
      if (Array.isArray(allCompanies)) {
        const filteredCompanies = allCompanies.filter((c: any) =>
          c.name?.toLowerCase().includes(value.toLowerCase())
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
    if (!isLoading && companyId && companyId?.toString() !== '0') {
      setChainCheck("found");
      // Tìm thông tin công ty trong allCompanies
      const found = findCompanyById(companyId?.toString());
      if (found) {
        setSearchedCompany(found);
      } else {
        setSearchError("Không tìm thấy thông tin công ty trên blockchain.");
      }
    } else {
      setChainCheck("notfound");
      setSearchError("Không tìm thấy công ty trên blockchain.");
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
        c.name?.toLowerCase().includes(search.toLowerCase())
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
          setSearchError("Không tìm thấy thông tin công ty trên blockchain.");
        }
      } else {
        setSearchedCompany(null);
        setSearchError("Không tìm thấy công ty trên blockchain.");
      }
    }
  }, [search, isLoading, companyId, allCompanies, suggestions]);

  // Tạo một component nhỏ để render từng item trong dropdown, fetch số lượng review
  type CompanyDropdownItemProps = {
    company: any;
    highlight: number;
    onClick: () => void;
    onMouseEnter: () => void;
    index: number;
  };
  function CompanyDropdownItem({ company, highlight, onClick, onMouseEnter, index }: CompanyDropdownItemProps) {
    let companyId: bigint | undefined = undefined;
    try {
      companyId = BigInt(company.id);
    } catch {}
    const { data: comments } = companyId !== undefined ? useGetAllCommentsOfCompany(companyId) : { data: undefined };
    return (
      <li
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition rounded-xl ${index === highlight ? "bg-blue-50" : ""}`}
        onMouseDown={onClick}
        onMouseEnter={onMouseEnter}
        style={{ minHeight: 56 }}
      >
        {/* Icon tròn */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xl">
          {company.name?.[0] || "🏢"}
        </div>
        {/* Thông tin công ty */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base truncate">{company.name}</div>
          {company.website && (
            <div className="text-xs text-blue-600 truncate">{company.website}</div>
          )}
        </div>
        {/* Số lượng đánh giá */}
        <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24"/></svg>
          {companyId !== undefined && Array.isArray(comments) ? comments.length : "..."}
        </div>
        {/* Nút xem đánh giá */}
        <button
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition shadow"
          tabIndex={-1}
        >
          View 
        </button>
      </li>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-8 px-2 bg-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute left-0 top-0 w-72 h-72 bg-yellow-100 rounded-full -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute right-0 top-1/3 w-60 h-60 bg-orange-100 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-green-100 rounded-full translate-x-1/3 translate-y-1/3" />
        <h1 className="relative text-5xl sm:text-6xl font-extrabold text-center text-gray-900 mb-4 mt-8">Find a company you can trust</h1>
        <p className="relative text-lg text-gray-500 text-center mb-8">Discover, read, and write reviews</p>
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
          <div className="relative text-center my-6 bg-white border rounded-lg p-6 shadow-sm">
            <p className="mb-2 text-gray-700">Không tìm thấy công ty. Bạn muốn <Link href="/create-company" className="text-blue-600 underline">tạo mới doanh nghiệp</Link>?</p>
          </div>
        )}
        {searchedCompany && (
          <div className="relative w-full max-w-xl mx-auto mb-6">
            <CompanyCard company={searchedCompany} />
          </div>
        )}
        {searchError && (
          <div className="relative w-full max-w-xl mx-auto mb-6 text-center text-red-600 bg-white border rounded-lg p-4 shadow-sm">
            {searchError}
          </div>
        )}
        {showCompanyDropdown && companyNameResults.length > 0 && (
          <ul className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-20 max-h-80 overflow-auto py-2">
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
          <div className="relative w-full max-w-2xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {companyNameResults.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
        <div className="relative text-sm text-gray-500 mb-2">
          Bought something recently?{' '}
          <Link href="/review" className="text-blue-700 font-semibold hover:underline">Write a review →</Link>
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
      <section className="w-full max-w-6xl mx-auto px-2 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Companies</h2>
        {isLoadingCompanies ? (
          <div className="text-center text-gray-500">Đang tải danh sách công ty...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(allCompanies) && allCompanies.length > 0 ? (
              allCompanies.map((company: any) => (
                <CompanyCard key={company.id} company={company} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">Chưa có công ty nào trên blockchain.</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
