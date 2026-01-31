"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";


export function CartSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { items, removeItem, incrementQuantity, decrementQuantity, total } = useCart();
    const { dict, language } = useI18n();
    const router = useRouter();
    const isRtl = language === "ar";
    const slideDirection = isRtl ? -100 : 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: `${slideDirection}%` }}
                        animate={{ x: 0 }}
                        exit={{ x: `${slideDirection}%` }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 bottom-0 w-full sm:w-[450px] bg-background z-50 shadow-2xl flex flex-col ltr:right-0 rtl:left-0 border-s border-white/5"
                        style={{ [isRtl ? 'left' : 'right']: 0 }}
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-black tracking-tight">{dict.cart} <span className="text-sm font-normal text-muted-foreground ms-2">({items.length} {dict.items})</span></h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/5 transition-colors">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-6 text-center">
                                    <div className="p-8 rounded-full bg-muted/30">
                                        <ShoppingBag className="h-12 w-12 opacity-20" />
                                    </div>
                                    <p className="text-xl font-medium">{dict.emptyCart}</p>
                                    <Button variant="outline" onClick={onClose} className="rounded-full px-8">{dict.continueShopping}</Button>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={`${item.productId}-${index}`}
                                        className="flex gap-5 group p-2 rounded-2xl hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden bg-muted/40 border-white/5 border shadow-sm">
                                            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                        </div>
                                        <div className="flex-1 space-y-1 py-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
                                                    onClick={() => removeItem(item.productId, item.variant)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-sm font-medium text-primary/60 uppercase tracking-widest text-[10px]">{item.variant}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/10"
                                                        onClick={() => decrementQuantity(item.productId, item.variant)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm font-bold min-w-[2ch] text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/10"
                                                        onClick={() => incrementQuantity(item.productId, item.variant)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="text-end">
                                                    <p className="font-black text-lg">{formatCurrency(item.price * item.quantity)}</p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} × {item.quantity}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t space-y-6 bg-gradient-to-t from-muted/20 to-transparent">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">{dict.total}</span>
                                    <span className="font-black text-3xl tracking-tighter">{formatCurrency(total)}</span>
                                </div>
                                <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0" onClick={() => {
                                    onClose();
                                    router.push("/checkout");
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

