import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Invalid verification token' },
                { status: 400 }
            );
        }

        // Check if token has expired
        if (new Date() > verificationToken.expiresAt) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { id: verificationToken.id }
            });

            return NextResponse.json(
                { error: 'Verification token has expired' },
                { status: 400 }
            );
        }

        // Check if email is already verified
        if (verificationToken.user.emailVerified) {
            // Delete token
            await prisma.verificationToken.delete({
                where: { id: verificationToken.id }
            });

            return NextResponse.json(
                { error: 'Email already verified' },
                { status: 400 }
            );
        }

        // Update user's email verification status
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date()
            }
        });

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { id: verificationToken.id }
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Email verified successfully',
                email: verificationToken.user.email
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in verify-email:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, token } = await request.json();

        if (!userId || !token) {
            return NextResponse.json(
                { error: 'User ID and code are required' },
                { status: 400 }
            );
        }

        // Find the verification token for this user
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                userId,
                token,
            },
            include: { user: true }
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'رمز التحقق غير صحيح - Invalid verification code' },
                { status: 400 }
            );
        }

        // Check expiration
        if (new Date() > verificationToken.expiresAt) {
            await prisma.verificationToken.delete({
                where: { id: verificationToken.id }
            });
            return NextResponse.json(
                { error: 'انتهت صلاحية الرمز - Code has expired' },
                { status: 400 }
            );
        }

        // Update user
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date()
            }
        });

        // Mark token as verified (don't delete it yet, so we can use it for login)
        await prisma.verificationToken.update({
            where: { id: verificationToken.id },
            data: { verified: true }
        });

        return NextResponse.json({
            success: true,
            message: 'تم التحقق من البريد الإلكتروني بنجاح - Email verified successfully',
            user: {
                id: verificationToken.user.id,
                email: verificationToken.user.email,
                name: verificationToken.user.name
            }
        });

    } catch (error) {
        console.error('Error verifying email code:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
