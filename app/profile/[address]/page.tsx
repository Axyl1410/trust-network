"use client";

import NavHeaderClient from "@/components/layout/NavHeaderClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllCompanies } from "@/service/read-function/get-all-companies";
import { useGetCommentsByUser } from "@/service/read-function/get-comments-by-user";
import { Comment, Company, FeedPost, ProfileUserData } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

// Mock data cho feed posts
const mockFeedPosts: FeedPost[] = [
	{
		id: 1,
		title: "Getting Started with Web3 Development",
		content:
			"Web3 development is revolutionizing how we build applications. In this post, I'll share my journey and some key insights...",
		date: "2024-01-15",
		readTime: "5 min read",
		tags: ["Web3", "Development", "Blockchain"],
		likes: 42,
		comments: 8,
		shares: 3,
	},
	{
		id: 2,
		title: "Understanding Smart Contracts",
		content:
			"Smart contracts are self-executing contracts with the terms of the agreement directly written into code...",
		date: "2024-01-10",
		readTime: "8 min read",
		tags: ["Smart Contracts", "Solidity", "Ethereum"],
		likes: 67,
		comments: 12,
		shares: 5,
	},
	{
		id: 3,
		title: "DeFi Protocols: A Comprehensive Guide",
		content:
			"Decentralized Finance (DeFi) has emerged as one of the most exciting applications of blockchain technology...",
		date: "2024-01-05",
		readTime: "12 min read",
		tags: ["DeFi", "Finance", "Cryptocurrency"],
		likes: 89,
		comments: 15,
		shares: 7,
	},
];

interface ProfilePageProps {
	params: {
		address: string;
	};
}

export default function DynamicProfilePage({ params }: ProfilePageProps) {
	const router = useRouter();
	const account = useActiveAccount();
	const { address } = params;

	// Decode the address from URL
	const decodedAddress = decodeURIComponent(address);

	// Check if the logged-in user is viewing their own profile
	useEffect(() => {
		if (account?.address && account.address.toLowerCase() === decodedAddress.toLowerCase()) {
			router.replace("/profile");
		}
	}, [account?.address, decodedAddress, router]);

	const { data: comments } = useGetCommentsByUser(decodedAddress);
	const { data: companies } = useGetAllCompanies();

	// Tìm tên công ty theo companyId
	const getCompanyName = (companyId: bigint): string => {
		if (!companies) return "Unknown Company";
		const company = companies.find((c: Company) => c.id === companyId);
		return company ? company.name : "Unknown Company";
	};

	// Format timestamp
	const formatDate = (timestamp: bigint): string => {
		return new Date(Number(timestamp) * 1000).toLocaleDateString();
	};

	// Render star rating
	const renderStars = (rating: number): string => {
		return "★".repeat(rating) + "☆".repeat(5 - rating);
	};

	// User data for the profile being viewed
	const userData: ProfileUserData = {
		name: decodedAddress
			? `${decodedAddress.slice(0, 6)}...${decodedAddress.slice(-4)}`
			: "Anonymous",
		username: decodedAddress ? decodedAddress.slice(2, 8) : "anonymous",
		bio: "Web3 Developer & Blockchain Enthusiast. Building the future of decentralized applications.",
		following: 193,
		followers: 15757,
		website: "https://example.com",
		joinedDate: "Apr 2024",
	};

	return (
		<div className="bg-background min-h-screen">
			{/* Navigation Header */}
			<NavHeaderClient />

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
							<div className="ring-background flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white ring-3 sm:size-36 sm:text-3xl dark:ring-black">
								{decodedAddress ? decodedAddress.slice(2, 4).toUpperCase() : "??"}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-x-2">
							<Button variant="outline" size="sm">
								Follow
							</Button>
							<Button variant="outline" size="sm">
								<svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
							<div className="space-y-6">
								{mockFeedPosts.map((post) => (
									<Card key={post.id} className="border-0 shadow-none">
										<CardContent className="p-0">
											<div className="space-y-3">
												<div className="flex items-start justify-between">
													<div>
														<h3 className="mb-1 text-lg font-semibold">{post.title}</h3>
														<p className="text-muted-foreground text-sm">
															{post.date} • {post.readTime}
														</p>
													</div>
												</div>
												<p className="text-foreground">{post.content}</p>
												<div className="flex gap-2">
													{post.tags.map((tag) => (
														<Badge key={tag} variant="secondary" className="text-xs">
															{tag}
														</Badge>
													))}
												</div>
												<Separator className="my-3" />
												<div className="text-muted-foreground flex items-center justify-between text-sm">
													<div className="flex gap-4">
														<span>❤️ {post.likes}</span>
														<span>💬 {post.comments}</span>
														<span>📤 {post.shares}</span>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
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
																{formatDate(comment.createdAt)}
															</p>
														</div>
														<div className="text-right">
															<div className="text-sm text-yellow-500">
																{renderStars(Number(comment.rating))}
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
