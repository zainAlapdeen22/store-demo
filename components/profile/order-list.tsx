"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

interface OrderListProps {
    orders: any[]; // Using any for simplicity, but should be typed properly
}

export function OrderList({ orders }: OrderListProps) {
    const { dict } = useI18n();

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold">{dict.orderHistory}</h2>
            {orders.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        {dict.noOrders}
                    </CardContent>
                </Card>
            ) : (
                orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="bg-muted/40">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">{dict.orderNumber}{order.id.slice(0, 8)}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{formatCurrency(order.total)}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{order.status.replace(/_/g, " ").toLowerCase()}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <OrderStatusTimeline status={order.status} />
                            <div className="space-y-2">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 text-sm">
                                        <div className="h-10 w-10 rounded bg-muted border overflow-hidden">
                                            <img src={item.product.imageUrl} alt={item.product.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium">{item.product.title}</span>
                                            <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                        </div>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </section>
    );
}
