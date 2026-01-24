import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { OrderStatusForm } from "./order-status-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: true }
            },
            user: true
        }
    });

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="container py-10 max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <Link href={`/admin/orders/${order.id}/invoice`}>
                    <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" /> View Invoice
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <OrderStatusTimeline status={order.status} />
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <span className="font-medium">Change Status:</span>
                        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex gap-4">
                                            {item.product.imageUrl && (
                                                <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{item.product.title}</div>
                                                <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total:</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <div className="font-medium text-muted-foreground">Name</div>
                                <div>{order.recipientName || order.user.name || "N/A"}</div>
                            </div>
                            <div>
                                <div className="font-medium text-muted-foreground">Email</div>
                                <div>{order.user.email}</div>
                            </div>
                            <div>
                                <div className="font-medium text-muted-foreground">Phone (Payment)</div>
                                <div className="font-mono bg-muted p-1 rounded inline-block">
                                    {order.paymentPhoneNumber || "N/A"}
                                </div>
                            </div>
                            <div>
                                <div className="font-medium text-muted-foreground">Shipping Address</div>
                                <div className="whitespace-pre-wrap">{order.shippingAddress || "N/A"}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
