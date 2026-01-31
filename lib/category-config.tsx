import { Share2, Shirt, Baby, Watch, Laptop, Home, ShoppingBag, Grid } from "lucide-react";

export interface CategoryConfig {
    titleKey: string;
    descKey: string;
    icon: any;
    gradient: string;
}

export const categoryConfig: Record<string, CategoryConfig> = {
    "Men": {
        titleKey: "men",
        descKey: "men",
        icon: Shirt,
        gradient: "from-blue-600 to-indigo-500"
    },
    "Women": {
        titleKey: "women",
        descKey: "women",
        icon: ShoppingBag,
        gradient: "from-rose-500 to-pink-500"
    },
    "Kids": {
        titleKey: "kids",
        descKey: "kids",
        icon: Baby,
        gradient: "from-amber-400 to-orange-500"
    },
    "Accessories": {
        titleKey: "accessories",
        descKey: "accessories",
        icon: Watch,
        gradient: "from-violet-600 to-purple-500"
    },
    "Electronics": {
        titleKey: "electronics",
        descKey: "electronics",
        icon: Laptop,
        gradient: "from-slate-800 to-slate-600"
    },
    "Home": {
        titleKey: "home",
        descKey: "home",
        icon: Home,
        gradient: "from-emerald-600 to-teal-500"
    },
    // Fallback for unknown categories
    "default": {
        titleKey: "default",
        descKey: "default",
        icon: Grid,
        gradient: "from-zinc-600 to-zinc-400"
    }
};

export function getCategoryConfig(name: string): CategoryConfig {
    // Check for exact match or try lowercase
    return categoryConfig[name] || categoryConfig[Object.keys(categoryConfig).find(k => k.toLowerCase() === name.toLowerCase()) || "default"];
}

