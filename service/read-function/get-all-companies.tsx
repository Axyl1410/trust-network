import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetAllCompanies() {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function getAllCompanies() view returns ((uint256 id, string name, string description, string location, string website, address admin, uint256 createdAt, bool exists)[])",
		params: [],
	});

	return { ...res };
}
