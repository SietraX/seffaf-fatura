'use client'

import Link from 'next/link'
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl">Fatura</span>
      </div>
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <span>{user?.firstName} {user?.lastName?.slice(0,1)}.</span>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Giriş Yap
              </button>
            </SignInButton>
            
          </>
        )}
      </div>
    </nav>
  )
}