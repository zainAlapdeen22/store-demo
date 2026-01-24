const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            title: "Classic White T-Shirt",
            description: "A comfortable and stylish white t-shirt made from 100% cotton.",
            price: 25000,
            imageUrl: "https://placehold.co/600x400?text=White+T-Shirt",
            stock: 100,
            category: "Men",
            variants: JSON.stringify({ sizes: ["S", "M", "L", "XL"], colors: ["White"] }),
        },
        {
            title: "Denim Jeans",
            description: "High-quality denim jeans with a modern fit.",
            price: 45000,
            imageUrl: "https://placehold.co/600x400?text=Jeans",
            stock: 50,
            category: "Men",
            variants: JSON.stringify({ sizes: ["30", "32", "34", "36"], colors: ["Blue", "Black"] }),
        },
        {
            title: "Floral Summer Dress",
            description: "Light and airy dress perfect for summer days.",
            price: 35000,
            imageUrl: "https://placehold.co/600x400?text=Dress",
            stock: 30,
            category: "Women",
            variants: JSON.stringify({ sizes: ["XS", "S", "M", "L"], colors: ["Floral"] }),
        },
        {
            title: "Kids Hoodie",
            description: "Warm and cozy hoodie for children.",
            price: 20000,
            imageUrl: "https://placehold.co/600x400?text=Hoodie",
            stock: 40,
            category: "Kids",
            variants: JSON.stringify({ sizes: ["4y", "6y", "8y", "10y"], colors: ["Red", "Blue"] }),
        },
        {
            title: "Leather Wallet",
            description: "Genuine leather wallet with multiple card slots.",
            price: 15000,
            imageUrl: "https://placehold.co/600x400?text=Wallet",
            stock: 20,
            category: "Accessories",
            variants: JSON.stringify({ colors: ["Brown", "Black"] }),
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('Seeded products');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
