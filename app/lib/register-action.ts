"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function register(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            message: "Invalid fields. Failed to register.",
        };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);


    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER", // Default role
            },
        });
    } catch (error: any) {
        console.error("Registration Error:", error);
        if (error.code === 'P2002') {
            return {
                message: "This email is already registered. Please log in.",
            };
        }
        return {
            message: "Database Error: Failed to Create User.",
        };
    }

    // Send verification code
    let userForRedirect = null;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const { randomInt } = await import('crypto');
            const token = randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await prisma.verificationToken.create({
                data: { userId: user.id, token, expiresAt }
            });

            const { sendEmailVerificationCode } = await import('@/lib/email');
            await sendEmailVerificationCode(email, token);

            userForRedirect = user.id;
        }
    } catch (e) {
        console.error("Error in registration post-processing:", e);
    }

    if (userForRedirect) {
        return redirect(`/auth/verify-2fa?userId=${userForRedirect}&type=email`);
    }

    redirect("/login");
}
