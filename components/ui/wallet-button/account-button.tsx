import { formatAddress } from "@/lib/utils";
import { memo, useCallback } from "react";
import { Blobbie } from "thirdweb/react";
import { Button } from "../button";

interface AccountButtonProps {
  address: string;
  onClick: () => void;
}

const AccountButton = memo(({ address, onClick }: AccountButtonProps) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <Button
      variant={"outline"}
      onClick={handleClick}
      className="flex cursor-pointer items-center dark:bg-transparent"
    >
      <Blobbie address={address} className="mr-1 size-6 rounded-full" />
      {formatAddress(address)}
    </Button>
  );
});

AccountButton.displayName = "AccountButton";

export { AccountButton };
