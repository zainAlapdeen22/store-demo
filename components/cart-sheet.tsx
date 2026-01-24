"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";

export function CartSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { items, removeItem, addItem, total } = useCart();
    const { dict, language } = useI18n();
    const isRtl = language === "ar";
    const slideDirection = isRtl ? -100 : 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50"
                    />
                    <motion.div
                        initial={{ x: `${slideDirection}%` }}
                        animate={{ x: 0 }}
                        exit={{ x: `${slideDirection}%` }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed top-0 bottom-0 w-full sm:w-[400px] bg-background z-50 shadow-xl flex flex-col ltr:right-0 rtl:left-0 border-s"
                        style={{ [isRtl ? 'left' : 'right']: 0 }}
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">{dict.cart} ({items.length})</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                                    <p>{dict.emptyCart}</p>
                                    <Button variant="outline" onClick={onClose}>{dict.continueShopping}</Button>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={`${item.productId}-${index}`} className="flex gap-4">
                                        <div className="h-20 w-20 rounded-md overflow-hidden bg-muted border">
                                            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{formatCurrency(item.price)}</p>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => removeItem(item.productId, item.variant)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-4 border-t space-y-4 bg-muted/10">
                                <div className="flex items-center justify-between font-bold text-lg">
                                    <span>{dict.total}</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <Button className="w-full" size="lg" onClick={() => {
                                    onClose();
                                    // Small delay to ensure the sheet closing animation starts/doesn't conflict
                                    location.href = "/checkout"; // Using default navigation to ensure full page load or use router
                                }}>
                                    {dict.proceedToCheckout}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
