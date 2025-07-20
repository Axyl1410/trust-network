import { Contract } from "@/constant/contract";
import { CommentTuple, ReadFunctionResult } from "@/types";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetComment(commentId: bigint): ReadFunctionResult<CommentTuple> {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function getComment(uint256 commentId) view returns (uint256 id, address author, string content, uint256 createdAt, int256 votes, uint256 upvotes, uint256 downvotes, bool hidden, uint256 reportCount, uint256 rating, uint256 companyId)",
		params: [commentId],
	});

	return { ...res };
}
