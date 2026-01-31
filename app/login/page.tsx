"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";
import { useAlert } from "@/components/alert-provider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const { dict } = useI18n();
    const { showAlert } = useAlert();
    const router = useRouter();

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showAlert({ title: dict.codeSentSuccess, message: dict.checkYourEmail, type: 'success' });
                setStep('otp');
                setResendTimer(60); // 60 seconds before can resend
            } else {
                showAlert({ title: 'خطأ / Error', message: data.error || 'Failed to send code', type: 'error' });
            }
        } catch (error) {
            showAlert({ title: 'خطأ / Error', message: 'Network error. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyOTP = async () => {
        const code = otp.join('');
        if (code.length !== 4) {
            showAlert({ title: 'خطأ / Error', message: 'Please enter the 4-digit code', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (response.ok) {
                // Check if 2FA is required
                if (data.requires2FA) {
                    showAlert({ title: 'نجح / Success', message: data.message, type: 'success' });
                    // Redirect to 2FA verification page
                    router.push(`/auth/verify-2fa?userId=${data.userId}`);
                } else {
                    showAlert({ title: 'نجح / Success', message: 'Login successful!', type: 'success' });
                    // Create a session using NextAuth
                    const result = await signIn('credentials', {
                        email,
                        password: code,
                        redirect: false
                    });

                    if (result?.ok) {
                        router.push('/');
                        router.refresh();
                    }
                }
            } else {
                showAlert({ title: 'خطأ / Error', message: data.error || dict.invalidOTP, type: 'error' });
                if (data.error?.includes('expired') || data.error?.includes('attempts')) {
                    setStep('email');
                    setOtp(['', '', '', '']);
                }
            }
        } catch (error) {
            showAlert({ title: 'خطأ / Error', message: 'Network error. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only numbers

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }

        // Auto-verify when all 4 digits entered
        if (index === 3 && value && newOtp.every(d => d !== '')) {
            setTimeout(() => handleVerifyOTP(), 300);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        {step === 'email' ? dict.signIn : dict.enterOTP}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 'email' ? (
                        // Step 1: Email Entry
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="email">
                                    {dict.enterEmail}
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? dict.sendingCode : dict.sendCode}
                            </Button>
                        </form>
                    ) : (
                        // Step 2: OTP Verification
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                    {dict.otpSent}
                                </p>
                                <p className="text-sm font-medium">{email}</p>
                            </div>

                            <div className="flex justify-center gap-3 rtl:flex-row-reverse">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-14 h-14 text-center text-2xl font-bold"
                                        disabled={loading}
                                    />
                                ))}
                            </div>

                            <div className="space-y-3">
                                <Button
                                    className="w-full"
                                    onClick={handleVerifyOTP}
                                    disabled={loading || otp.some(d => !d)}
                                >
                                    {loading ? dict.verifying : dict.verifyCode}
                                </Button>

                                <div className="flex justify-between items-center text-sm">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setStep('email');
                                            setOtp(['', '', '', '']);
                                        }}
                                        disabled={loading}
                                    >
                                        {dict.backToEmail}
                                    </Button>

                                    {resendTimer > 0 ? (
                                        <span className="text-muted-foreground">
                                            {dict.resendIn} {resendTimer}s
                                        </span>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSendOTP({ preventDefault: () => { } } as any)}
                                            disabled={loading}
                                        >
                                            {dict.resendCode}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
