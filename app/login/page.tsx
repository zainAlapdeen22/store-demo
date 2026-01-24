"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/lib/actions";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

function LoginButton() {
    const { pending } = useFormStatus();
    const { dict } = useI18n();
    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? dict.loggingIn : dict.signIn}
        </Button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const { dict } = useI18n();

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">{dict.signIn}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={dispatch} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="email">
                                {dict.email}
                            </label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="password">
                                {dict.password}
                            </label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <Link href="/register" className="underline">
                                {dict.dontHaveAccount}
                            </Link>
                        </div>
                        {errorMessage && (
                            <div
                                className="flex h-8 items-end space-x-1"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </div>
                        )}
                        <LoginButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
