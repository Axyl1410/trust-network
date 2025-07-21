"use client";

import { FeedPostComponent } from "@/components/common/feed-post";
import { StatusUpdateForm } from "@/components/common/status-update-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Web3Avatar } from "@/components/ui/web3-avatar";
import { SEPOLIA } from "@/constant/chain";
import { thirdwebClient } from "@/lib/thirdweb";
import { useStatusUpdate, useFeedPosts } from "@/service/event-function/status-update";
import { useGetAllCompanies } from "@/service/read-function/get-all-companies";
import { useGetCommentsByUser } from "@/service/read-function/get-comments-by-user";
import { useGetReputation } from "@/service/read-function/get-reputation";
import { Comment, Company, ProfileUserData } from "@/types";
import {
	formatCommentDate,
	formatCompanyName,
	formatRating,
	formatUserDisplayName,
} from "@/utils/format";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import ReviewList from "@/components/common/ReviewList";

export default function ProfilePage() {
	const account = useActiveAccount();
	const address = account?.address;

	if (!address) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center text-gray-500 text-lg font-semibold">
					Please connect your wallet to view your profile.
				</div>
			</div>
		);
	}

	const { data: balance, isLoading } = useWalletBalance({
		client: thirdwebClient,
		chain: SEPOLIA,
		address,
	});
	const { data: comments } = useGetCommentsByUser(address);
	const { data: companies } = useGetAllCompanies();
	const { data: feedPosts, isLoading: feedLoading } = useFeedPosts(address);
	const { data: repRaw, isLoading: repLoading } = useGetReputation(address);

	const reputation = repRaw ? Number(repRaw) : 0;
	const totalReputation = reputation + (balance ? Number(balance.displayValue) : 0) * 100;

	// Tìm tên công ty theo companyId
	const getCompanyName = (companyId: bigint): string => {
		if (!companies) return "Unknown Company";
		const company = companies.find((c: Company) => c.id === companyId);
		return company ? formatCompanyName(company.name) : "Unknown Company";
	};

	// Mock user data
	const userData: ProfileUserData = {
		name: account?.address ? formatUserDisplayName(account.address) : "Anonymous",
		username: account?.address ? account.address.slice(2, 8) : "anonymous",
		bio: "Web3 Developer & Blockchain Enthusiast. Building the future of decentralized applications.",
		following: 193,
		followers: 15757,
		website: "https://example.com",
		joinedDate: "Apr 2024",
	};

	return (
		<div className="bg-background my-4 min-h-screen">
			{/* Main Profile Container */}
			<div className="container mx-auto max-w-4xl">
				{/* Mobile Action Buttons */}
				<div className="mt-5 ml-auto flex w-full items-center gap-x-2 px-5 md:w-[22.5rem] md:px-0 lg:hidden">
					<Button variant="outline" className="w-full">
						Signup
					</Button>
					<Button className="w-full">Login</Button>
				</div>

				{/* Cover Image */}
				<div className="mx-auto">
					<div
						className="h-52 bg-gradient-to-r from-pink-500 to-red-500 sm:h-64 md:rounded-xl"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1350&h=350&fit=crop')",
							backgroundPosition: "center center",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
						}}
					/>
				</div>

				{/* Profile Info Section */}
				<div className="mb-4 space-y-3 px-5 md:px-0">
					<div className="flex items-start justify-between">
						{/* Profile Picture */}
						<div className="relative -mt-14 ml-5 size-20 sm:-mt-24 sm:size-36">
							<Web3Avatar
								address={account?.address || ""}
								className="ring-background size-full ring-3"
							/>
						</div>

						{/* Action Buttons */}
						<div className="mt-4 flex items-center gap-x-2">
							<Button variant="outline" size="sm">
								Follow
							</Button>
							<Button variant="outline" size="sm">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							</Button>
							<Button variant="outline" size="sm">
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

					{/* User Info */}
					<div className="space-y-1 py-2">
						<div className="flex items-center gap-1.5">
							<h3 className="truncate text-2xl font-bold">{userData.name}</h3>
							<svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
						</div>
						<div className="flex items-center space-x-3">
							<span className="text-muted-foreground text-sm sm:text-base">
								@{userData.username}
							</span>
						</div>
						{/* Reputation Display */}
						<div className="mt-2 flex flex-col gap-1 text-sm">
							<span>
								<b>Total Reputation:</b>{" "}
								{repLoading || isLoading ? "..." : totalReputation.toFixed()}
							</span>
							<span className="text-xs text-gray-500">
								Formula: total = reputation + (token * 100)
							</span>
						</div>
					</div>

					{/* Bio */}
					<div className="markup linkify">
						<p className="text-foreground">{userData.bio}</p>
					</div>

					{/* Stats */}
					<div className="space-y-5">
						<div className="flex gap-8">
							<button className="flex gap-x-1 transition-opacity hover:opacity-80">
								<b>{userData.following}</b>
								<span className="text-muted-foreground">Following</span>
							</button>
							<button className="flex gap-x-1 transition-opacity hover:opacity-80">
								<b>{userData.followers.toLocaleString()}</b>
								<span className="text-muted-foreground">Followers</span>
							</button>
						</div>

						{/* Links and Info */}
						<div className="flex flex-wrap gap-x-5 gap-y-2">
							<div className="flex items-center gap-2">
								<div className="size-4 rounded-full bg-blue-500"></div>
								<div className="truncate">
									<a
										href={userData.website}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 hover:underline"
									>
										{userData.website.replace("https://", "")}
									</a>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<div className="truncate">Joined {userData.joinedDate}</div>
							</div>
						</div>
					</div>
				</div>

				{/* Navigation Tabs */}
				<div className="px-5 md:px-0">
					<Tabs defaultValue="feed" className="w-full">
						<TabsList className="mx-5 mb-5 flex h-auto list-none flex-wrap gap-3 bg-transparent p-0 md:mx-0">
							<TabsTrigger
								value="feed"
								className="relative cursor-pointer rounded-lg px-3 py-1.5 text-sm outline-hidden transition-colors data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-300/20"
							>
								Feed
							</TabsTrigger>
							<TabsTrigger
								value="reviews"
								className="relative cursor-pointer rounded-lg px-3 py-1.5 text-sm outline-hidden transition-colors data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-300/20"
							>
								All Reviews
							</TabsTrigger>
						</TabsList>

						{/* Feed Tab */}
						<TabsContent value="feed" className="mt-6 px-5 md:px-0">
							{/* Status Update Form */}
							<StatusUpdateForm />
							<div className="space-y-6">
								{feedLoading ? (
									<div className="py-8 text-center">
										<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
										<p className="text-muted-foreground">Loading feed...</p>
									</div>
								) : feedPosts && feedPosts.length > 0 ? (
									feedPosts.map((post) => <FeedPostComponent key={post.id} post={post} />)
								) : (
									<div className="py-8 text-center">
										<p className="text-muted-foreground">No feed posts found.</p>
									</div>
								)}
							</div>
						</TabsContent>

						{/* Reviews Tab */}
						<TabsContent value="reviews" className="mt-6 px-5 md:px-0">
							<div className="space-y-4">
								{comments && comments.length > 0 ? (
									comments.map((comment: Comment) => (
										<Card key={comment.id} className="border-0 shadow-none">
											<CardContent className="p-0">
												<div className="space-y-3">
													<div className="flex items-start justify-between">
														<div>
															<h4 className="font-semibold">{getCompanyName(comment.companyId)}</h4>
															<p className="text-muted-foreground text-sm">
																{formatCommentDate(comment.createdAt)}
															</p>
														</div>
														<div className="text-right">
															<div className="text-sm text-yellow-500">
																{formatRating(Number(comment.rating))}
															</div>
															<p className="text-muted-foreground text-xs">
																Rating: {comment.rating}/5
															</p>
														</div>
													</div>
													<p className="text-foreground">{comment.content}</p>
													<Separator className="my-3" />
													<div className="text-muted-foreground flex items-center justify-between text-sm">
														<div className="flex gap-4">
															<span>👍 {comment.upvotes}</span>
															<span>👎 {comment.downvotes}</span>
															<span>📊 {comment.votes}</span>
														</div>
														{comment.hidden && <span className="text-red-500">Hidden</span>}
													</div>
												</div>
											</CardContent>
										</Card>
									))
								) : (
									<Card className="border-0 shadow-none">
										<CardContent className="py-8 text-center">
											<p className="text-muted-foreground">
												No reviews yet. This user hasn&apos;t reviewed any companies.
											</p>
										</CardContent>
									</Card>
								)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
