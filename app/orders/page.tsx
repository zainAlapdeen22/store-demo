import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrdersView } from "@/components/orders-view";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {

    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container py-20 px-6 max-w-6xl mx-auto">
            <OrdersView orders={orders} />
        </div>
    );
}

