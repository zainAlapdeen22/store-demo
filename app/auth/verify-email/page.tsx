'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        // Verify the email
        const verifyEmail = async () => {
            try {
                const response = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                    setEmail(data.email);

                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Network error. Please try again.');
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    {status === 'loading' && 'جاري التحقق... / Verifying...'}
                    {status === 'success' && 'تم التحقق! / Verified!'}
                    {status === 'error' && 'خطأ / Error'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    {status === 'loading' && (
                        <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <div className="text-center space-y-2">
                                <p className="text-lg font-medium text-green-600">{message}</p>
                                {email && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {email}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    سيتم تحويلك إلى صفحة تسجيل الدخول...
                                    <br />
                                    Redirecting to login page...
                                </p>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="h-16 w-16 text-red-500" />
                            <div className="text-center space-y-4">
                                <p className="text-lg font-medium text-red-600">{message}</p>
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => router.push('/login')}
                                        className="w-full"
                                    >
                                        العودة لتسجيل الدخول / Back to Login
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <Suspense fallback={<Loader2 className="h-16 w-16 text-purple-600 animate-spin" />}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
