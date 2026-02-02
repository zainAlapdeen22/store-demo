import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const limit = rateLimitMap.get(email);

    if (limit && now < limit.resetTime) {
        if (limit.count >= 3) {
            return false; // Rate limit exceeded
        }
        limit.count++;
        return true;
    }

    // Reset or initialize - 1 hour
    rateLimitMap.set(email, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, emailVerified: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email already verified' },
                { status: 400 }
            );
        }

        // Check rate limit
        if (!checkRateLimit(user.email)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Delete any existing verification tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { userId: user.id }
        });

        // Generate 6-digit numeric token
        const { randomInt } = await import('crypto');
        const token = randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Create verification token
        await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        });

        // Send verification email
        const { sendEmailVerificationCode } = await import('@/lib/email');
        const emailSent = await sendEmailVerificationCode(user.email, token);

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Verification email sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in send-verification:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
