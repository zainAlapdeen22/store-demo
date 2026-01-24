
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Reorganizing products...');

    // Update known electronics
    await prisma.product.updateMany({
        where: {
            OR: [
                { title: { contains: 'iPhone', mode: 'insensitive' } },
                { title: { contains: 'سماعه', mode: 'insensitive' } }, // Headphones
                { title: { contains: 'شاحن', mode: 'insensitive' } },  // Charger
                { title: { contains: 'Laptop', mode: 'insensitive' } }
            ]
        },
        data: { category: 'Electronics' }
    });

    // Update Accessories (bags, watches)
    await prisma.product.updateMany({
        where: {
            OR: [
                { title: { contains: 'حقيبة', mode: 'insensitive' } },
                { title: { contains: 'Bag', mode: 'insensitive' } },
                { title: { contains: 'ساعة', mode: 'insensitive' } },
                { title: { contains: 'Watch', mode: 'insensitive' } }
            ]
        },
        data: { category: 'Accessories' }
    });

    console.log('Categories updated successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
