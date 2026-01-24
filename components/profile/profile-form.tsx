"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/profile";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { useAlert } from "@/components/alert-provider";

interface ProfileFormProps {
    user: {
        name: string | null;
        phone: string | null;
        email: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { dict } = useI18n();
    const { showAlert } = useAlert();

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result.error) {
            showAlert({
                title: "Error",
                message: "Failed to update profile",
                type: "error"
            });
        } else {
            showAlert({
                title: "Success",
                message: "Profile updated successfully",
                type: "success"
            });
        }
    }

    return (
        <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">{dict.name}</Label>
                <Input id="name" name="name" defaultValue={user.name || ""} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">{dict.email}</Label>
                <Input id="email" value={user.email} disabled className="bg-muted" />
                <p className="text-[0.8rem] text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">{dict.phone}</Label>
                <Input id="phone" name="phone" defaultValue={user.phone || ""} required />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dict.saveChanges}
            </Button>
        </form>
    );
}
