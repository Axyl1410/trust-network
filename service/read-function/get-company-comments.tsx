import { Contract } from "@/constant/contract";
import { ReadFunctionResult } from "@/types";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetCompanyComments(companyId: bigint): ReadFunctionResult<readonly bigint[]> {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method: "function getCompanyComments(uint256 companyId) view returns (uint256[])",
		params: [companyId],
	});

	return { ...res };
}
