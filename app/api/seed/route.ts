import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/**
 * Seed Route - Creates Super Admin User
 * مسار إنشاء السوبر أدمن
 * 
 * Access this route after deployment to create your first admin user:
 * استخدم هذا المسار بعد النشر لإنشاء أول مستخدم أدمن:
 * GET /api/seed
 */
export async function GET() {
    try {
        // 1. Create Super Admin
        const email = "admin@store.com";
        const password = await bcrypt.hash("admin123", 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password,
                name: "Super Admin",
                role: "SUPER_ADMIN",
                phone: "070000000",
            }
        });

        // 2. Sample Products Data
        const products = [
            {
                title: "Classic White T-Shirt",
                description: "Premium cotton t-shirt essential for any wardrobe. Breathable and comfortable.",
                price: 25000,
                imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
                stock: 100,
                category: "Men",
                variants: JSON.stringify({ sizes: ["S", "M", "L", "XL"], colors: ["White", "Black"] })
            },
            {
                title: "Denim Jacket",
                description: "Classic blue denim jacket with a modern fit. Rugged and stylish.",
                price: 75000,
                imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
                stock: 50,
                category: "Men",
                variants: JSON.stringify({ sizes: ["S", "M", "L"], colors: ["Blue"] })
            },
            {
                title: "Floral Summer Dress",
                description: "Lightweight and airy dress perfect for summer days. Floral print.",
                price: 55000,
                imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
                stock: 30,
                category: "Women",
                variants: JSON.stringify({ sizes: ["XS", "S", "M"], colors: ["Red", "Floral"] })
            },
            {
                title: "Elegant Blouse",
                description: "Sophisticated blouse suitable for office and casual wear.",
                price: 45000,
                imageUrl: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
                stock: 45,
                category: "Women",
                variants: JSON.stringify({ sizes: ["S", "M", "L"], colors: ["White", "Beige"] })
            },
            {
                title: "Kids Colorful Hoodie",
                description: "Warm and cozy hoodie for active kids. Bright colors.",
                price: 35000,
                imageUrl: "https://images.unsplash.com/photo-1519238263496-634399464f93?w=800&q=80",
                stock: 60,
                category: "Kids",
                variants: JSON.stringify({ sizes: ["2Y", "4Y", "6Y"], colors: ["Yellow", "Blue"] })
            },
            {
                title: "Leather Watch",
                description: "Premium leather wrist watch. Elegant and timeless design.",
                price: 120000,
                imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
                stock: 20,
                category: "Accessories",
                variants: JSON.stringify({ colors: ["Brown", "Black"] })
            },
            {
                title: "Sunglasses",
                description: "UV protection stylish sunglasses.",
                price: 45000,
                imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
                stock: 50,
                category: "Accessories",
                variants: JSON.stringify({ colors: ["Black", "Gold"] })
            },
        ];

        // 3. Create Products if they don't exist
        // We will create them one by one to avoid duplicates if possible, or just create them
        // For simplicity in this seed, we'll try to create them. 
        // In a real app, you might check if they exist by title or similar.

        let createdCount = 0;
        for (const product of products) {
            const count = await prisma.product.count({ where: { title: product.title } });
            if (count === 0) {
                await prisma.product.create({ data: product });
                createdCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `✅ Seed completed! Created Super Admin + ${createdCount} new products.`,
            credentials: {
                email: "admin@store.com",
                password: "admin123",
                note: "⚠️ Please change the password after first login!"
            },
            stats: {
                productsCreated: createdCount,
                totalProducts: await prisma.product.count()
            },
            accessUrls: {
                login: "/api/auth/signin",
                adminDashboard: "/admin",
                superAdminDashboard: "/admin/super"
            }
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            tip: "Make sure DATABASE_URL is correctly set in environment variables"
        }, { status: 500 });
    }
}
