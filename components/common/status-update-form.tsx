"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Web3Avatar } from "@/components/ui/web3-avatar";
import SetStatus from "@/service/write-function/set-status";
import { formatUserDisplayName } from "@/utils/format";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

interface StatusUpdateFormProps {
	onStatusUpdate?: () => void;
}

export function StatusUpdateForm({ onStatusUpdate }: StatusUpdateFormProps) {
	const [status, setStatus] = useState("");
	const account = useActiveAccount();

	const handleStatusUpdate = () => {
		if (status.trim()) {
			setStatus("");
			onStatusUpdate?.();
		}
	};

	if (!account?.address) {
		return null;
	}

	return (
		<Card className="mb-4 border-0 bg-gradient-to-br from-white/80 to-white/40 shadow-lg backdrop-blur-xl">
			<CardContent className="p-4">
				<div className="flex gap-3">
					<Web3Avatar
						address={account.address}
						className="h-10 w-10 flex-shrink-0 ring-2 ring-white/20"
					/>
					<div className="flex-1 space-y-3">
						<div className="flex items-center gap-3">
							<span className="font-semibold text-gray-900">
								{formatUserDisplayName(account.address)}
							</span>
							<Badge
								variant="secondary"
								className="border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700"
							>
								<svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Connected
							</Badge>
						</div>

						<div className="relative">
							<Input
								placeholder="What's on your mind?"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="border-0 bg-gray-50/50 text-base text-gray-900 transition-all duration-300 placeholder:text-gray-400 focus:border-transparent focus:bg-white/80 focus:ring-2 focus:ring-blue-500/30"
							/>
						</div>

						<div className="flex items-center justify-between pt-2">
							<div className="flex gap-3">
								<Button
									variant="ghost"
									size="sm"
									className="h-8 px-3 text-gray-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
								>
									<svg
										className="mr-2 h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									Photo
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 px-3 text-gray-500 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
								>
									<svg
										className="mr-2 h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									Video
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 px-3 text-gray-500 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
								>
									<svg
										className="mr-2 h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Location
								</Button>
							</div>

							<div className="flex items-center gap-3">
								<span
									className={`text-xs font-medium ${status.length > 140 ? "text-red-500" : "text-gray-400"}`}
								>
									{status.length}/140
								</span>
								<SetStatus status={status} onSuccess={handleStatusUpdate} />
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
