import { memo, useCallback } from "react";
import { Button } from "../../ui/button";

interface ConnectButtonProps {
	onClick: () => void;
}

const ConnectButton = memo(({ onClick }: ConnectButtonProps) => {
	const handleClick = useCallback(() => {
		onClick();
	}, [onClick]);

	return (
		<Button onClick={handleClick} className="cursor-pointer">
			Connect
		</Button>
	);
});

ConnectButton.displayName = "ConnectButton";

export { ConnectButton };
