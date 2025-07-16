import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

interface CreateCommentProps {
	companyId: bigint;
	content: string;
}

export default function CreateComment({ companyId, content }: CreateCommentProps) {
	const contract = getThirdwebContract(Contract);

	return (
		<Button variant={"outline"} className="relative" asChild>
			<TransactionButton
				unstyled
				transaction={async () => {
					const transaction = prepareContractCall({
						contract,
						method: "function createComment(uint256 companyId, string content) returns (uint256)",
						params: [companyId, content],
					});
					return transaction;
				}}
			>
				Create Comment
			</TransactionButton>
		</Button>
	);
}
