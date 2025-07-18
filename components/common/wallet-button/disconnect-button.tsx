import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { Button } from "../../ui/button";

interface DisconnectButtonProps {
	className?: string;
}

export default function DisconnectButton({ className }: DisconnectButtonProps) {
	const wallet = useActiveWallet();
	const { disconnect } = useDisconnect();

	const handleDisconnect = () => {
		if (wallet) {
			disconnect(wallet);
		}
	};

	return (
		<Button
			asChild
			className="!cursor-pointer !p-0 hover:bg-[#f2eff3]"
			variant={"ghost"}
			onClick={handleDisconnect}
		>
			<div className="group flex !h-12 w-full !cursor-pointer items-center">
				<Button
					variant="ghost"
					className={cn(
						className,
						"flex w-full !cursor-pointer items-center justify-start !gap-3 !p-3 text-base hover:bg-[#f2eff3]",
					)}
				>
					<div className="h-6 w-6">
						<LogOutIcon className="!h-6 !w-6 text-[#6f6d78] group-hover:text-[#3385ff]" />
					</div>
					Disconnect
				</Button>
			</div>
		</Button>
	);
}
