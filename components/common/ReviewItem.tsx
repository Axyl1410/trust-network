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
      {/* Reputation badge top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-green-200 to-blue-200 border border-yellow-400 text-base font-extrabold shadow-sm z-10">
        <svg width="18" height="18" fill="currentColor" className="text-yellow-500" viewBox="0 0 24 24"><path d="M12 2c-.512 0-.986.258-1.262.684l-2.516 3.89-4.41.637c-.527.076-.97.447-1.13.954-.16.507-.02 1.062.36 1.43l3.19 3.11-.753 4.39c-.09.527.126 1.06.56 1.37.434.31 1.01.35 1.48.1l3.95-2.08 3.95 2.08c.47.25 1.05.21 1.48-.1.434-.31.65-.843.56-1.37l-.753-4.39 3.19-3.11c.38-.368.52-.923.36-1.43-.16-.507-.603-.878-1.13-.954l-4.41-.637-2.516-3.89c-.276-.426-.75-.684-1.262-.684z"/></svg>
        <span className="text-xs font-bold text-gray-800">Reputation</span>
        <span className="text-lg font-extrabold text-purple-800">
          {repLoading || balanceLoading ? "..." : totalReputation.toFixed()}
        </span>
      </div>
      <div className="text-sm text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: linkify(content) }} />
      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
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
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
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