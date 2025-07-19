import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WalletConnectButton } from "../common/wallet-button";

export default function NavHeader() {
	const [open, setOpen] = useState(false);
	return (
		<header className="flex h-16 w-full items-center border-b bg-white px-0 py-2">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-8">
				{/* Logo trái */}
				<Link
					href="/"
					className="flex min-w-[140px] items-center transition-opacity hover:opacity-80"
				>
					<span className="mr-2 text-xl text-green-600">★</span>
					<span className="text-lg font-semibold text-gray-900">Trust Network</span>
				</Link>

				{/* Links căn giữa - ẩn trên mobile */}
				<nav className="hidden flex-1 justify-center gap-8 md:flex">
					<Link
						href="/review"
						className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
					>
						Write a review
					</Link>
					<Link
						href="/categories"
						className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
					>
						Categories
					</Link>
					<Link
						href="/blog"
						className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
					>
						Blog
					</Link>
					<Link
						href="/login"
						className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
					>
						Log in
					</Link>
				</nav>

				{/* Nút phải - ẩn trên mobile */}
				<div className="hidden min-w-[180px] items-center justify-end gap-3 md:flex">
					<Link
						href="/business"
						className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
					>
						For businesses
					</Link>
					<WalletConnectButton />
				</div>

				{/* Hamburger menu - chỉ hiện trên mobile */}
				<button
					className="ml-auto flex items-center justify-center rounded p-2 hover:bg-gray-100 md:hidden"
					aria-label="Open menu"
					onClick={() => setOpen(true)}
				>
					<Menu size={26} />
				</button>
			</div>

			{/* Mobile menu overlay */}
			{open && (
				<div
					className="fixed inset-0 z-50 flex bg-black/40 md:hidden"
					onClick={() => setOpen(false)}
				>
					<div
						className="animate-slide-in-left flex h-full w-4/5 max-w-xs flex-col gap-4 bg-white p-6 shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="mb-2 self-end rounded p-2 hover:bg-gray-100"
							aria-label="Close menu"
							onClick={() => setOpen(false)}
						>
							<X size={26} />
						</button>
						<nav className="mt-4 flex flex-col gap-4">
							<Link
								href="/review"
								className="text-base font-medium text-gray-700 transition hover:text-blue-600"
								onClick={() => setOpen(false)}
							>
								Write a review
							</Link>
							<Link
								href="/categories"
								className="text-base font-medium text-gray-700 transition hover:text-blue-600"
								onClick={() => setOpen(false)}
							>
								Categories
							</Link>
							<Link
								href="/blog"
								className="text-base font-medium text-gray-700 transition hover:text-blue-600"
								onClick={() => setOpen(false)}
							>
								Blog
							</Link>
							<Link
								href="/login"
								className="text-base font-medium text-gray-700 transition hover:text-blue-600"
								onClick={() => setOpen(false)}
							>
								Log in
							</Link>
						</nav>
						<div className="mt-6 flex flex-col gap-3">
							<Link
								href="/business"
								className="rounded bg-blue-700 px-4 py-2 text-center text-base font-semibold text-white shadow-sm transition hover:bg-blue-800"
								onClick={() => setOpen(false)}
							>
								For businesses
							</Link>
							<WalletConnectButton />
						</div>
					</div>
				</div>
			)}

			<style jsx global>{`
				@keyframes slide-in-left {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(0);
					}
				}
				.animate-slide-in-left {
					animation: slide-in-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
				}
			`}</style>
		</header>
	);
}
