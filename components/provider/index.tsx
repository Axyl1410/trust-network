"use client";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import * as React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdweb";

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<ThirdwebProvider client={thirdwebClient}>
			<Toaster closeButton position="bottom-right" />
			<NextTopLoader showSpinner={false} zIndex={5000} />
			{children}
		</ThirdwebProvider>
	);
}
