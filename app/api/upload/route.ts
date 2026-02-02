import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

        const { data: uploadData, error } = await supabase
            .storage
            .from('products')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({
                success: false,
                message: `Upload failed: ${error.message}. Please ensure you have a public 'products' bucket in Supabase Storage.`
            }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('products')
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Server upload error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error during upload"
        }, { status: 500 });
    }
}
