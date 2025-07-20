import { Contract } from "@/constant/contract";
import { ReadFunctionResult, ReadonlyCommentArray } from "@/types";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetCommentsByUser(
	userAddress: string,
): ReadFunctionResult<ReadonlyCommentArray> {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function getCommentsByUser(address user) view returns ((uint256 id, address author, string content, uint256 createdAt, int256 votes, uint256 upvotes, uint256 downvotes, bool hidden, uint256 reportCount, uint256 rating, uint256 companyId)[])",
		params: [userAddress],
	});

	return { ...res };
}
