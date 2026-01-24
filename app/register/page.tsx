"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { register } from "@/app/lib/register-action";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useI18n } from "@/components/i18n-provider";

function RegisterButton() {
    const { pending } = useFormStatus();
    const { dict } = useI18n();
    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? dict.creatingAccount : dict.signUp}
        </Button>
    );
}

export default function RegisterPage() {
    const [state, dispatch] = useActionState(register, undefined);

    const { dict } = useI18n();

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">{dict.createAccount}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={dispatch} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="name">
                                {dict.name}
                            </label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
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
                            <Link href="/login" className="underline">
                                {dict.alreadyHaveAccount}
                            </Link>
                        </div>
                        {state?.message && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                        <RegisterButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
