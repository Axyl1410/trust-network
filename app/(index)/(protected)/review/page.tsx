"use client";

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
import { useRouter, useSearchParams } from "next/navigation";
import { useCompanyNameToId } from "@/service/read-function/company-name-to-id";
import { useCompanies } from "@/service/read-function/companies";
import { useGetAllCommentsOfCompany } from "@/service/read-function/get-all-comments-of-company";
import CreateComment from "@/service/write-function/create-comment";
import { UpvoteButton, DownvoteButton } from "@/service/write-function/vote";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

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
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const account = useActiveAccount();
  const { connect } = useConnectModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyQuery = searchParams.get("query") || "";
  const companyIdParam = searchParams.get("id");
  const companyIdBigInt = companyIdParam ? BigInt(companyIdParam) : null;
  const { data: queriedCompanyInfo, isLoading: isCompanyLoading } = companyIdBigInt ? useCompanies(companyIdBigInt) : { data: null, isLoading: false };
  const { data: reviews } = companyIdBigInt ? useGetAllCommentsOfCompany(companyIdBigInt) : { data: [] };
  const writeMode = searchParams.get("write") === "1";

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const fetchSummary = async () => {
        setIsSummarizing(true);
        try {
          const reviewContents = reviews.map((r: any) => r.content);
          const res = await fetch('/api/summarize-reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviews: reviewContents }),
          });
          if (res.ok) {
            const data = await res.json();
            setSummary(data.summary);
          }
        } catch (error) {
          console.error("Failed to fetch summary:", error);
          setSummary("Could not generate a summary at this time.");
        }
        setIsSummarizing(false);
      };
      fetchSummary();
    }
  }, [reviews]);
  
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

  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    setStep("review");
  };

  if (!companyIdBigInt) {
    return <div className="text-center py-8 text-gray-500">Please select a company to see the details.</div>;
  }
  if (isCompanyLoading) {
    return <div className="text-center py-8">Loading company information...</div>;
  }
  if (!queriedCompanyInfo) {
    return <div className="text-center py-8 text-red-500">Company information not found.</div>;
  }
  if (companyIdBigInt && writeMode) {
    const [id, name, description, location, website, admin] = queriedCompanyInfo || [];

    // Function to reload reviews (by refreshing router)
    const handleReviewSuccess = () => {
      setShowReviewModal(false);
      router.refresh();
    };

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6 border rounded-xl p-6 bg-white shadow">
          <div className="font-bold text-2xl mb-1">{name}</div>
          <div className="text-sm text-gray-500 mb-1">{location}</div>
          <div className="text-xs text-gray-400 mb-1">Admin: {admin}</div>
          <div className="text-xs text-gray-400 mb-1">Website: {website}</div>
        </div>
        <div className="mt-8 border rounded-xl p-6 bg-gray-50 shadow-md">
          <h2 className="font-bold mb-2 text-xl flex items-center gap-2">
            <PenLine className="text-blue-600" /> Reviews for <span className="text-blue-700">{name}</span>
          </h2>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded font-semibold shadow hover:bg-blue-800"
            onClick={() => setShowReviewModal(true)}
          >
            Write a review
          </button>
          <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a review for {name}</DialogTitle>
              </DialogHeader>
              <ReviewForm companyId={companyIdBigInt} onSuccess={handleReviewSuccess} />
              <DialogClose asChild>
                <button className="mt-4 px-4 py-2 bg-gray-200 rounded font-semibold">Close</button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Nếu không ở writeMode, hiển thị chi tiết công ty và các review
  const [id, name, description, location, website, admin, createdAt, exists] = queriedCompanyInfo || [];
  const averageRating = reviews && reviews.length > 0 ? (
    reviews.reduce((sum: number, r: any) => sum + (typeof r.votes === 'number' ? r.votes : 5), 0) / reviews.length
  ).toFixed(1) : null;
  const starCounts: Record<number, number> = {1:0,2:0,3:0,4:0,5:0};
  if (Array.isArray(reviews)) {
    reviews.forEach((r: any) => {
      const v = typeof r.votes === 'number' ? Math.round(r.votes) : 5;
      if (v >= 1 && v <= 5) {
        if (starCounts[v] !== undefined) starCounts[v]++;
      }
    });
  }
  function getStarPercent(star: number) {
    const total = reviews?.length || 1;
    return ((starCounts[star] / total) * 100).toFixed(1);
  }

  // Popup logic for review form (always available)
  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    router.refresh();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        {/* Left: Logo + Info */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-blue-700">
            {name?.[0] || "🏢"}
          </div>
          <div>
            <div className="text-3xl font-bold">{name}</div>
            <div className="flex items-center gap-2 mt-1">
              <a href="#reviews" className="text-blue-600 underline font-medium">{reviews?.length || 0} reviews</a>
              <span className="ml-2 flex items-center gap-1 text-green-600 font-bold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                {averageRating || "5.0"}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setShowReviewModal(true)} className="px-4 py-2 bg-blue-700 text-white rounded font-semibold shadow hover:bg-blue-800">Write a review</button>
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border rounded text-blue-700 font-semibold hover:bg-blue-50 flex items-center gap-1">
                  Visit website <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14m-4 7h7v-7"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
        {/* Right: Rating box */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[300px]">
          <div className="text-4xl font-extrabold text-green-600">{averageRating || "5.0"}</div>
          <div className="text-sm text-gray-500 mb-2">Excellent</div>
          {/* Bar chart breakdown */}
          <div className="w-full mt-2 space-y-1">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-xs text-gray-500">{star}-star</span>
                <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                  <div className="bg-green-400 h-2" style={{width: `${getStarPercent(star)}%`}}></div>
                </div>
                <span className="w-8 text-xs text-gray-500 text-right">{starCounts[star] || 0}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">{reviews?.length || 0} reviews</div>
        </div>
      </div>
      {/* Review summary */}
      <div className="mb-8">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-gray-700">
          <div className="font-semibold mb-2 flex items-center gap-1">
            Review summary <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <div>
            {isSummarizing ? (
              <p className="italic text-gray-500">Generating summary...</p>
            ) : summary ? (
              <p>{summary}</p>
            ) : (
              <span className="italic text-gray-500">(Summary will be displayed here)</span>
            )}
          </div>
        </div>
      </div>
      {/* Danh sách review */}
      <div id="reviews" className="mb-8">
        <h2 className="font-bold text-lg mb-2">Reviews about this company</h2>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => {
              const content = review?.content || "(No content)";
              const author = review?.author ? `${review.author.slice(0, 8)}...${review.author.slice(-4)}` : "Anonymous";
              const createdAt = review?.createdAt ? new Date(Number(review.createdAt) * 1000).toLocaleDateString() : null;
              const votes = typeof review?.votes !== 'undefined' ? review.votes : 0;
              let commentId;
              try { commentId = BigInt(review.id); } catch { commentId = undefined; }
              return (
                <div key={review.id} className="border rounded p-4 bg-gray-50">
                  <div className="text-sm text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: linkify(content) }} />
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                    <span>Author: {author}</span>
                    {createdAt && <span>Date: {createdAt}</span>}
                    <span className="flex items-center gap-1">
                      <span className="text-gray-700 font-semibold mr-1">{votes}</span>
                      {commentId !== undefined && <UpvoteButton commentId={commentId} />}
                      {commentId !== undefined && <DownvoteButton commentId={commentId} />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500">There are no reviews for this company yet.</div>
        )}
      </div>
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a review for {name}</DialogTitle>
          </DialogHeader>
          <ReviewForm companyId={companyIdBigInt} onSuccess={handleReviewSuccess} />
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded font-semibold">Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReviewForm({ companyId, onSuccess }: { companyId: bigint, onSuccess?: () => void }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<bigint>(BigInt(5));
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Do nothing here, handled by CreateComment
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(BigInt(star))}
              className={`text-3xl ${rating >= star ? 'text-green-600' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 min-h-[100px] shadow-sm focus:ring-2 focus:ring-blue-200"
        placeholder="Share your experience..."
        required
      />
      <div className="mt-3">
        <CreateComment companyId={companyId} content={content} rating={rating} onSuccess={onSuccess} />
      </div>
    </form>
  );
} 

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
  return text.replace(urlRegex, (url) => {
    let href = url;
    if (!href.startsWith('http')) href = 'http://' + href;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-all">${url}</a>`;
  });
} 
