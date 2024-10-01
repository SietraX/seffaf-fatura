"use client";

import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { SubmitBillButton } from "@/components/submit-bill-button";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="flex justify-between items-center p-4 bg-background h-[6vh] bg-black">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-8" quality={100} />
        <span className="text-foreground text-xl font-bold text-white">
          Fatura
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        {isDashboard && <SubmitBillButton isNavbar={true} />}
        {isSignedIn ? (
          <>
            <span className="text-foreground hidden sm:inline text-white">
              {user?.firstName} {user?.lastName?.slice(0, 1)}.
            </span>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded text-sm sm:text-base text-white">
              Giriş Yap
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
