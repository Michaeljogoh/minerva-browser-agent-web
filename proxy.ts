import { clerkMiddleware } from "@clerk/nextjs/server"

// Auth checks live in the protected layouts/pages (see app/app/layout.tsx),
// not in path matching here.
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next internals and static files, always run for API routes.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
