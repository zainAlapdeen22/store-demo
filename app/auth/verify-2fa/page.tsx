"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Mail, Clock } from "lucide-react";

export default function Verify2FAPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (!userId) {
            router.push("/login");
        }
    }, [userId, router]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "فشل التحقق - Verification failed");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/2fa/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "فشل إعادة الإرسال - Failed to resend");
            }

            setResendCooldown(60); // 60 seconds cooldown
            alert("تم إرسال رمز جديد إلى بريدك الإلكتروني - New code sent to your email");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    if (!userId) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="text-center space-y-4 pb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        التحقق الثنائي
                    </CardTitle>
                    <CardDescription className="text-base">
                        Two-Factor Authentication
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {success ? (
                        <div className="text-center space-y-4 py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                تم التحقق بنجاح!
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Verification successful! Redirecting...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                    <Mail className="w-5 h-5" />
                                    <p className="font-semibold text-sm">تحقق من بريدك الإلكتروني</p>
                                </div>
                                <p className="text-sm text-blue-600 dark:text-blue-300">
                                    لقد أرسلنا رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني
                                </p>
                                <p className="text-xs text-blue-500 dark:text-blue-400">
                                    We've sent a 6-digit verification code to your email
                                </p>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        رمز التحقق / Verification Code
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="123456"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        maxLength={6}
                                        className="text-center text-2xl tracking-widest font-mono h-14"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                        <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                                    disabled={loading || token.length !== 6}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            جاري التحقق...
                                        </>
                                    ) : (
                                        "تحقق الآن / Verify Now"
                                    )}
                                </Button>
                            </form>

                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>الرمز صالح لمدة 10 دقائق / Code valid for 10 minutes</span>
                                </div>

                                <div className="text-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleResend}
                                        disabled={resendLoading || resendCooldown > 0}
                                        className="text-sm"
                                    >
                                        {resendLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                جاري الإرسال...
                                            </>
                                        ) : resendCooldown > 0 ? (
                                            `إعادة الإرسال بعد ${resendCooldown}ث`
                                        ) : (
                                            "لم تستلم الرمز؟ إعادة إرسال / Resend Code"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
