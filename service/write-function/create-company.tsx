import TransactionDialog from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { CreateCompanyProps, TransactionStep } from "@/types";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

export default function CreateCompany({
	name,
	description,
	location,
	website,
}: CreateCompanyProps) {
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
							method:
								"function createCompany(string name, string description, string location, string website) returns (uint256)",
							params: [name, description, location, website],
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
					Create Company
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
