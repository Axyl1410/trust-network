import NavHeaderClient from "@/components/layout/NavHeaderClient";
import { Provider } from "@/components/provider";
import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import NavHeaderClient from "@/components/layout/NavHeaderClient";
import { Inter, Roboto_Mono } from "next/font/google";
=======
>>>>>>> origin/dev


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
<<<<<<< HEAD
  return (
    <html lang="en">
      <body
        className={`  antialiased`}
      >
        <Provider>
          <NavHeaderClient />
          {children}
        </Provider>
      </body>
    </html>
  );
=======
	return (
		<html lang="en">
			<body className="antialiased">
				<Provider>
					<NavHeaderClient />
					{children}
				</Provider>
			</body>
		</html>
	);
>>>>>>> origin/dev
}
