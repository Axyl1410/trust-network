"use client"
import { useActiveAccount, useConnectModal, useWalletDetailsModal } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

function shortAddress(address?: string) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function CustomConnectWalletButton() {
  const account = useActiveAccount();
  const { connect } = useConnectModal();
  const detailsModal = useWalletDetailsModal();
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>("");

  

  if (!account) {
    return (
      <button
        onClick={() => connect({ client: thirdwebClient })}
        className="px-4 py-2 rounded bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition shadow-sm flex items-center gap-2"
      >
        <Wallet size={18} />
        Login
      </button>
    );
  }

  return (
    <button
      onClick={() => detailsModal.open({ client: thirdwebClient })}
      className="flex items-center gap-2 px-4 py-2 rounded bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
    >
      <span className="truncate max-w-[100px]">{shortAddress(account.address)}</span>
      {balance !== null ? (
        <span className="ml-2 text-xs text-gray-300">{balance} {symbol}</span>
      ) : (
        <span className="ml-2 text-xs text-gray-300">...</span>
      )}
    </button>
  );
}