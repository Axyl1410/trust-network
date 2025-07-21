import React from "react";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviews }: { reviews: any[] }) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <div className="text-gray-500">There are no reviews yet.</div>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
} 