import { thirdwebClient } from "@/lib/thirdweb";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { WalletConnectButton } from "../common/wallet-button";

export default function NavHeader() {
<<<<<<< HEAD
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full border-b bg-white px-0 py-2 flex items-center h-16">
      <div className="w-full max-w-6xl mx-auto flex items-center h-16 px-4 sm:px-8">
        {/* Logo trái */}
        <div className="flex items-center min-w-[140px]">
          
          <Link href="/"> <span className="text-green-600 text-xl mr-2">★</span>
          <span className="font-semibold text-lg text-gray-900">Trust Network</span></Link>
        </div>
        {/* Links căn giữa - ẩn trên mobile */}
        <nav className="flex-1 justify-center gap-8 hidden md:flex">
          <Link href="/review" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Write a review</Link>
          <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Categories</Link>
          <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Blog</Link>
        </nav>
        {/* Nút phải - ẩn trên mobile */}
        <div className="flex items-center gap-3 min-w-[180px] justify-end hidden md:flex">
          <Link href="/business" className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition shadow-sm">For businesses</Link>
          <CustomConnectWalletButton />
        </div>
        {/* Hamburger menu - chỉ hiện trên mobile */}
        <button
          className="ml-auto flex md:hidden items-center justify-center p-2 rounded hover:bg-gray-100"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={26} />
        </button>
      </div>
      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden" onClick={() => setOpen(false)}>
          <div
            className="bg-white w-4/5 max-w-xs h-full shadow-lg flex flex-col p-6 gap-4 animate-slide-in-left"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="self-end mb-2 p-2 rounded hover:bg-gray-100"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X size={26} />
            </button>
            <nav className="flex flex-col gap-4 mt-4">
              <Link href="/review" className="text-base font-medium text-gray-700 hover:text-blue-600 transition" onClick={() => setOpen(false)}>Write a review</Link>
              <Link href="/categories" className="text-base font-medium text-gray-700 hover:text-blue-600 transition" onClick={() => setOpen(false)}>Categories</Link>
              <Link href="/blog" className="text-base font-medium text-gray-700 hover:text-blue-600 transition" onClick={() => setOpen(false)}>Blog</Link>
              <Link href="/login" className="text-base font-medium text-gray-700 hover:text-blue-600 transition" onClick={() => setOpen(false)}>Log in</Link>
            </nav>
            <div className="flex flex-col gap-3 mt-6">
              <Link href="/business" className="px-4 py-2 rounded bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 transition shadow-sm text-center" onClick={() => setOpen(false)}>For businesses</Link>
              <CustomConnectWalletButton />
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-in-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </header>
  );
=======
	const [open, setOpen] = useState(false);
	return (
		<header className="flex h-16 w-full items-center border-b bg-white px-0 py-2">
			<div className="sr-only">
				<ConnectButton client={thirdwebClient} />
			</div>
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
						href="/shop"
						className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
					>
						Shop
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
>>>>>>> origin/dev
}
