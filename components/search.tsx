"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useI18n } from "@/components/i18n-provider";

export function Search() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const { dict } = useI18n();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`/search?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={dict.search}
                className="ps-8 w-full bg-background"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
        </div>
    );
}
