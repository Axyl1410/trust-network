"use client";
import { Toaster } from "@/components/ui/sonner";
import * as React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<ThirdwebProvider client={thirdwebClient}>
			<Toaster closeButton position="bottom-right" />
			{children}
		</ThirdwebProvider>
	);
}
