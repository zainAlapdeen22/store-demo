"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

export function ImageUpload({ onUpload, initialUrl }: { onUpload: (url: string) => void; initialUrl?: string }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialUrl || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setPreview(data.url);
                onUpload(data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="cursor-pointer"
                />
                {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>
            {preview && (
                <div className="relative aspect-video w-40 overflow-hidden rounded-md border">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                </div>
            )}
        </div>
    );
}
