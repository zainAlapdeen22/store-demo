"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { VariantsInput } from "@/components/variants-input";

export default function NewProductPage() {
    return (
        <div className="container py-10 max-w-2xl space-y-8">
            <div className="flex items-center space-x-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createProduct} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <Input id="title" name="title" required placeholder="iPhone 15 Pro" />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Input id="description" name="description" required placeholder="The ultimate iPhone." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="price" className="text-sm font-medium">السعر (د.ع)</label>
                                <Input id="price" name="price" type="number" step="0.01" required placeholder="25000" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                                <Input id="stock" name="stock" type="number" required placeholder="100" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="category" className="text-sm font-medium">Category</label>
                            <Input id="category" name="category" required placeholder="Electronics" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Image</label>
                            <input type="hidden" name="imageUrl" id="imageUrl" required />
                            <ImageUpload onUpload={(url) => {
                                const input = document.getElementById("imageUrl") as HTMLInputElement;
                                if (input) input.value = url;
                            }} />
                        </div>

                        <div className="grid gap-2">
                            <input type="hidden" name="variants" id="variants" />
                            <VariantsInput onUpdate={(json) => {
                                const input = document.getElementById("variants") as HTMLInputElement;
                                if (input) input.value = json;
                            }} />
                        </div>

                        <Button type="submit" className="w-full">Create Product</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
