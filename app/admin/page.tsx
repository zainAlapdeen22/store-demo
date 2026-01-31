"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingCart, DollarSign, Users, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { useState, useEffect } from "react";
import { getDashboardStats } from "@/app/actions";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const { dict } = useI18n();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        getDashboardStats().then(setStats);
    }, []);

    if (!stats) {
        return <div className="p-8 space-y-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
            </div>
        </div>;
    }

    const cards = [
        { title: dict.totalRevenue, value: formatCurrency(stats.totalRevenue), sub: dict.lifetimeRevenue, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
        { title: dict.productsSold, value: stats.productCount, sub: dict.activeProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: dict.totalOrders, value: stats.orderCount, sub: dict.totalOrders, icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: dict.users, value: stats.userCount, sub: dict.registeredAccounts, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="space-y-8 p-4 md:p-0">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    {dict.dashboard}
                </h1>
                <p className="text-muted-foreground">{dict.overview}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-2xl shadow-primary/5 bg-card hover:bg-muted/50 transition-all cursor-pointer group overflow-hidden rounded-3xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">{card.title}</CardTitle>
                                <div className={`${card.bg} ${card.color} p-2 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <card.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter">{card.value}</div>
                                <p className="text-xs font-bold text-muted-foreground mt-1 opacity-60">
                                    {card.sub}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {stats.lowStockProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="border-none shadow-2xl shadow-destructive/10 bg-destructive/5 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-destructive/10 p-6 border-b border-destructive/10">
                            <CardTitle className="flex items-center text-destructive font-black text-xl">
                                <AlertTriangle className="mr-3 h-6 w-6" />
                                {dict.lowStockAlert}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-destructive/10">
                                {stats.lowStockProducts.map((product: any) => (
                                    <div key={product.id} className="flex items-center justify-between p-6 hover:bg-destructive/10 transition-colors">
                                        <div className="flex items-center space-x-6">
                                            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white shadow-sm border border-destructive/20 p-1">
                                                <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover rounded-xl" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg">{product.title}</p>
                                                <p className="text-sm font-bold text-muted-foreground uppercase opacity-60">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-black text-xl text-destructive">{product.stock} {dict.remaining}</p>
                                                <p className="text-sm font-bold opacity-60">{formatCurrency(product.price)}</p>
                                            </div>
                                            <Button variant="destructive" size="sm" className="rounded-xl font-bold px-6 shadow-lg shadow-destructive/20" asChild>
                                                <Link href={`/admin/products/${product.id}`}>{dict.replenish}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

