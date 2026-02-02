'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, Loader2 } from 'lucide-react';

function VerificationSentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResend = async () => {
        if (!userId || countdown > 0) return;

        setResending(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('تم إرسال رسالة التحقق مرة أخرى! / Verification email sent again!');
                setCountdown(60); // 60 seconds cooldown
            } else {
                setMessage(data.error || 'Failed to resend email');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">
                    تحقق من بريدك الإلكتروني
                    <br />
                    Check Your Email
                </CardTitle>
                <CardDescription className="text-base mt-2">
                    {email && (
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                            {email}
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        لقد أرسلنا رسالة تحقق إلى بريدك الإلكتروني.
                        <br />
                        يرجى التحقق من صندوق الوارد والنقر على رابط التحقق.
                    </p>

                    <p className="text-sm text-gray-500">
                        We've sent a verification email to your inbox.
                        <br />
                        Please check your email and click the verification link.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 <strong>نصيحة / Tip:</strong>
                            <br />
                            تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
                            <br />
                            Check your spam folder if you don't see the email
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={handleResend}
                        disabled={resending || countdown > 0}
                        variant="outline"
                        className="w-full"
                    >
                        {resending ? (
                            'جاري الإرسال... / Sending...'
                        ) : countdown > 0 ? (
                            <>
                                <Clock className="mr-2 h-4 w-4" />
                                إعادة الإرسال بعد {countdown}ث / Resend in {countdown}s
                            </>
                        ) : (
                            'إعادة إرسال البريد / Resend Email'
                        )}
                    </Button>

                    {message && (
                        <p className={`text-sm text-center ${message.includes('error') || message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}

                    <Button
                        onClick={() => router.push('/login')}
                        variant="ghost"
                        className="w-full"
                    >
                        العودة لتسجيل الدخول / Back to Login
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VerificationSentPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <Suspense fallback={<Loader2 className="h-16 w-16 text-purple-600 animate-spin" />}>
                <VerificationSentContent />
            </Suspense>
        </div>
    );
}
