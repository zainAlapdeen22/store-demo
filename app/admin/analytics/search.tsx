"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // Assuming you have an input component
import { useDebouncedCallback } from "use-debounce"; // You might need to install this or implement verify useDebouncedCallback exists or simple debounce.
// If use-debounce is not available, I'll write a simple client-side debounce or just use onChange directly for MVP but better to debounce.
// Let's check package.json first? No, I'll use a simple timeout based debounce to be safe without new deps unless I check first.

/*
Actually, standard Next.js search pattern:
*/

export function AnalyticsSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <Input
                className="w-full md:w-[300px]"
                placeholder="Search products..."
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('q')?.toString()}
            />
        </div>
    );
}
