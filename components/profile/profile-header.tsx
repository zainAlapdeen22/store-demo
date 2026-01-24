"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { signOut } from "next-auth/react";

export function ProfileHeader() {
    const { dict } = useI18n();

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{dict.myProfile}</h1>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                {dict.signOut}
            </Button>
        </div>
    );
}
