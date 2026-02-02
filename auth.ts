import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(4) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // 1. Check if it's a standard password login
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;

                    // 2. Check if it's a 2FA verification login
                    const twoFactorToken = await prisma.twoFactorToken.findFirst({
                        where: {
                            userId: user.id,
                            token: password,
                            verified: true,
                        }
                    });

                    if (twoFactorToken) {
                        // Check if token is still valid (e.g., within 10 mins of creation and 2 mins of verification)
                        const now = new Date();
                        const isRecentlyVerified = (now.getTime() - twoFactorToken.createdAt.getTime()) < (12 * 60 * 1000); // within 10 + 2 mins

                        if (isRecentlyVerified) {
                            // Clean up the token after successful login
                            await prisma.twoFactorToken.delete({
                                where: { id: twoFactorToken.id }
                            });
                            return user;
                        }
                    }

                    // 3. Check if it's an initial Email verification login
                    const verificationToken = await prisma.verificationToken.findFirst({
                        where: {
                            userId: user.id,
                            token: password,
                            verified: true,
                        }
                    });

                    if (verificationToken) {
                        // Check if token is still valid
                        const now = new Date();
                        const isRecentlyVerified = (now.getTime() - verificationToken.createdAt.getTime()) < (16 * 60 * 1000); // within 15 + 1 mins

                        if (isRecentlyVerified) {
                            // Clean up the token after successful login
                            await prisma.verificationToken.delete({
                                where: { id: verificationToken.id }
                            });
                            return user;
                        }
                    }
                }

                return null;
            },
        }),
    ],
});

