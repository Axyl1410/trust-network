import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetAverageRating(companyId: bigint) {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method: "function getAverageRating(uint256 companyId) view returns (uint256)",
		params: [companyId],
	});

	return { ...res };
}
