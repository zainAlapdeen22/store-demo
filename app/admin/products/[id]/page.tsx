import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { updateProduct, deleteProduct } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, Trash } from "lucide-react";
import { EditProductForm } from "./edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="container py-10 max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                </div>

                <form action={async () => {
                    "use server";
                    await deleteProduct(product.id);
                }}>
                    <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-2" /> Delete Product
                    </Button>
                </form>
            </div>

            <EditProductForm product={product} />
        </div>
    );
}
