"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { createOrder } from "@/app/actions";
import { Loader2, CreditCard, Camera, MessageCircle, Phone, Globe, Copy } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency, isValidIraqiPhone } from "@/lib/utils";

import { useAlert } from "@/components/alert-provider";
import { getAddresses } from "@/actions/profile";
import { AddressManager } from "@/components/profile/address-manager";
import { Address } from "@prisma/client";
import { motion } from "framer-motion";


export const dynamic = 'force-dynamic';

import { useI18n } from "@/components/i18n-provider";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentPhone, setPaymentPhone] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const { showAlert } = useAlert();
    const { dict, language } = useI18n();
    const router = useRouter();

    useEffect(() => {
        getAddresses().then(setAddresses);
    }, []);

    const handleAddressAdded = async (newAddress: Address) => {
        const updatedAddresses = await getAddresses();
        setAddresses(updatedAddresses);
        setSelectedAddressId(newAddress.id);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) {
            showAlert({
                title: dict.error,
                message: dict.pleaseSelectAddress,
                type: "error"
            });
            return;
        }

        if (!isValidIraqiPhone(paymentPhone)) {
            showAlert({
                title: dict.error,
                message: dict.invalidPhone,
                type: "error"
            });
            return;
        }

        setLoading(true);
        const fullAddress = `${selectedAddress.label}: ${selectedAddress.state}, ${selectedAddress.city}, ${selectedAddress.landmark || ''} ${selectedAddress.notes ? `(${selectedAddress.notes})` : ''}`;

        try {
            await createOrder(
                items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                paymentPhone,
                fullAddress,
                recipientName
            );
            // No alert on success, just transition to success view
            setSuccess(true);
            clearCart();
        } catch (error) {
            showAlert({
                title: dict.error,
                message: dict.orderFailedTryAgain,
                type: "error"
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container py-32 flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto px-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20"
                >
                    <span className="text-5xl">🎉</span>
                </motion.div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight">{dict.orderSuccess}</h1>
                    <p className="text-xl text-muted-foreground">{dict.orderPendingDesc}</p>
                </div>
                <p className="text-muted-foreground/80 max-w-sm">{dict.orderNotifyDesc}</p>
                <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20" onClick={() => router.push("/orders")}>
                    {dict.viewOrders}
                </Button>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container py-32 text-center space-y-6">
                <h1 className="text-3xl font-black tracking-tight">{dict.emptyCart}</h1>
                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-bold" onClick={() => router.push("/")}>
                    {dict.goShopping}
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-20 px-6 max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
                <div className="space-y-8">
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 p-8 border-b border-primary/5">
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-primary" />
                                {dict.paymentInstructions}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-col items-center">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full max-w-md aspect-[1.586/1] rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <Globe className="h-32 w-32" />
                                    </div>
                                    <div className="flex flex-col justify-between h-full relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="h-10 w-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-inner"></div>
                                            <span className="font-mono text-sm tracking-widest opacity-50 uppercase">Premium Select</span>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-2xl sm:text-3xl tracking-[0.2em] font-black text-shadow-lg">
                                                    5555 4444 3333 2222
                                                </span>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-white/10 rounded-full" onClick={() => {
                                                    navigator.clipboard.writeText("5555444433332222");
                                                    showAlert({ title: dict.success, message: language === "ar" ? "تم نسخ الرقم" : "Number copied", type: "success" });
                                                }}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-white/40 uppercase font-black mb-1">{dict.cardHolder}</p>
                                                    <p className="font-bold tracking-widest text-lg">ONYX STORE OWNER</p>
                                                </div>
                                                <div className="text-end">
                                                    <p className="text-[10px] text-white/40 uppercase font-black mb-1">{dict.expires}</p>
                                                    <p className="font-mono text-lg font-bold">12/30</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid gap-4">
                                {[
                                    { step: dict.payStep1, desc: dict.payStep1Desc, icon: CreditCard },
                                    { step: dict.payStep2, desc: dict.payStep2Desc, icon: Camera },
                                    { step: dict.payStep3, desc: dict.payStep3Desc, icon: MessageCircle },
                                    { step: dict.payStep4, desc: dict.payStep4Desc, icon: Phone },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-primary/5 transition-all group">
                                        <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg">{item.step}</h4>
                                            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8 sticky top-24">
                    <Card className="border-none shadow-2xl shadow-primary/5 border-t-4 border-t-primary rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">{dict.orderSummary}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="space-y-4">
                                {items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-base">
                                        <span className="text-muted-foreground">{item.title} <span className="font-bold text-primary/80">x{item.quantity}</span></span>
                                        <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-dashed border-border flex justify-between items-end">
                                <span className="text-muted-foreground font-medium">{dict.total}</span>
                                <span className="font-black text-4xl tracking-tighter text-primary">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black font-primary">
                                {language === "ar" ? "تفاصيل إتمام الطلب" : "Finalize Order"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-primary/60">{dict.recipientName}</label>
                                    <Input
                                        required
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
                                        placeholder={dict.recipientPlaceholder}
                                        value={recipientName}
                                        onChange={e => setRecipientName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-primary/60">{dict.shippingAddress}</label>
                                    <AddressManager
                                        addresses={addresses}
                                        onSelect={(addr) => setSelectedAddressId(addr.id)}
                                        selectedId={selectedAddressId}
                                        onAddressAdded={handleAddressAdded}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-primary/60">{dict.paymentPhone}</label>
                                    <Input
                                        required
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
                                        placeholder={dict.paymentPhonePlaceholder}
                                        value={paymentPhone}
                                        onChange={e => setPaymentPhone(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{dict.paymentPhoneDesc}</p>
                                </div>

                                <Button className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1" size="lg" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : dict.completeOrder}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

