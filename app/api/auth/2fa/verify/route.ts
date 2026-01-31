import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
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
        const { userId, token } = await req.json();

        if (!userId || !token) {
            return NextResponse.json(
                { error: 'معرف المستخدم والرمز مطلوبان - User ID and token are required' },
                { status: 400 }
            );
        }

        // Rate limiting per user
        if (!checkRateLimit(`2fa-verify-${userId}`, 5, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'تم تجاوز عدد المحاولات المسموحة - Too many verification attempts' },
                { status: 429 }
            );
        }

        // Find the token
        const tokenRecord = await prisma.twoFactorToken.findFirst({
            where: {
                userId,
                token,
                verified: false,
            },
            include: {
                user: {
                    select: { id: true, email: true, name: true },
                },
            },
        });

        if (!tokenRecord) {
            return NextResponse.json(
                { error: 'رمز التحقق غير صحيح - Invalid verification code' },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (new Date() > tokenRecord.expiresAt) {
            await prisma.twoFactorToken.delete({
                where: { id: tokenRecord.id },
            });
            return NextResponse.json(
                { error: 'انتهت صلاحية رمز التحقق - Verification code has expired' },
                { status: 400 }
            );
        }

        // Check attempts limit
        if (tokenRecord.attempts >= 5) {
            await prisma.twoFactorToken.delete({
                where: { id: tokenRecord.id },
            });
            return NextResponse.json(
                { error: 'تم تجاوز عدد المحاولات المسموحة - Maximum attempts exceeded' },
                { status: 400 }
            );
        }

        // Increment attempts
        await prisma.twoFactorToken.update({
            where: { id: tokenRecord.id },
            data: { attempts: tokenRecord.attempts + 1 },
        });

        // Mark as verified
        await prisma.twoFactorToken.update({
            where: { id: tokenRecord.id },
            data: { verified: true },
        });

        // Clean up old tokens for this user
        await prisma.twoFactorToken.deleteMany({
            where: {
                userId,
                id: { not: tokenRecord.id },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'تم التحقق بنجاح - Verification successful',
            user: tokenRecord.user,
        });

    } catch (error) {
        console.error('Error verifying 2FA token:', error);
        return NextResponse.json(
            { error: 'حدث خطأ في الخادم - Internal server error' },
            { status: 500 }
        );
    }
}
