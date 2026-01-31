import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { send2FAEmail } from '@/lib/email';
import crypto from 'crypto';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxAttempts = 3, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxAttempts) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'معرف المستخدم مطلوب - User ID is required' },
                { status: 400 }
            );
        }

        // Rate limiting
        if (!checkRateLimit(`2fa-generate-${userId}`, 5, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'تم تجاوز عدد المحاولات المسموحة. يرجى المحاولة لاحقاً - Too many attempts. Please try again later.' },
                { status: 429 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, twoFactorEnabled: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'المستخدم غير موجود - User not found' },
                { status: 404 }
            );
        }

        if (!user.twoFactorEnabled) {
            return NextResponse.json(
                { error: 'التحقق الثنائي غير مفعل لهذا المستخدم - 2FA is not enabled for this user' },
                { status: 400 }
            );
        }

        // Invalidate any existing tokens for this user
        await prisma.twoFactorToken.deleteMany({
            where: { userId: user.id },
        });

        // Generate 6-digit token
        const token = crypto.randomInt(100000, 999999).toString();

        // Create token in database (expires in 10 minutes)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.twoFactorToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // Send email
        const emailResult = await send2FAEmail(user.email, token, user.name || undefined);

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'فشل إرسال البريد الإلكتروني - Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني - Verification code sent to your email',
            expiresAt: expiresAt.toISOString(),
        });

    } catch (error) {
        console.error('Error generating 2FA token:', error);
        return NextResponse.json(
            { error: 'حدث خطأ في الخادم - Internal server error' },
            { status: 500 }
        );
    }
}
