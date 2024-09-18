import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/'])

export default clerkMiddleware((auth, req) => {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  if (isPublicRoute(req)) {
    console.log('Public route, skipping auth check');
    return
  }
  // If the route is not public, Clerk will handle authentication
})

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
