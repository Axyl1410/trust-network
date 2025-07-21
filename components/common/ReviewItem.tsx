import { UpvoteButton, DownvoteButton } from "@/service/write-function/vote";
import { useGetReputation } from "@/service/read-function/get-reputation";
import { useWalletBalance } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";
import { SEPOLIA } from "@/constant/chain";
import React from "react";
import Link from "next/link";

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
  return text.replace(urlRegex, (url) => {
    let href = url;
    if (!href.startsWith('http')) href = 'http://' + href;
    return `<a href=\"${href}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 underline break-all\">${url}</a>`;
  });
}

function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export default function ReviewItem({ review }: { review: any }) {
  const content = review?.content || "(No content)";
  const authorAddress = review?.author || "";
  const authorShort = authorAddress ? `${authorAddress.slice(0, 8)}...${authorAddress.slice(-4)}` : "Anonymous";
  const createdAt = review?.createdAt ? new Date(Number(review.createdAt) * 1000).toLocaleDateString() : null;
  const votes = typeof review?.votes !== 'undefined' ? review.votes : 0;
  const rating = typeof review?.rating !== 'undefined' ? review.rating : null;
  let commentId;
  try { commentId = BigInt(review.id); } catch { commentId = undefined; }
  const { data: repRaw, isLoading: repLoading } = useGetReputation(review.author);
  const { data: balance, isLoading: balanceLoading } = useWalletBalance({
    client: thirdwebClient,
    chain: SEPOLIA,
    address: review.author,
  });
  const reputation = repRaw ? Number(repRaw) : 0;
  const usdc = balance ? Number(balance.displayValue) : 0;
  const totalReputation = reputation + usdc * 100;
  return (
    <div className="border rounded p-4 bg-gray-50 relative overflow-visible">
      {/* Simple Reputation badge, responsive: static dưới header trên mobile, absolute top-right trên desktop */}
      <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 border border-orange-300 rounded-full text-orange-700 font-semibold text-sm w-max mt-2 sm:mt-0 sm:absolute sm:top-2 sm:right-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-2H9V7h2v4z"/></svg>
        <span>{repLoading || balanceLoading ? "..." : totalReputation.toFixed()} reputation</span>
        <span className="ml-1">🔥</span>
      </div>
      <div className="text-sm text-gray-700 mb-1 flex items-center justify-between">
        <span dangerouslySetInnerHTML={{ __html: linkify(content) }} />
        {review.companyId && (
          <button
            className="ml-2 flex items-center text-orange-600 hover:text-orange-800 text-xs font-semibold px-1 py-1 rounded transition"
            title="Share company link"
            onClick={() => {
              const companyId = review.companyId?.toString?.() || review.companyId;
              const url = `${window.location.origin}/review?id=${companyId}`;
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this company!',
                  url,
                });
              } else {
                navigator.clipboard.writeText(url);
                // Không alert, chỉ copy
              }
            }}
          >
           
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-400 mt-1">
        <span>
          Author: {isValidAddress(authorAddress) ? (
            <Link href={`/profile/${encodeURIComponent(authorAddress)}`}
              className="text-blue-700 underline hover:text-blue-500 font-semibold transition-colors"
            >
              {authorShort}
            </Link>
          ) : "Anonymous"}
        </span>
        {createdAt && <span>Date: {createdAt}</span>}
        {rating !== null && (
          <span className="flex items-center gap-1 text-yellow-500 font-bold">
            Rating:
            <span>{rating}</span>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" className="inline-block align-middle"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="text-gray-700 font-semibold mr-1">{votes}</span>
          {commentId !== undefined && <UpvoteButton commentId={commentId} />}
          {commentId !== undefined && <DownvoteButton commentId={commentId} />}
        </span>
      </div>
    </div>
  );
} 