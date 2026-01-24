"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProduct } from "@/app/actions";
import { ImageUpload } from "@/components/image-upload";
import { VariantsInput } from "@/components/variants-input";
import { Product } from "@prisma/client";

export function EditProductForm({ product }: { product: Product }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={updateProduct} className="space-y-4">
                    <input type="hidden" name="id" value={product.id} />

                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input id="title" name="title" required defaultValue={product.title} />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Input id="description" name="description" required defaultValue={product.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="price" className="text-sm font-medium">السعر (د.ع)</label>
                            <Input id="price" name="price" type="number" step="0.01" required defaultValue={product.price} />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                            <Input id="stock" name="stock" type="number" required defaultValue={product.stock} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <Input id="category" name="category" required defaultValue={product.category} placeholder="e.g. Men, Electronics" />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Image</label>
                        <input type="hidden" name="imageUrl" id="imageUrl" required defaultValue={product.imageUrl} />
                        <ImageUpload
                            initialUrl={product.imageUrl}
                            onUpload={(url) => {
                                const input = document.getElementById("imageUrl") as HTMLInputElement;
                                if (input) input.value = url;
                            }}
                        />
                    </div>

                    <div className="grid gap-2">
                        <input type="hidden" name="variants" id="variants" defaultValue={product.variants ? JSON.stringify(product.variants) : ""} />
                        <VariantsInput
                            initialData={product.variants ? JSON.stringify(product.variants) : ""}
                            onUpdate={(json) => {
                                const input = document.getElementById("variants") as HTMLInputElement;
                                if (input) input.value = json;
                            }}
                        />
                    </div>

                    <Button type="submit" className="w-full">Update Product</Button>
                </form>
            </CardContent>
        </Card>
    );
}
