import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/actions";
import { auth } from "@/auth";
import { Printer } from "lucide-react";
import Link from "next/link";

// @ts-ignore
export default async function AdminOrdersPage({ searchParams }: { searchParams: { period?: string } }) {
    const session = await auth();
    const role = session?.user?.role;

    // Fix: Wait for searchParams (Next.js 15)
    // @ts-ignore
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

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Phone</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.user.name || "Guest"}</span>
                                        <span className="text-xs text-muted-foreground">{order.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'PAYMENT_VERIFIED' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </TableCell>
                                <TableCell>{order.paymentPhoneNumber || "-"}</TableCell>
                                <TableCell>{formatCurrency(order.total)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <form action={updateOrderStatus}>
                                            <input type="hidden" name="orderId" value={order.id} />
                                            <select
                                                name="status"
                                                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                                defaultValue={order.status}
                                            >
                                                <option value="PENDING_PAYMENT">Pending Payment</option>
                                                <option value="PAYMENT_VERIFIED">Payment Verified</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                            <Button size="sm" variant="ghost" className="ml-2 h-8">Update</Button>
                                        </form>
                                        <Button size="icon" variant="outline" className="h-8 w-8" asChild>
                                            <Link href={`/admin/orders/${order.id}/invoice`} target="_blank">
                                                <Printer className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
