
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsSearch } from "./search";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// @ts-ignore
export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    // @ts-ignore
    const { q } = await searchParams || {};
    const searchQuery = q?.toLowerCase() || "";

    // 1. Fetch detailed sales data
    // Group OrderItems by ProductId to get quantity sold and revenue per product

    // Prisma GroupBy is a bit limited in filtering, so we might fetch all completed/verified orders properly.
    // Let's count items from orders that are NOT cancelled.

    const items = await prisma.orderItem.findMany({
        where: {
            order: {
                status: {
                    not: "CANCELLED"
                }
            },
            // Filter by product title if search query exists
            product: {
                title: {
                    contains: searchQuery,
                    mode: 'insensitive'
                }
            }
        },
        include: {
            product: true,
            order: true
        },
        orderBy: {
            order: {
                createdAt: 'desc'
            }
        }
    });

    // Aggregate in memory
    const productStats = items.reduce((acc, item) => {
        const id = item.productId;
        if (!acc[id]) {
            acc[id] = {
                id: item.productId,
                title: item.product.title,
                imageUrl: item.product.imageUrl,
                quantitySold: 0,
                totalRevenue: 0,
                category: item.product.category
            };
        }
        acc[id].quantitySold += item.quantity;
        acc[id].totalRevenue += item.price * item.quantity;
        return acc;
    }, {} as Record<string, { id: string, title: string, imageUrl: string, quantitySold: number, totalRevenue: number, category: string }>);

    const sortedProducts = Object.values(productStats).sort((a, b) => b.totalRevenue - a.totalRevenue);

    const totalRevenue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItemsSold = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="container py-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                <AnalyticsSearch />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue {searchQuery ? '(Filtered)' : ''}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Items Sold {searchQuery ? '(Filtered)' : ''}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalItemsSold}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Sales History Table */}
            <div className="rounded-md border bg-card">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Detailed Sales Transaction Log</h2>
                </div>
                <div className="relative w-full overflow-auto max-h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(item.order.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <img src={item.product.imageUrl} alt={item.product.title} className="h-8 w-8 rounded object-cover" />
                                            <span className="font-medium text-sm">{item.product.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${{
                                                PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
                                                PAYMENT_VERIFIED: 'bg-blue-100 text-blue-800',
                                                SHIPPED: 'bg-purple-100 text-purple-800',
                                                DELIVERED: 'bg-green-100 text-green-800',
                                                CANCELLED: 'bg-red-100 text-red-800',
                                            }[item.order.status] || 'bg-gray-100'
                                            }`}>
                                            {item.order.status.replace('_', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(item.price * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No sales found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Aggregated Product Summary */}
            <div className="rounded-md border bg-card">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Product Performance Summary</h2>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Units Sold</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {sortedProducts.map((stat) => (
                                <tr key={stat.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <img src={stat.imageUrl} alt={stat.title} className="h-10 w-10 rounded-md object-cover" />
                                            <span>{stat.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{stat.category}</td>
                                    <td className="p-4 align-middle font-semibold">{stat.quantitySold}</td>
                                    <td className="p-4 align-middle">{formatCurrency(stat.totalRevenue)}</td>
                                </tr>
                            ))}
                            {sortedProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No sales data available yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
