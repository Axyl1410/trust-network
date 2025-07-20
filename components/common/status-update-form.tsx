"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
		<Card className="mb-6">
			<CardContent className="p-4">
				<div className="flex gap-3">
					<Web3Avatar address={account.address} className="h-10 w-10 flex-shrink-0" />
					<div className="flex-1 space-y-3">
						<div className="flex items-center gap-2">
							<span className="font-medium">{formatUserDisplayName(account.address)}</span>
						</div>
						<Input
							placeholder="What's happening?"
							value={status}
							onChange={(e) => setStatus(e.target.value)}
						/>
						<Separator />
						<div className="flex items-center justify-between">
							<div className="text-muted-foreground flex gap-4 text-sm">
								<button className="hover:text-foreground flex items-center gap-1">📷 Photo</button>
								<button className="hover:text-foreground flex items-center gap-1">🎥 Video</button>
								<button className="hover:text-foreground flex items-center gap-1">
									📍 Location
								</button>
							</div>
							<SetStatus status={status} onSuccess={handleStatusUpdate} />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
