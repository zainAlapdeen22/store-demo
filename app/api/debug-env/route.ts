import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const envCheck = {
            hasAuthSecret: !!process.env.AUTH_SECRET,
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            // Show first few chars to verify it's loaded but keep secret
            databaseUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + "..." : "MISSING",
            nodeEnv: process.env.NODE_ENV,
        };

        return NextResponse.json({
            status: "Diagnostic Report (No DB)",
            environment: envCheck,
            message: "If this loads, the issue is definitely the Prisma connection!",
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "Critical Failure",
            error: error.message,
        }, { status: 500 });
    }
}
