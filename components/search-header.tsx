"use client";

import { useI18n } from "@/components/i18n-provider";

export function SearchHeader({ query }: { query: string }) {
    const { dict } = useI18n();

    return (
        <h1 className="text-3xl font-bold mb-8">
            {dict.searchResults} &quot;{query}&quot;
        </h1>
    );
}
