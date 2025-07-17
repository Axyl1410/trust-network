<<<<<<< HEAD
"use client";
=======
import { Toaster } from "@/components/ui/sonner";
>>>>>>> origin/dev
import * as React from "react";
import { ThirdwebProvider } from "thirdweb/react";

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<ThirdwebProvider>
			<Toaster closeButton position="bottom-right" />
			{children}
		</ThirdwebProvider>
	);
}
