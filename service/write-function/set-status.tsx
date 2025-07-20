import TransactionDialog from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { StatusContract } from "@/constant/contract";
import { TransactionStep } from "@/types";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

interface SetStatusProps {
	status: string;
	onSuccess?: () => void;
}

export default function SetStatus({ status, onSuccess }: SetStatusProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
	const [message, setMessage] = useState("");
	const contract = getThirdwebContract(StatusContract);

	const handleOpenChange = (open: boolean) => {
		if (currentStep === "success" || currentStep === "error") setIsOpen(open);
	};

	return (
		<>
			<Button className="relative" size="sm" asChild>
				<TransactionButton
					unstyled
					transaction={async () => {
						const transaction = prepareContractCall({
							contract,
							method: "function setStatus(string _status)",
							params: [status],
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
						setMessage("Status set successfully!");
						onSuccess?.();
					}}
					onError={(error) => {
						setCurrentStep("error");
						setMessage("Failed to set status: " + error.message);
					}}
				>
					Set Status
				</TransactionButton>
			</Button>
			<TransactionDialog
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				currentStep={currentStep}
				title="Set Status"
				message={message}
			/>
		</>
	);
}
