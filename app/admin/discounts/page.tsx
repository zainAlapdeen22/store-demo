import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDiscount, deleteDiscount } from "@/actions/discount";
import { formatCurrency } from "@/lib/utils";

export default async function DiscountsPage() {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        redirect("/");
    }

    const discounts = await prisma.discount.findMany({
        orderBy: { createdAt: "desc" },
        include: { product: true },
    });

    const products = await prisma.product.findMany({
        select: { id: true, title: true },
    });

    return (
        <div className="container py-10 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Manage Discounts</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Discount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData) => {
                            "use server";
                            await createDiscount(formData);
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="percentage">Percentage (%)</Label>
                                    <Input id="percentage" name="percentage" type="number" min="0" max="100" placeholder="10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (IQD)</Label>
                                    <Input id="amount" name="amount" type="number" min="0" placeholder="5000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Promo Code (Optional)</Label>
                                <Input id="code" name="code" placeholder="SUMMER2024" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input id="startDate" name="startDate" type="datetime-local" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" name="endDate" type="datetime-local" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productId">Product (Optional - Leave empty for global)</Label>
                                <select id="productId" name="productId" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="">All Products</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full">Create Discount</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Active Discounts</h2>
                    {discounts.length === 0 ? (
                        <p className="text-muted-foreground">No discounts found.</p>
                    ) : (
                        discounts.map((discount) => (
                            <Card key={discount.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">
                                            {discount.percentage ? `${discount.percentage}% OFF` : `${formatCurrency(discount.amount!)} OFF`}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {discount.code ? `Code: ${discount.code}` : "Automatic Discount"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                                        </p>
                                        {discount.product && (
                                            <p className="text-xs text-primary">Applies to: {discount.product.title}</p>
                                        )}
                                    </div>
                                    <form action={async () => {
                                        "use server";
                                        await deleteDiscount(discount.id);
                                    }}>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
