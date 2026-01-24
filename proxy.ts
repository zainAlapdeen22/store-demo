import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
    // Rate Limiting for Auth Routes
    if (req.nextUrl.pathname.startsWith("/api/auth") || req.nextUrl.pathname === "/login") {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        if (rateLimit(ip, 10, 60 * 1000)) {
            return new NextResponse("Too Many Requests", { status: 429 });
        }
    }

    // Auth logic handled by authConfig
}) as any;

export const config = {
    // Matcher including api routes for rate limiting
    matcher: ["/admin/:path*", "/login", "/api/auth/:path*"],
};
