import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'غير مصرح - Unauthorized' },
                { status: 401 }
            );
        }

        const { enabled } = await req.json();

        if (typeof enabled !== 'boolean') {
            return NextResponse.json(
                { error: 'قيمة غير صحيحة - Invalid value' },
                { status: 400 }
            );
        }

        // Update user's 2FA setting
        await prisma.user.update({
            where: { id: session.user.id },
            data: { twoFactorEnabled: enabled },
        });

        // If disabling, clean up any existing tokens
        if (!enabled) {
            await prisma.twoFactorToken.deleteMany({
                where: { userId: session.user.id },
            });
        }

        return NextResponse.json({
            success: true,
            message: enabled
                ? 'تم تفعيل التحقق الثنائي بنجاح - 2FA enabled successfully'
                : 'تم تعطيل التحقق الثنائي - 2FA disabled',
            twoFactorEnabled: enabled,
        });

    } catch (error) {
        console.error('Error toggling 2FA:', error);
        return NextResponse.json(
            { error: 'حدث خطأ في الخادم - Internal server error' },
            { status: 500 }
        );
    }
}
