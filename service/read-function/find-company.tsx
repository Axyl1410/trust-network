import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useFindCompany(keyword: string) {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method:
			"function findCompany(string keyword) view returns (uint256 id, string name, bool exists)",
		params: [keyword],
	});

	return { ...res };
}
