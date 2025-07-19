import { Contract } from "@/constant/contract";
import { ReadFunctionResult, ReadonlyCompanyArray } from "@/types";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetAllCompanies(): ReadFunctionResult<ReadonlyCompanyArray> {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function getAllCompanies() view returns ((uint256 id, string name, string description, string location, string website, address admin, uint256 createdAt, bool exists, uint256 totalComments, uint256 totalRating)[])",
		params: [],
	});

	return { ...res };
}
