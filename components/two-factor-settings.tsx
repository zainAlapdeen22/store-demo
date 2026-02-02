"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TwoFactorSettingsProps {
    userId: string;
    initialEnabled: boolean;
    userEmail: string;
}

export function TwoFactorSettings({ userId, initialEnabled, userEmail }: TwoFactorSettingsProps) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggle = async (newValue: boolean) => {
        if (newValue && !enabled) {
            // Enabling 2FA - show confirmation
            setShowConfirm(true);
        } else if (!newValue && enabled) {
            // Disabling 2FA - confirm and disable
            if (confirm("هل أنت متأكد من تعطيل التحقق الثنائي؟\nAre you sure you want to disable 2FA?")) {
                await updateSetting(false);
            }
        }
    };

    const confirmEnable = async () => {
        await updateSetting(true);
        setShowConfirm(false);
    };

    const updateSetting = async (newValue: boolean) => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/2fa/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: newValue }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update setting");
            }

            setEnabled(newValue);
            alert(data.message);

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle>التحقق الثنائي / Two-Factor Authentication</CardTitle>
                        <CardDescription>
                            أضف طبقة أمان إضافية لحسابك / Add an extra layer of security
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        {enabled ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        <div>
                            <p className="font-semibold text-sm">
                                {enabled ? "مفعّل / Enabled" : "معطّل / Disabled"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {enabled
                                    ? "حسابك محمي بالتحقق الثنائي / Your account is protected"
                                    : "حسابك غير محمي / Your account is not protected"
                                }
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        disabled={loading}
                    />
                </div>

                {/* Email Info */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            البريد الإلكتروني للتحقق / Verification Email
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            {userEmail}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                            سيتم إرسال رموز التحقق إلى هذا البريد عند تسجيل الدخول
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-500">
                            Verification codes will be sent to this email when you log in
                        </p>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                {showConfirm && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                                    تأكيد تفعيل التحقق الثنائي
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Confirm enabling Two-Factor Authentication
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                            <p>• سيتم إرسال رمز تحقق إلى بريدك عند كل تسجيل دخول</p>
                            <p>• A verification code will be sent to your email on every login</p>
                            <p>• تأكد من إمكانية الوصول إلى بريدك الإلكتروني</p>
                            <p>• Make sure you have access to your email</p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={confirmEnable}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                تأكيد التفعيل / Confirm
                            </Button>
                            <Button
                                onClick={() => setShowConfirm(false)}
                                variant="outline"
                                disabled={loading}
                                className="flex-1"
                            >
                                إلغاء / Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Info */}
                {enabled && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 pt-2 border-t">
                        <p className="font-semibold">كيف يعمل التحقق الثنائي؟ / How does 2FA work?</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>عند تسجيل الدخول، سيُطلب منك إدخال رمز التحقق</li>
                            <li>When logging in, you&apos;ll be asked to enter a verification code</li>
                            <li>سيتم إرسال الرمز إلى بريدك الإلكتروني</li>
                            <li>The code will be sent to your email</li>
                            <li>الرمز صالح لمدة 10 دقائق فقط</li>
                            <li>The code is valid for 10 minutes only</li>
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
