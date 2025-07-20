import { StatusContract } from "@/constant/contract";
import { FeedPost } from "@/types/common";
import { StatusUpdatedEvent } from "@/types/contract";
import { prepareEvent } from "thirdweb";

import { useContractEvents } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useStatusUpdate(account: string) {
	const contract = getThirdwebContract(StatusContract);

	const events = useContractEvents({
		contract,
		events: [
			prepareEvent({
				signature: "event StatusUpdated(address indexed user, string newStatus, uint256 timestamp)",
				filters: {
					user: account,
				},
			}),
		],
	});

	return { ...events };
}

export function useFeedPosts(account: string) {
	const contract = getThirdwebContract(StatusContract);

	const {
		data: userEvents,
		isLoading,
		error,
	} = useContractEvents({
		contract,
		events: [
			prepareEvent({
				signature: "event StatusUpdated(address indexed user, string newStatus, uint256 timestamp)",
				filters: {
					user: account,
				},
			}),
		],
	});

	// Transform events into feed posts with mock engagement data
	const feedPosts: FeedPost[] =
		userEvents?.map((event, index) => {
			const args = event.args as unknown as StatusUpdatedEvent;
			return {
				id: `${account}-${index}`,
				user: account,
				content: args.newStatus,
				timestamp: args.timestamp,
				likes: Math.floor(Math.random() * 50) + 1, // Random likes between 1-50
				comments: Math.floor(Math.random() * 20) + 1, // Random comments between 1-20
				shares: Math.floor(Math.random() * 10) + 1, // Random shares between 1-10
			};
		}) || [];

	return {
		data: feedPosts,
		isLoading,
		error,
	};
}
