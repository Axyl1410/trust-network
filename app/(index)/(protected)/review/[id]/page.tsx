"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useCompanies } from "@/service/read-function/companies";
import { useGetAllCommentsOfCompany } from "@/service/read-function/get-all-comments-of-company";
import { useGetAverageRating } from "@/service/read-function/get-average-rating";
import { useGetCompanyRatingStats } from "@/service/read-function/get-company-rating-stats";

import { useState, useEffect } from "react";
import ReviewList from "@/components/common/ReviewList";
import CreateComment from "@/service/write-function/create-comment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function ReviewDetailPage() {
  const params = useParams();
  const idParam = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const companyIdBigInt = idParam ? BigInt(idParam) : null;
  const safeCompanyId = companyIdBigInt ?? 0n;

  const { data: queriedCompanyInfo, isLoading: isCompanyLoading } = useCompanies(safeCompanyId);
  const { data: reviews } = useGetAllCommentsOfCompany(safeCompanyId);
  const { data: averageRatingRaw } = useGetAverageRating(safeCompanyId);
  const { data: ratingStats } = useGetCompanyRatingStats(safeCompanyId);
  const averageRating = averageRatingRaw ? (Number(averageRatingRaw)).toFixed(1) : null;
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<bigint>(BigInt(5));
  const [starFilter, setStarFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');

  // Xác định cấp độ đánh giá
  let ratingLevel = 'Excellent';
  let ratingLevelColor = 'text-green-600';
  const avg = averageRating ? Number(averageRating) : 0;
  if (avg >= 4.5) {
    ratingLevel = 'Excellent';
    ratingLevelColor = 'text-green-600';
  } else if (avg >= 3.5) {
    ratingLevel = 'Good';
    ratingLevelColor = 'text-blue-600';
  } else if (avg >= 2.5) {
    ratingLevel = 'Average';
    ratingLevelColor = 'text-yellow-600';
  } else {
    ratingLevel = 'Poor';
    ratingLevelColor = 'text-red-600';
  }

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
          setSummary("Could not generate a summary at this time.");
        }
        setIsSummarizing(false);
      };
      fetchSummary();
    }
  }, [reviews]);

  if (!companyIdBigInt) {
    return <div className="text-center py-8 text-gray-500">Please select a company to see the details.</div>;
  }
  if (isCompanyLoading) {
    return <div className="text-center py-8">Loading company information...</div>;
  }
  if (!queriedCompanyInfo) {
    return <div className="text-center py-8 text-red-500">Company information not found.</div>;
  }

  const [id, name, description, location, website, admin, createdAt, exists] = queriedCompanyInfo || [];
  // Always show 1-5 stars in ranking
  const allStars = [5, 4, 3, 2, 1];
  const starCounts: Record<number, number> = {1:0,2:0,3:0,4:0,5:0};
  if (Array.isArray(reviews)) {
    reviews.forEach((r: any) => {
      let v = r.rating;
      if (typeof v === 'bigint') v = Number(v);
      if (typeof v !== 'number' || isNaN(v)) v = 5;
      v = Math.round(v);
      if (starCounts[v] !== undefined) starCounts[v]++;
    });
  }
  function getStarPercent(star: number) {
    const total = reviews?.length || 1;
    return ((starCounts[star] / total) * 100).toFixed(1);
  }

  // Filter reviews theo số sao
  const filteredReviews = Array.isArray(reviews)
    ? starFilter === 'all'
      ? [...reviews]
      : reviews.filter((r: any) => {
          let v = r.rating;
          if (typeof v === 'bigint') v = Number(v);
          if (typeof v !== 'number' || isNaN(v)) v = 5;
          v = Math.round(v);
          return v === starFilter;
        })
    : [];

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    window.location.reload();
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
            <div className="text-3xl font-bold flex items-center gap-2">
              {name}
              <button
                className="ml-2 flex items-center text-blue-500 hover:text-blue-700 hover:scale-110 transition-transform shadow-sm rounded-full p-1"
                title="Share company link"
                onClick={() => {
                  const url = `${window.location.origin}/review/${id}`;
                  if (navigator.share) {
                    navigator.share({
                      title: `Check out ${name} on Trust Network!`,
                      url,
                    });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
              </button>
            </div>
            {description && (
              <div className="text-gray-600 text-sm mt-1 mb-2 max-w-sm line-clamp-3">{description}</div>
            )}
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
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[350px]">
          <div className="text-4xl font-extrabold text-green-600">{averageRating || "5.0"}</div>
          <div className={`text-sm mb-2 font-semibold ${ratingLevelColor}`}>{ratingLevel}</div>
          {/* Bar chart breakdown */}
          <div className="w-full mt-2 space-y-1 flex flex-col">
            {allStars.map(star => (
              <div
                key={star}
                className={`flex items-center gap-2 cursor-pointer select-none transition rounded px-1.5 py-1 text-base font-medium border ${starFilter === star ? 'bg-blue-100 ring-2 ring-blue-400 border-blue-300' : 'hover:bg-gray-100 border-transparent'}`}
                onClick={() => setStarFilter(starFilter === star ? 'all' : star as 1|2|3|4|5)}
                title={`Show only ${star}-star reviews`}
                style={{ minHeight: 36 }}
              >
                <span className="w-10 text-xs text-gray-600 font-semibold">{star}-star</span>
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
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a review for {name}</DialogTitle>
          </DialogHeader>
          <CreateComment companyId={safeCompanyId} content={content} rating={rating} onSuccess={handleReviewSuccess} />
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded font-semibold">Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
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
        {/* Thêm UI filter số sao rõ ràng phía trên ReviewList */}
        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full border text-sm font-medium transition ${starFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
            onClick={() => setStarFilter('all')}
          >
            All
          </button>
          {[5,4,3,2,1].map(star => (
            <button
              key={star}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition ${starFilter === star ? 'bg-yellow-400 text-white border-yellow-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'}`}
              onClick={() => setStarFilter(star as 1|2|3|4|5)}
              title={`Show only ${star}-star reviews`}
            >
              <span>{star}</span>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            </button>
          ))}
        </div>
        {/* Đảm bảo ReviewList dùng filteredReviews như cũ */}
        <ReviewList reviews={filteredReviews} />
      </div>
    </div>
  );
}
