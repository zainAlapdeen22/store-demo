"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { createOrder } from "@/app/actions";
import { Loader2, CreditCard, Camera, MessageCircle, Phone, Globe, Copy } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { useAlert } from "@/components/alert-provider";
import { getAddresses } from "@/actions/profile";
import { AddressManager } from "@/components/profile/address-manager";
import { Address } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentPhone, setPaymentPhone] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const { showAlert } = useAlert();

    useEffect(() => {
        getAddresses().then(setAddresses);
    }, []);

    const handleAddressAdded = async (newAddress: Address) => {
        // Refresh addresses list
        const updatedAddresses = await getAddresses();
        setAddresses(updatedAddresses);
        // Auto-select the newly added address
        setSelectedAddressId(newAddress.id);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) {
            showAlert({
                title: "Error",
                message: "Please select a shipping address.",
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
            setSuccess(true);
            clearCart();
        } catch (error) {
            showAlert({
                title: "Error",
                message: "Order failed. Please try again.",
                type: "error"
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-4xl">🎉</span>
                </div>
                <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
                <p className="text-muted-foreground">Your order is pending payment verification.</p>
                <p className="text-sm">We will notify you once we verify your transfer.</p>
                <Button asChild className="mt-4">
                    <a href="/orders">View My Orders</a>
                </Button>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild><a href="/">Go Shopping</a></Button>
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-4xl grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{item.title} x {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                            <CreditCard className="h-6 w-6" />
                            تعليمات الدفع
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg border shadow-sm">
                            {/* Visual Card Representation */}
                            <div className="w-full max-w-sm aspect-[1.586/1] rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg relative overflow-hidden mb-4">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Globe className="h-24 w-24" />
                                </div>
                                <div className="flex flex-col justify-between h-full relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <div className="h-8 w-12 bg-white/20 rounded"></div>
                                        </div>
                                        <span className="font-mono text-lg tracking-wider">Credit Card</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 items-center">
                                            <span className="font-mono text-xl sm:text-2xl tracking-widest text-shadow">5555 4444 3333 2222</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => {
                                                navigator.clipboard.writeText("5555444433332222");
                                            }}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-white/70 uppercase mb-1">Holder Name</p>
                                                <p className="font-medium tracking-wide">STORE OWNER</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-[10px] text-white/70 uppercase mb-1">Expires</p>
                                                <p className="font-mono">12/30</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900">1. تحويل المبلغ</h4>
                                    <p className="text-sm text-blue-800">قم بتحويل المبلغ الإجمالي إلى البطاقة الظاهرة في الأعلى.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600">
                                    <Camera className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900">2. تصوير الإشعار</h4>
                                    <p className="text-sm text-blue-800">التقط صورة لإشعار التحويل من تطبيق البنك الخاص بك.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900">3. إرسال إلى واتساب</h4>
                                    <p className="text-sm text-blue-800">
                                        أرسل الصورة إلى الرقم <span className="font-bold dir-ltr inline-block">070000000</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                <div className="mt-1 bg-blue-100 p-2 rounded-full text-blue-600">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900">4. تأكيد الطلب</h4>
                                    <p className="text-sm text-blue-800">أدخل رقم هاتفك في الأسفل لتأكيد الطلب.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Checkout Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Recipient Name</label>
                                <Input
                                    required
                                    placeholder="Who is receiving this order?"
                                    value={recipientName}
                                    onChange={e => setRecipientName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Shipping Address</label>
                                <AddressManager
                                    addresses={addresses}
                                    onSelect={(addr) => setSelectedAddressId(addr.id)}
                                    selectedId={selectedAddressId}
                                    onAddressAdded={handleAddressAdded}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sender Phone Number</label>
                                <Input
                                    required
                                    placeholder="The number you used for WhatsApp"
                                    value={paymentPhone}
                                    onChange={e => setPaymentPhone(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">We use this to verify your payment.</p>
                            </div>

                            <Button className="w-full" size="lg" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Order"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
