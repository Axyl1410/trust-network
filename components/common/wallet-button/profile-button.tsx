import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

interface ProfileButtonProps {
	className?: string;
	onClick?: () => void;
}

export default function ProfileButton({ className, onClick }: ProfileButtonProps) {
	const handleProfile = () => {
		onClick?.();
	};

	return (
		<Link href="/profile" onClick={handleProfile}>
			<Button asChild className="!cursor-pointer !p-0 hover:bg-[#f2eff3]" variant={"ghost"}>
				<div className="group flex !h-12 w-full !cursor-pointer items-center">
					<Button
						variant="ghost"
						className={cn(
							className,
							"flex w-full !cursor-pointer items-center justify-start !gap-3 !p-3 text-base hover:bg-[#f2eff3]",
						)}
					>
						<div className="h-6 w-6">
							<UserIcon className="!h-6 !w-6 text-[#6f6d78] group-hover:text-[#3385ff]" />
						</div>
						Profile
					</Button>
				</div>
			</Button>
		</Link>
	);
}
