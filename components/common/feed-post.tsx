"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
		<Card className="group mb-3 border-0 bg-gradient-to-br from-white/90 to-white/60 shadow-md backdrop-blur-lg transition-all duration-300 hover:shadow-lg">
			<CardContent className="p-4">
				<div className="flex gap-3">
					<Web3Avatar address={post.user} className="h-9 w-9 flex-shrink-0 ring-2 ring-white/30" />
					<div className="min-w-0 flex-1">
						<div className="mb-2 flex items-center gap-2">
							<span className="truncate font-semibold text-gray-900">
								{formatUserDisplayName(post.user)}
							</span>
							<span className="text-gray-300">•</span>
							<Badge
								variant="outline"
								className="border-gray-200 bg-gray-50/50 text-xs font-normal text-gray-500"
							>
								2h ago
							</Badge>
						</div>

						<p className="mb-3 text-base leading-relaxed text-gray-800">{post.content}</p>

						<div className="flex items-center justify-between border-t border-gray-100/50 pt-3">
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={handleLike}
									className={`h-8 px-3 transition-all duration-200 ${
										isLiked
											? "text-red-500 hover:bg-red-50 hover:text-red-600"
											: "text-gray-500 hover:bg-red-50 hover:text-red-500"
									}`}
								>
									<svg
										className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : "fill-none stroke-current"}`}
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={isLiked ? 0 : 2}
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
									{likes > 0 && <span className="font-medium">{likes}</span>}
								</Button>

								<Button
									variant="ghost"
									size="sm"
									onClick={handleComment}
									className="h-8 px-3 text-gray-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-500"
								>
									<svg className="mr-2 h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
									{comments > 0 && <span className="font-medium">{comments}</span>}
								</Button>

								<Button
									variant="ghost"
									size="sm"
									onClick={handleShare}
									className="h-8 px-3 text-gray-500 transition-all duration-200 hover:bg-green-50 hover:text-green-500"
								>
									<svg className="mr-2 h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
										/>
									</svg>
									{shares > 0 && <span className="font-medium">{shares}</span>}
								</Button>
							</div>

							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
							>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
									/>
								</svg>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
