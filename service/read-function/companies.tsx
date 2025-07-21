import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useCompanies(companyId: bigint) {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function companies(uint256) view returns (uint256 id, string name, string description, string location, string website, address admin, uint256 createdAt, bool exists, uint256 totalComments, uint256 totalRating)",
		params: [companyId],
	});

	return { ...res };
}
