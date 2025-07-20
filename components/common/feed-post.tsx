"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Web3Avatar } from "@/components/ui/web3-avatar";
import { FeedPost } from "@/types/common";
import { formatUserDisplayName } from "@/utils/format";
import { useState } from "react";

interface FeedPostProps {
	post: FeedPost;
}

export function FeedPostComponent({ post }: FeedPostProps) {
	const [likes, setLikes] = useState(post.likes);
	const [comments, setComments] = useState(post.comments);
	const [shares, setShares] = useState(post.shares);
	const [isLiked, setIsLiked] = useState(false);

	const handleLike = () => {
		if (isLiked) {
			setLikes(likes - 1);
		} else {
			setLikes(likes + 1);
		}
		setIsLiked(!isLiked);
	};

	const handleComment = () => {
		setComments(comments + 1);
	};

	const handleShare = () => {
		setShares(shares + 1);
	};

	return (
		<Card className="mb-4">
			<CardContent className="p-4">
				<div className="flex gap-3">
					<Web3Avatar address={post.user} className="h-10 w-10 flex-shrink-0" />
					<div className="flex-1 space-y-3">
						<div className="flex items-center gap-2">
							<span className="font-medium">{formatUserDisplayName(post.user)}</span>
						</div>
						<p className="text-foreground">{post.content}</p>
						<Separator />
						<div className="text-muted-foreground flex items-center justify-between text-sm">
							<div className="flex gap-6">
								<button
									onClick={handleLike}
									className={`hover:text-foreground flex items-center gap-1 transition-colors ${
										isLiked ? "text-red-500" : ""
									}`}
								>
									{isLiked ? "❤️" : "🤍"} {likes}
								</button>
								<button
									onClick={handleComment}
									className="hover:text-foreground flex items-center gap-1 transition-colors"
								>
									💬 {comments}
								</button>
								<button
									onClick={handleShare}
									className="hover:text-foreground flex items-center gap-1 transition-colors"
								>
									📤 {shares}
								</button>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
