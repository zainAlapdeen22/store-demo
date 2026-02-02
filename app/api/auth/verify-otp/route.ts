import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        // Find OTP
        const otp = await prisma.oTP.findFirst({
            where: {
                email: email.toLowerCase(),
                verified: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!otp) {
            return NextResponse.json(
                { error: 'No verification code found. Please request a new one.' },
                { status: 404 }
            );
        }

        // Check expiration
        if (new Date() > otp.expiresAt) {
            await prisma.oTP.delete({ where: { id: otp.id } });
            return NextResponse.json(
                { error: 'Code expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check attempts
        if (otp.attempts >= 5) {
            await prisma.oTP.delete({ where: { id: otp.id } });
            return NextResponse.json(
                { error: 'Too many attempts. Please request a new code.' },
                { status: 400 }
            );
        }

        // Verify code
        if (otp.code !== code) {
            // Increment attempts
            await prisma.oTP.update({
                where: { id: otp.id },
                data: { attempts: otp.attempts + 1 }
            });
            return NextResponse.json(
                { error: 'Invalid code. Please try again.' },
                { status: 400 }
            );
        }

        // Mark as verified and delete
        await prisma.oTP.delete({ where: { id: otp.id } });

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                name: true,
                twoFactorEnabled: true,
                emailVerified: true,
            },
        });

        let isNewUser = false;

        if (!user) {
            // Create new user with a random password (they'll use OTP to login)
            const randomPassword = Math.random().toString(36).slice(-12);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    name: email.split('@')[0],
                    emailVerified: false, // New users need to verify email
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    twoFactorEnabled: true,
                    emailVerified: true,
                },
            });
            isNewUser = true;
        }

        // Check if email is verified
        if (!user.emailVerified) {
            // Send verification email
            const { sendVerificationEmail } = await import('@/lib/email');

            // Delete any existing verification tokens
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

            // Send verification email code
            const { sendEmailVerificationCode } = await import('@/lib/email');
            await sendEmailVerificationCode(user.email, token);

            return NextResponse.json({
                requiresVerification: true,
                userId: user.id,
                email: user.email,
                message: isNewUser
                    ? 'Account created! Please verify your email to continue.'
                    : 'Please verify your email to continue.'
            }, { status: 200 });
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate 2FA token
            const crypto = await import('crypto');
            const token = crypto.randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            // Delete any existing 2FA tokens for this user
            await prisma.twoFactorToken.deleteMany({
                where: { userId: user.id },
            });

            // Create new 2FA token
            await prisma.twoFactorToken.create({
                data: {
                    userId: user.id,
                    token,
                    expiresAt,
                },
            });

            // Send 2FA email
            const { send2FAEmail } = await import('@/lib/email');
            await send2FAEmail(user.email, token, user.name || undefined);

            return NextResponse.json(
                {
                    success: true,
                    requires2FA: true,
                    message: 'تم إرسال رمز التحقق الثنائي - 2FA code sent',
                    userId: user.id
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                requires2FA: false,
                message: 'Verification successful',
                userId: user.id
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in verify-otp:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
