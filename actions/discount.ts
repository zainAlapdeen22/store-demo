"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const discountSchema = z.object({
    code: z.string().optional(),
    percentage: z.coerce.number().min(0).max(100).optional(),
    amount: z.coerce.number().min(0).optional(),
    startDate: z.string(),
    endDate: z.string(),
    productId: z.string().optional(),
}).refine((data) => data.percentage || data.amount, {
    message: "Either percentage or amount must be provided",
    path: ["percentage"],
});

export async function createDiscount(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    const data = {
        code: formData.get("code") as string || undefined,
        percentage: formData.get("percentage") || undefined,
        amount: formData.get("amount") || undefined,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        productId: formData.get("productId") as string || undefined,
    };

    const validated = discountSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        await prisma.discount.create({
            data: {
                code: validated.data.code,
                percentage: validated.data.percentage,
                amount: validated.data.amount,
                startDate: new Date(validated.data.startDate),
                endDate: new Date(validated.data.endDate),
                productId: validated.data.productId,
            },
        });
        revalidatePath("/admin/discounts");
        revalidatePath("/"); // Revalidate home to show new prices
        return { success: true };
    } catch (error) {
        return { error: "Failed to create discount" };
    }
}

export async function deleteDiscount(id: string) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.discount.delete({
            where: { id },
        });
        revalidatePath("/admin/discounts");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete discount" };
    }
}
