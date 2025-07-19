import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetCompanyRatingStats(companyId: bigint) {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function getCompanyRatingStats(uint256 companyId) view returns (uint256 totalComments, uint256 totalRating, uint256 averageRating)",
		params: [companyId],
	});

	return { ...res };
}
