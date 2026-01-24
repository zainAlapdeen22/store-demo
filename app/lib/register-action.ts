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

    // Auto-login after successful registration
    await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
    });
}
