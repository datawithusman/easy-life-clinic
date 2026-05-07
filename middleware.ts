import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Assistant panel — requires ASSISTANT or ADMIN
    if (pathname.startsWith("/assistant")) {
      if (!token || !["ASSISTANT", "ADMIN"].includes(token.role as string)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Admin panel — requires ADMIN only
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Protected routes require a session
        if (
          pathname.startsWith("/assistant") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/my-bookings")
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/assistant/:path*", "/admin/:path*", "/my-bookings/:path*"],
};
