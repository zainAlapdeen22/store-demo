import { Share2, Shirt, Baby, Watch, Laptop, Home, ShoppingBag, Grid } from "lucide-react";

export interface CategoryConfig {
    ar: string;
    description: string;
    icon: any;
    gradient: string;
}

export const categoryConfig: Record<string, CategoryConfig> = {
    "Men": {
        ar: "رجالي",
        description: "أحدث صيحات الموضة للرجال",
        icon: Shirt,
        gradient: "from-blue-500 to-cyan-400"
    },
    "Women": {
        ar: "نسائي",
        description: "تألقي بأجمل الأزياء النسائية",
        icon: ShoppingBag,
        gradient: "from-pink-500 to-rose-400"
    },
    "Kids": {
        ar: "أطفال",
        description: "ملابس مريحة وأنيقة للأطفال",
        icon: Baby,
        gradient: "from-yellow-400 to-orange-400"
    },
    "Accessories": {
        ar: "إكسسوارات",
        description: "لمسات نهائية تكتمل بها أناقتك",
        icon: Watch,
        gradient: "from-purple-500 to-indigo-400"
    },
    "Electronics": {
        ar: "إلكترونيات",
        description: "أحدث التقنيات والأجهزة",
        icon: Laptop,
        gradient: "from-slate-700 to-slate-500"
    },
    "Home": {
        ar: "المنزل",
        description: "كل ما يحتاجه منزلك العصري",
        icon: Home,
        gradient: "from-emerald-500 to-teal-400"
    },
    // Fallback for unknown categories
    "default": {
        ar: "منتجات متنوعة",
        description: "تصفح مجموعتنا المميزة",
        icon: Grid,
        gradient: "from-gray-500 to-gray-400"
    }
};

export function getCategoryConfig(name: string): CategoryConfig {
    return categoryConfig[name] || { ...categoryConfig["default"], ar: name };
}
