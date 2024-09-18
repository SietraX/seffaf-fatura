import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export function AuthUI() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <>
          <span>Welcome, {user?.firstName}!</span>
          <Link href="/profile">
            <UserButton />
          </Link>
        </>
      ) : (
        <>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </>
      )}
    </div>
  );
}