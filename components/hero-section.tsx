"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
    const { dict } = useI18n();

    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0%,transparent_100%)] opacity-10" />
            <div className="container flex flex-col items-center text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 drop-shadow-sm">
                        {dict.storeName} <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {dict.storeSlogan}
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
                >
                    {dict.storeDesc}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex gap-4"
                >
                    <Link href="/products">
                        <Button size="lg" className="rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            {dict.shopNow}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
