import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useCompanyNameToId(companyName: string) {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method: "function companyNameToId(string) view returns (uint256)",
		params: [companyName],
	});

	return { ...res };
}
