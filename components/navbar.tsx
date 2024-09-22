'use client'

import Link from 'next/link'
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { ThemeToggle } from '@/components/theme-toggle'

export function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="flex justify-between items-center p-4 bg-background shadow h-[6vh]">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <Link href="/" className="text-foreground text-xl font-bold">
          Fatura
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isSignedIn ? (
          <>
            <span className="text-foreground">{user?.firstName} {user?.lastName?.slice(0,1)}.</span>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded">
              Giriş Yap
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  )
}