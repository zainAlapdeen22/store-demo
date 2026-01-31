import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOTPEmail } from '@/lib/send-email';

// Rate limiting helper (simple in-memory store, consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const limit = rateLimitMap.get(email);

    if (limit && now < limit.resetTime) {
        if (limit.count >= 10) { // Increased from 3 to 10 for development
            return false; // Rate limit exceeded
        }
        limit.count++;
        return true;
    }

    // Reset or initialize - 15 minutes instead of 1 hour
    rateLimitMap.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Check rate limit
        if (!checkRateLimit(email.toLowerCase())) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Generate 4-digit OTP
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Invalidate any existing OTPs for this email
        await prisma.oTP.deleteMany({
            where: { email: email.toLowerCase() }
        });

        // Store OTP in database
        await prisma.oTP.create({
            data: {
                email: email.toLowerCase(),
                code,
                expiresAt
            }
        });

        // Send email
        const result = await sendOTPEmail(email, code);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to send email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'OTP sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in send-otp:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
