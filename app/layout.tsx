import type { Metadata } from "next";
import { Suspense } from "react";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/cart-provider";

const cairo = Cairo({ subsets: ["latin", "arabic"] });

export const metadata: Metadata = {
    title: "Store",
    description: "Premium E-Commerce Store",
};

import { I18nProvider } from "@/components/i18n-provider";
import { AlertProvider } from "@/components/alert-provider";
import { AuthProvider } from "@/components/auth-provider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning>
            <body className={cn("min-h-screen bg-background font-sans antialiased", cairo.className)}>
                <I18nProvider>
                    <AuthProvider>
                        <AlertProvider>
                            <CartProvider>
                                <Suspense fallback={<div className="h-16 border-b" />}>
                                    <Navbar />
                                </Suspense>
                                <main className="flex-1">
                                    {children}
                                </main>
                            </CartProvider>
                        </AlertProvider>
                    </AuthProvider>
                </I18nProvider>
            </body>
        </html>
    );
}
