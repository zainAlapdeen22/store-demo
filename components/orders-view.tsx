"use client";

import { useI18n } from "@/components/i18n-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { Package, Calendar, Hash, User, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface OrdersViewProps {
    orders: any[];
}

export function OrdersView({ orders }: OrdersViewProps) {
    const { dict, language } = useI18n();

    return (
        <div className="space-y-12">
            <div className="flex flex-col space-y-2">
                <h1 className="text-5xl font-black tracking-tight">{dict.orderHistory}</h1>
                <p className="text-muted-foreground text-lg">{dict.trackOrders}</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-32 glass rounded-3xl border-none">
                    <Package className="h-20 w-20 mx-auto text-muted-foreground/20 mb-6" />
                    <p className="text-2xl text-muted-foreground font-medium">{dict.noOrders}</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {orders.map((order, idx) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="border-none shadow-2xl shadow-primary/5 bg-card overflow-hidden rounded-3xl group">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/5 flex-row items-center justify-between space-y-0">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-background p-4 rounded-2xl shadow-sm">
                                            <Hash className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black">{dict.orderNumber}{order.id.slice(0, 8)}</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(order.createdAt).toLocaleDateString(language === "ar" ? "ar-IQ" : "en-US", { dateStyle: 'long' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black tracking-tighter text-primary">{formatCurrency(order.total)}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-10">
                                    <div className="py-4">
                                        <OrderStatusTimeline status={order.status} />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 border-t border-b border-dashed border-border py-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-primary/60">
                                                <User className="h-4 w-4" />
                                                <p className="text-xs font-black uppercase tracking-widest">{dict.recipientName}</p>
                                            </div>
                                            <p className="font-bold text-lg">{order.recipientName || "N/A"}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-primary/60">
                                                <MapPin className="h-4 w-4" />
                                                <p className="text-xs font-black uppercase tracking-widest">{dict.address}</p>
                                            </div>
                                            <p className="font-bold text-lg leading-snug">{order.shippingAddress || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-6 group/item p-3 rounded-2xl hover:bg-muted/30 transition-colors">
                                                <div className="h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-muted border border-white/5 shadow-sm">
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.title}
                                                        className="h-full w-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="font-black text-xl">{item.product.title}</h4>
                                                    <p className="text-muted-foreground font-bold text-sm">
                                                        <span className="text-primary/60 tracking-widest uppercase mr-2">{language === "ar" ? "الكمية:" : "Qty:"}</span>
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-black text-xl tracking-tight">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
