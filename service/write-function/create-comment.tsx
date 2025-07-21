import TransactionDialog, { TransactionStep } from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

interface CreateCommentProps {
	companyId: bigint;
	content: string;
	rating: number;
}

export default function CreateComment({ companyId, content, rating }: CreateCommentProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
	const [message, setMessage] = useState("");
	const contract = getThirdwebContract(Contract);

	const handleOpenChange = (open: boolean) => {
		if (currentStep === "success" || currentStep === "error") setIsOpen(open);
	};

	return (
		<>
			<Button className="relative" asChild>
				<TransactionButton
					unstyled
					transaction={async () => {
						const transaction = prepareContractCall({
							contract,
							method: "function createComment(uint256 companyId, string content, uint8 rating) returns (uint256)",
							params: [companyId, content, rating],
						});

						setIsOpen(true);
						setCurrentStep("sent");
						return transaction;
					}}
					onTransactionSent={() => {
						setCurrentStep("confirmed");
					}}
					onTransactionConfirmed={() => {
						setCurrentStep("success");
						setMessage("Transaction is being confirmed...");
					}}
					onError={(error) => {
						setCurrentStep("error");
						setMessage("Transaction failed: " + error.message);
					}}
				>
					Create Comment
				</TransactionButton>
			</Button>
			<TransactionDialog
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				currentStep={currentStep}
				title="Transaction Status"
				message={message}
			/>
		</>
	);
}
