import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

interface ProfileButtonProps {
	className?: string;
	onClick?: () => void;
}

export default function ProfileButton({ className, onClick }: ProfileButtonProps) {
	const router = useRouter();

	const handleProfile = () => {
		onClick?.();
		router.push("/profile");
	};

	return (
		<Button
			asChild
			className="!cursor-pointer !p-0 hover:bg-[#f2eff3]"
			variant={"ghost"}
			onClick={handleProfile}
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
						<UserIcon className="!h-6 !w-6 text-[#6f6d78] group-hover:text-[#3385ff]" />
					</div>
					Profile
				</Button>
			</div>
		</Button>
	);
}
