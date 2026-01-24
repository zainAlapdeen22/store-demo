"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export function ForceSignout() {
    useEffect(() => {
        signOut({ callbackUrl: "/login" });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">Session invalid. Signing out...</p>
        </div>
    );
}
