import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data (optional - be careful in production!)
    console.log('🗑️  Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.discount.deleteMany();
    await prisma.product.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    // Create admin users with different roles
    console.log('👥 Creating admin users...');

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const superAdmin = await prisma.user.create({
        data: {
            email: 'superadmin@store.com',
            password: hashedPassword,
            name: 'Super Admin',
            phone: '07700000001',
            role: 'SUPER_ADMIN',
            hasSeenOnboarding: true,
        },
    });

    const auditor = await prisma.user.create({
        data: {
            email: 'auditor@store.com',
            password: hashedPassword,
            name: 'Auditor User',
            phone: '07700000002',
            role: 'AUDITOR',
            hasSeenOnboarding: true,
        },
    });

    const supplier = await prisma.user.create({
        data: {
            email: 'supplier@store.com',
            password: hashedPassword,
            name: 'Supplier User',
            phone: '07700000003',
            role: 'SUPPLIER',
            hasSeenOnboarding: true,
        },
    });

    const editor = await prisma.user.create({
        data: {
            email: 'editor@store.com',
            password: hashedPassword,
            name: 'Editor User',
            phone: '07700000004',
            role: 'EDITOR',
            hasSeenOnboarding: true,
        },
    });

    const regularUser = await prisma.user.create({
        data: {
            email: 'user@store.com',
            password: hashedPassword,
            name: 'Regular User',
            phone: '07700000005',
            role: 'USER',
            hasSeenOnboarding: false,
        },
    });

    console.log('✅ Created 5 users (Super Admin, Auditor, Supplier, Editor, Regular User)');

    // Create sample addresses for regular user
    console.log('📍 Creating sample addresses...');

    await prisma.address.createMany({
        data: [
            {
                userId: regularUser.id,
                label: 'Home',
                city: 'المنصور',
                state: 'baghdad',
                country: 'Iraq',
                landmark: 'قرب مول المنصور',
                notes: 'الطابق الثالث',
            },
            {
                userId: regularUser.id,
                label: 'Work',
                city: 'الكرادة',
                state: 'baghdad',
                country: 'Iraq',
                landmark: 'شارع الكرادة الرئيسي',
            },
        ],
    });

    console.log('✅ Created 2 addresses');

    // Create sample products
    console.log('📦 Creating sample products...');

    const products = await Promise.all([
        prisma.product.create({
            data: {
                title: 'iPhone 15 Pro Max',
                description: 'أحدث هاتف من Apple مع شريحة A17 Pro وكاميرا محسنة',
                price: 1500000,
                imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
                stock: 25,
                category: 'Electronics',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Samsung Galaxy S24 Ultra',
                description: 'هاتف سامسونج الرائد مع قلم S Pen وكاميرا 200 ميجابكسل',
                price: 1300000,
                imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
                stock: 30,
                category: 'Electronics',
            },
        }),
        prisma.product.create({
            data: {
                title: 'MacBook Pro 16"',
                description: 'لابتوب احترافي مع شريحة M3 Pro وشاشة Liquid Retina XDR',
                price: 3500000,
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
                stock: 15,
                category: 'Electronics',
            },
        }),
        prisma.product.create({
            data: {
                title: 'AirPods Pro (الجيل الثاني)',
                description: 'سماعات لاسلكية مع إلغاء الضوضاء النشط',
                price: 350000,
                imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
                stock: 50,
                category: 'Accessories',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Apple Watch Series 9',
                description: 'ساعة ذكية مع مستشعرات صحية متقدمة',
                price: 600000,
                imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500',
                stock: 40,
                category: 'Accessories',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Sony WH-1000XM5',
                description: 'سماعات رأس لاسلكية مع أفضل إلغاء للضوضاء',
                price: 450000,
                imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
                stock: 35,
                category: 'Accessories',
            },
        }),
        prisma.product.create({
            data: {
                title: 'iPad Air M2',
                description: 'تابلت قوي مع شريحة M2 وشاشة 11 بوصة',
                price: 900000,
                imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
                stock: 20,
                category: 'Electronics',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Magic Keyboard',
                description: 'لوحة مفاتيح لاسلكية من Apple',
                price: 150000,
                imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
                stock: 45,
                category: 'Accessories',
            },
        }),
        // Men's Clothing
        prisma.product.create({
            data: {
                title: 'Classic White T-Shirt',
                description: 'تيشيرت قطني كلاسيكي عالي الجودة',
                price: 25000,
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
                stock: 100,
                category: 'Men',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Denim Jacket',
                description: 'جاكيت جينز عصري ومريح',
                price: 75000,
                imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=500',
                stock: 50,
                category: 'Men',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Formal Suit',
                description: 'بدلة رسمية أنيقة للمناسبات',
                price: 250000,
                imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=500',
                stock: 20,
                category: 'Men',
            },
        }),
        // Women's Clothing
        prisma.product.create({
            data: {
                title: 'Summer Floral Dress',
                description: 'فستان صيفي مزهر بتصميم رائع',
                price: 65000,
                imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=500',
                stock: 60,
                category: 'Women',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Elegant Blouse',
                description: 'بلوزة أنيقة مناسبة للعمل والخروجات',
                price: 45000,
                imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=500',
                stock: 40,
                category: 'Women',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Leather Handbag',
                description: 'حقيبة يد جلدية فاخرة',
                price: 120000,
                imageUrl: 'https://images.unsplash.com/photo-1590874102752-ce35d65f5905?auto=format&fit=crop&q=80&w=500',
                stock: 30,
                category: 'Women',
            },
        }),
        // More Accessories
        prisma.product.create({
            data: {
                title: 'Aviator Sunglasses',
                description: 'نظارات شمسية كلاسيكية بتصميم الطيارين',
                price: 35000,
                imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=500',
                stock: 80,
                category: 'Accessories',
            },
        }),
        prisma.product.create({
            data: {
                title: 'Leather Wallet',
                description: 'محفظة جلدية رجالية عالية المتانة',
                price: 50000,
                imageUrl: '/products/leather-wallet-open.jpg',
                stock: 70,
                category: 'Accessories',
            },
        }),
        prisma.product.create({
            data: {
                title: "Men's Leather Handbag",
                description: 'حقيبة يد رجالية فاخرة وعملية',
                price: 20000,
                imageUrl: '/products/mens-handbag-update.png',
                stock: 40,
                category: 'Men',
            },
        }),
    ]);

    console.log('✅ Created 8 products');

    // Create sample discounts
    console.log('🏷️  Creating sample discounts...');

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    await prisma.discount.createMany({
        data: [
            {
                code: 'WELCOME10',
                percentage: 10,
                startDate: now,
                endDate: futureDate,
            },
            {
                code: 'SAVE50K',
                amount: 50000,
                startDate: now,
                endDate: futureDate,
            },
            {
                percentage: 15,
                startDate: now,
                endDate: futureDate,
                productId: products[0].id, // iPhone discount
            },
            {
                percentage: 20,
                startDate: now,
                endDate: futureDate,
                productId: products[3].id, // AirPods discount
            },
        ],
    });

    console.log('✅ Created 4 discounts');

    // Create sample orders
    console.log('📋 Creating sample orders...');

    const order1 = await prisma.order.create({
        data: {
            userId: regularUser.id,
            total: 1500000,
            status: 'PENDING_PAYMENT',
            paymentPhoneNumber: '07700000005',
            recipientName: 'Regular User',
            shippingAddress: 'baghdad: المنصور, قرب مول المنصور (الطابق الثالث)',
            items: {
                create: [
                    {
                        productId: products[0].id,
                        quantity: 1,
                        price: 1500000,
                    },
                ],
            },
        },
    });

    const order2 = await prisma.order.create({
        data: {
            userId: regularUser.id,
            total: 800000,
            status: 'PAYMENT_VERIFIED',
            paymentPhoneNumber: '07700000005',
            recipientName: 'Regular User',
            shippingAddress: 'baghdad: الكرادة, شارع الكرادة الرئيسي',
            items: {
                create: [
                    {
                        productId: products[3].id,
                        quantity: 1,
                        price: 350000,
                    },
                    {
                        productId: products[7].id,
                        quantity: 3,
                        price: 150000,
                    },
                ],
            },
        },
    });

    console.log('✅ Created 2 sample orders');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin: superadmin@store.com / Admin@123');
    console.log('Auditor:     auditor@store.com / Admin@123');
    console.log('Supplier:    supplier@store.com / Admin@123');
    console.log('Editor:      editor@store.com / Admin@123');
    console.log('Regular User: user@store.com / Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
