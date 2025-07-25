import TransactionDialog from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { CreateCommentProps, TransactionStep } from "@/types";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export default function CreateComment({
	companyId,
	content,
	rating,
	onSuccess,
}: CreateCommentProps & { onSuccess?: () => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
	const [message, setMessage] = useState("");
	const contract = getThirdwebContract(Contract);

	const handleOpenChange = (open: boolean) => {
		if (currentStep === "success" || currentStep === "error") setIsOpen(open);
	};

	const isButtonDisabled = !content.trim();

	return (
		<>
			<Button className="relative" asChild disabled={isButtonDisabled}>
				<TransactionButton
					disabled={isButtonDisabled}
					unstyled
					transaction={async () => {
						const transaction = prepareContractCall({
							contract,
							method:
								"function createComment(uint256 companyId, string content, uint256 rating) returns (uint256)",
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
						onSuccess?.();
					}}
					onError={(error) => {
						setCurrentStep("error");
						setMessage("Transaction failed: " + error.message);
					}}
				>
					Create review
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
