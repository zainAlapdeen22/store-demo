"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const variantsString = formData.get("variants") as string;
    let variants = null;
    try {
        variants = variantsString ? JSON.parse(variantsString) : null;
    } catch (e) {
        console.error("Failed to parse variants JSON:", e);
    }

    await prisma.product.create({
        data: {
            title,
            description,
            price,
            stock,
            category,
            imageUrl,
            variants,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const variantsString = formData.get("variants") as string;
    let variants = null;
    try {
        variants = variantsString ? JSON.parse(variantsString) : null;
    } catch (e) {
        console.error("Failed to parse variants JSON:", e);
    }

    await prisma.product.update({
        where: { id },
        data: {
            title,
            description,
            price,
            stock,
            category,
            imageUrl,
            variants,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.product.delete({
        where: { id }
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
}

export async function createOrder(
    items: { productId: string; quantity: number }[],
    paymentPhoneNumber: string,
    address: string,
    recipientName: string
) {
    const session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
        // For guest checkout, we might want to create a temporary user or require login.
        // For this V3 requirement, let's assume we require login or just create a guest user based on phone?
        // Let's stick to the existing guest logic for now but ideally require login.
        let user = await prisma.user.findFirst({ where: { email: "guest@example.com" } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: "guest@example.com",
                    password: "guest",
                    name: "Guest User",
                    role: "USER"
                }
            });
        }
        userId = user.id;
    }

    // Calculate total and verify stock
    let total = 0;
    const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
            throw new Error(`Product ${product?.title || 'Unknown'} is out of stock`);
        }
        total += product.price * item.quantity;
        orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
        });
    }

    // Transaction
    await prisma.$transaction(async (tx) => {
        // Create Order
        const order = await tx.order.create({
            data: {
                userId: userId!,
                total,
                status: "PENDING_PAYMENT",
                paymentPhoneNumber,
                shippingAddress: address,
                recipientName,
                items: {
                    create: orderItemsData
                }
            }
        });

        // Update Stock
        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/");
}



export async function updateUserRole(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;

    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath("/");
}

export async function updateOrderStatus(formData: FormData) {
    const session = await auth();
    const role = session?.user?.role;

    // Basic RBAC for status updates
    if (!role || role === "USER") {
        throw new Error("Unauthorized");
    }

    const orderId = formData.get("orderId") as string;
    const newStatus = formData.get("status") as string;

    if (!orderId || !newStatus) return;

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
        });

        // Revalidate all related paths
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath("/orders");
        revalidatePath("/", "layout"); // Global revalidate as a safety measure for status changes
    } catch (error) {
        console.error("Failed to update order status:", error);
        throw new Error("Action failed");
    }
}


export async function createAdminUser(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        revalidatePath("/admin/super");
    } catch (error) {
        console.error("Failed to create admin:", error);
        throw new Error("Failed to create user. Email might be taken.");
    }
}

export async function getDashboardStats() {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN" && session?.user?.role !== "AUDITOR") {
        throw new Error("Unauthorized");
    }

    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const userCount = await prisma.user.count();
    const totalRevenue = await prisma.order.aggregate({
        _sum: {
            total: true,
        },
    });

    const lowStockProducts = await prisma.product.findMany({
        where: {
            stock: {
                lte: 5
            }
        },
        take: 5
    });

    return {
        productCount,
        orderCount,
        userCount,
        totalRevenue: totalRevenue._sum.total || 0,
        lowStockProducts
    };
}

