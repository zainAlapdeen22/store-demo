"use server";
// Force recompile

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const addressSchema = z.object({
    label: z.string().min(1, "Label is required"),
    street: z.string().optional(), // Made optional as we focus on Region/Landmark
    city: z.string().min(1, "Region is required"), // Region
    state: z.string().min(1, "Governorate is required"), // Governorate
    zip: z.string().optional(),
    country: z.string().default("Iraq"),
    landmark: z.string().min(1, "Landmark is required"),
    notes: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const data = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
    };

    const validated = profileSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: validated.data,
        });
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update profile" };
    }
}

export async function addAddress(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const data = {
        label: formData.get("label") as string,
        street: (formData.get("street") as string) || undefined,
        city: formData.get("city") as string, // Region
        state: formData.get("state") as string, // Governorate
        zip: (formData.get("zip") as string) || undefined,
        country: (formData.get("country") as string) || "Iraq",
        landmark: formData.get("landmark") as string,
        notes: (formData.get("notes") as string) || undefined,
    };

    const validated = addressSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        const newAddress = await prisma.address.create({
            data: {
                ...validated.data,
                userId: session.user.id!,
            },
        });
        revalidatePath("/profile");
        revalidatePath("/checkout");
        return { success: true, address: newAddress };
    } catch (error) {
        console.error("Error adding address:", error);
        return { error: "Failed to add address: " + (error instanceof Error ? error.message : String(error)) };
    }
}

export async function deleteAddress(addressId: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        const address = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!address || address.userId !== session.user.id) {
            return { error: "Unauthorized" };
        }

        await prisma.address.delete({
            where: { id: addressId },
        });
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete address" };
    }
}

export async function completeOnboarding() {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { hasSeenOnboarding: true },
        });
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        return { error: "Failed to complete onboarding" };
    }
}
export async function getAddresses() {
    const session = await auth();
    if (!session?.user) {
        return [];
    }

    try {
        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });
        return addresses;
    } catch (error) {
        console.error("Failed to fetch addresses:", error);
        return [];
    }
}
