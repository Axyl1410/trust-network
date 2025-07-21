import { Contract } from "@/constant/contract";
import { useReadContract } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export function useGetReputation(userAddress: string) {
	const contract = getThirdwebContract(Contract);
	const res = useReadContract({
		contract,
		method: "function getReputation(address user) view returns (int256)",
		params: [userAddress],
	});

	return { ...res };
}
