import TransactionDialog, { TransactionStep } from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

interface Props {
	commentId: bigint;
	isUpvote: boolean;
}

export default function Vote({ commentId, isUpvote }: Props) {
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
							method: "function vote(uint256 commentId, bool isUpvote)",
							params: [commentId, isUpvote],
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
					Vote
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
