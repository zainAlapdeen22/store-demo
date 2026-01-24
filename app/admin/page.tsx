import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingCart, DollarSign, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

async function getStats() {
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const userCount = await prisma.user.count();
    const totalRevenue = await prisma.order.aggregate({
        _sum: {
            total: true,
        },
    });

    const lowStockProducts = await prisma.product.findMany({
        where: {
            stock: {
                lte: 5
            }
        },
        take: 5
    });

    return {
        productCount,
        orderCount,
        userCount,
        totalRevenue: totalRevenue._sum.total || 0,
        lowStockProducts
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="container py-10 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/analytics">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                Lifetime revenue
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/analytics">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.productCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Active products
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/orders">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.orderCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Total orders placed
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/users">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.userCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered accounts
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {stats.lowStockProducts.length > 0 && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="flex items-center text-destructive">
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.lowStockProducts.map(product => (
                                <div key={product.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 border-destructive/20">
                                    <div className="flex items-center space-x-4">
                                        <img src={product.imageUrl} alt={product.title} className="h-10 w-10 rounded object-cover" />
                                        <div>
                                            <p className="font-medium">{product.title}</p>
                                            <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-destructive">{product.stock} remaining</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                                        </div>
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="outline" size="sm">Replenish</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div >
    );
}
