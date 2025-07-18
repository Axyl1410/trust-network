"use client";

import { WalletConnectButton } from "@/components/common/wallet-button";
import { useActiveAccount } from "thirdweb/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();

  if (!account?.address) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border bg-white shadow p-6">
          <div className="mb-4 border-b pb-2">
            <div className="text-xl font-bold mb-1">Please connect your wallet</div>
            <div className="text-gray-500 text-sm">You need to connect your wallet to access this page.</div>
          </div>
          <div>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
