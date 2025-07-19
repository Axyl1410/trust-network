import TransactionDialog from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { Flag } from "lucide-react";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";
import { TransactionStep } from "@/types";

interface ReportCommentProps {
	commentId: bigint;
}

export default function ReportComment({ commentId }: ReportCommentProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
	const [message, setMessage] = useState("");
	const contract = getThirdwebContract(Contract);

	const handleOpenChange = (open: boolean) => {
		if (currentStep === "success" || currentStep === "error") setIsOpen(open);
	};

	return (
		<>
			<Button className="relative" variant="ghost" size="sm" asChild>
				<TransactionButton
					unstyled
					transaction={async () => {
						const transaction = prepareContractCall({
							contract,
							method: "function reportComment(uint256 commentId)",
							params: [commentId],
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
						setMessage("Comment reported successfully!");
					}}
					onError={(error) => {
						setCurrentStep("error");
						setMessage("Failed to report comment: " + error.message);
					}}
				>
					<Flag className="h-4 w-4" />
				</TransactionButton>
			</Button>
			<TransactionDialog
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				currentStep={currentStep}
				title="Report Comment"
				message={message}
			/>
		</>
	);
}
