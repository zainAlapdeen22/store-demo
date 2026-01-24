"use client";

import { useI18n } from "@/components/i18n-provider";

export function NoResults() {
    const { dict } = useI18n();
    return <p className="text-muted-foreground">{dict.noResults}</p>;
}
