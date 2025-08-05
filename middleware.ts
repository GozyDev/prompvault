import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  console.log("middleware running on", req.nextUrl.pathname);

  // try {
  //   const baseUrl = req.nextUrl.origin; // e.g. http://localhost:3000 or your deployed domain
  //   const response = await fetch(`${baseUrl}/api/auth/status`, {
  //     headers: {
  //       cookie: req.headers.get("cookie") || "", // manually pass cookies
  //     },
  //   });

  //   const dataBody = await response.json();

  //   if (!response.ok) {
  //     console.log("Not authenticated:", dataBody);
  //     return NextResponse.redirect(new URL("/signIn", req.url));
  //   } else {
  //     console.log("Authenticated user:", dataBody.user);
  //     return NextResponse.next();
  //   }
  // } catch (error) {
  //   console.error("Middleware error:", error);
  //   return NextResponse.redirect(new URL("/signIn", req.url));
  // }
}

export const config = {
  matcher: [
    "/explore/:path*",
    "/create/:path*",
    "/profile/:path*",
    "/prompt/:path*",
  ],
};
