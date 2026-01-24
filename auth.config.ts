import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            // Allow public routes
            if (!isOnAdmin) {
                return true;
            }

            // Admin routes require authentication and SUPER_ADMIN role
            if (isOnAdmin) {
                if (!isLoggedIn) {
                    return false; // Redirect to login
                }
                // Only SUPER_ADMIN can access admin routes
                return userRole === "SUPER_ADMIN";
            }

            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
