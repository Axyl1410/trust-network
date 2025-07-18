import TransactionDialog, { TransactionStep } from "@/components/common/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/constant/contract";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import getThirdwebContract from "../get-contract";

interface VoteButtonProps {
	commentId: bigint;
	isUpvote: boolean;
	children: React.ReactNode;
}

function VoteButton({ commentId, isUpvote, children }: VoteButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
	const [message, setMessage] = useState("");
	const contract = getThirdwebContract(Contract);

	const handleOpenChange = (open: boolean) => {
		if (currentStep === "success" || currentStep === "error") setIsOpen(open);
	};

	return (
		<>
			<Button className="relative" variant={"ghost"} asChild>
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
					{children}
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

export function UpvoteButton({ commentId }: { commentId: bigint }) {
	return (
		<VoteButton commentId={commentId} isUpvote={true}>
			<ThumbsUp className="h-4 w-4" />
		</VoteButton>
	);
}

export function DownvoteButton({ commentId }: { commentId: bigint }) {
	return (
		<VoteButton commentId={commentId} isUpvote={false}>
			<ThumbsDown className="h-4 w-4" />
		</VoteButton>
	);
}
