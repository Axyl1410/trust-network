import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { thirdwebClient } from "@/lib/thirdweb";
import { base } from "thirdweb/chains";
import { CheckoutWidget } from "thirdweb/react";

export default function Page() {
	return (
		<div className="container mx-auto my-8 max-w-6xl px-4">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Left Column - Product Image */}
				<div className="flex h-fit justify-center space-y-4">
					<CheckoutWidget
						client={thirdwebClient}
						theme="light"
						chain={base}
						amount={"2"}
						tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
						seller="0x2349Db8bdf85bd80bFc4afb715a69fb4C6463B96"
						feePayer="seller"
						name="Concert Ticket"
						image="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop"
						description="Concert ticket for the upcoming show"
						showThirdwebBranding={false}
						className="w-full"
					/>
				</div>

				{/* Right Column - Product Details & Checkout */}
				<div className="space-y-6">
					{/* Product Header */}
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Badge variant="secondary">Event Ticket</Badge>
							<Badge variant="outline">Limited Edition</Badge>
						</div>
						<h1 className="text-3xl font-bold">Concert Ticket</h1>
						<p className="text-primary text-2xl font-semibold">2 USDC</p>
					</div>

					<Separator />

					{/* Product Description */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Description</h3>
						<p className="text-muted-foreground leading-relaxed">
							Experience an unforgettable night of live music with this exclusive concert ticket.
							Join us for an evening filled with amazing performances, great atmosphere, and
							memorable moments. This ticket grants you access to premium seating and includes all
							venue amenities.
						</p>
					</div>

					{/* Event Details */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Event Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
									<svg
										className="text-primary h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div>
									<p className="font-medium">Date & Time</p>
									<p className="text-muted-foreground text-sm">December 15, 2024 • 8:00 PM</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
									<svg
										className="text-primary h-4 w-4"
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
								</div>
								<div>
									<p className="font-medium">Venue</p>
									<p className="text-muted-foreground text-sm">Metropolitan Arena, Downtown</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
									<svg
										className="text-primary h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<p className="font-medium">Duration</p>
									<p className="text-muted-foreground text-sm">Approximately 3 hours</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Features */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">What&apos;s Included</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-sm">Premium seating</span>
								</li>
								<li className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-sm">Access to VIP lounge</span>
								</li>
								<li className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-sm">Complimentary refreshments</span>
								</li>
								<li className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-sm">Meet & greet opportunity</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
