import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusTimeline } from "@/components/order-status-timeline";

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
        <div className="container py-10 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader className="bg-muted/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <OrderStatusTimeline status={order.status} />

                                <div className="grid grid-cols-2 gap-4 text-sm border-t border-b py-4">
                                    <div>
                                        <p className="text-muted-foreground">Recipient</p>
                                        <p className="font-medium">{order.recipientName || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Shipping Address</p>
                                        <p className="font-medium">{order.shippingAddress || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-md overflow-hidden bg-muted border">
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.product.title}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
