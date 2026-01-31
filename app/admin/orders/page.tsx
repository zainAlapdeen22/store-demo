import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { OrderRow } from "@/components/admin/order-row";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
    const session = await auth();
    const role = session?.user?.role;

    const { period } = await searchParams || {};

    let dateFilter = {};
    const now = new Date();

    if (period === 'today') {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        dateFilter = { gte: startOfDay };
    } else if (period === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - 7));
        dateFilter = { gte: startOfWeek };
    } else if (period === 'month') {
        const startOfMonth = new Date(now.setMonth(now.getMonth() - 1));
        dateFilter = { gte: startOfMonth };
    }

    const orders = await prisma.order.findMany({
        where: {
            createdAt: dateFilter
        },
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders">All</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders?period=today">Today</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders?period=week">This Week</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders?period=month">This Month</Link>
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Phone</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <OrderRow key={order.id} order={order} />
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
