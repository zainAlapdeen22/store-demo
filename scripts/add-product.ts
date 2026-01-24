
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Adding iPhone 15 Pro Max...');

    const product = await prisma.product.create({
        data: {
            title: 'iPhone 15 Pro Max',
            description: 'The ultimate iPhone with titanium design, A17 Pro chip, and the most powerful iPhone camera system ever.',
            price: 1850000, // 1,850,000 IQD
            stock: 10,
            category: 'Phones',
            imageUrl: '/products/iphone-15-pro-max.png',
            variants: JSON.stringify({
                colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                storage: ['256GB', '512GB', '1TB']
            }),
        },
    });

    console.log('Product created:', product.title);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
