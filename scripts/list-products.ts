
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: { title: true, category: true, id: true }
    });
    console.log('Current Products:');
    products.forEach(p => {
        console.log(`- [${p.category}] ${p.title} (${p.id})`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
