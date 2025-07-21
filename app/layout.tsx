
import { Provider } from "@/components/provider";
import type { Metadata } from "next";
import "./globals.css";
import NavHeaderClient from "@/components/layout/NavHeaderClient";
import { Inter, Roboto_Mono } from "next/font/google";


const robotoMono = Roboto_Mono({ subsets: ["latin"] });
export const metadata: Metadata = {
	title: "Trust Network - Find a company you can trust",
	description: "Discover, read, and write reviews for companies you can trust",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`pt-16 antialiased`}
      >
        <Provider >
          <NavHeaderClient />
          {children}
        </Provider>
      </body>
    </html>
  );
}
