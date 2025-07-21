"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAddress } from "ethers";
import { notFound } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

interface ProfileLayoutProps {
	children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
	const account = useActiveAccount();

	// If no account is connected, show login message
	if (!account?.address) {
		return (
			<div className="bg-background min-h-screen">
				<div className="container mx-auto max-w-4xl px-4 py-8">
					<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
						<Card className="w-full max-w-md">
							<CardHeader className="text-center">
								<div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
									<svg
										className="text-primary h-8 w-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<CardTitle className="text-2xl">Welcome to Trust Network</CardTitle>
								<CardDescription className="text-base">
									Connect your wallet to access your profile and start sharing status updates
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground text-sm">
									You need to connect your wallet to access your profile and interact with the
									platform.
								</p>
								<div className="flex flex-col gap-3">
									<Button className="w-full">
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
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
										Connect Wallet
									</Button>
									<Button variant="outline" className="w-full">
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
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Learn More
									</Button>
								</div>
								<div className="text-muted-foreground text-xs">
									By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (!isAddress(account?.address)) {
		return notFound();
	}
	// If account is connected, render the children (profile content)
	return <>{children}</>;
}
