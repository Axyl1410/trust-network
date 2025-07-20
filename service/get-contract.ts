import { SEPOLIA } from "@/constant/chain";
import { thirdwebClient } from "@/lib/thirdweb";
import { getContract } from "thirdweb";

const getThirdwebContract = (address: string) => {
	return (
		getContract({
			client: thirdwebClient,
			address: address,
			chain: SEPOLIA,
		}) ?? null
	);
};

export default getThirdwebContract;
