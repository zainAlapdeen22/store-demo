import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: { user: true, items: { include: { product: true } } },
    });

    if (!order) return notFound();

    // Mapping English status to Arabic
    const statusMap: Record<string, string> = {
        "PENDING_PAYMENT": "بانتظار الدفع",
        "PAYMENT_VERIFIED": "تم الدفع",
        "PROCESSING": "قيد التجهيز",
        "SHIPPED": "تم الشحن",
        "DELIVERED": "تم التوصيل",
        "CANCELLED": "ملغي",
    };

    const statusArabic = statusMap[order.status] || order.status;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-8 max-w-[1000px] mx-auto print:p-0 print:max-w-none" dir="rtl">
            {/* Header */}
            <header className="flex justify-between items-start mb-8">
                <div className="flex gap-4 items-center">
                    <div className="h-16 w-16 bg-blue-500 flex items-center justify-center text-white rounded-lg print:print-color-adjust-exact">
                        {/* Placeholder Logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">E-Invoice</h1>
                        <p className="text-xl text-slate-600">الفاتورة الإلكترونية</p>
                    </div>
                </div>
                <div className="text-left text-sm space-y-1">
                    <p className="font-bold">اسم الشركة: <span className="font-normal text-slate-600">متجر الكتروني</span></p>
                    <p className="font-bold">عنوان الشركة: <span className="font-normal text-slate-600">بغداد، العراق</span></p>
                    <p className="font-bold">رقم الهاتف: <span className="font-normal text-slate-600">07700000000</span></p>
                </div>
            </header>

            {/* Print Button (Hidden in Print) */}
            <div className="mb-6 text-left print:hidden">
                <PrintButton />
            </div>

            {/* Invoice Meta Bar */}
            <div className="bg-[#002060] text-white p-3 flex justify-between items-center mb-8 print:print-color-adjust-exact">
                <div className="text-lg font-bold px-4">
                    رقم الفاتورة: <span className="font-mono">{order.id.slice(0, 8)}</span>
                </div>
                <div className="text-lg font-bold px-4">
                    الجهة المحرر لها الفاتورة:
                </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Invoice Dates */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between max-w-xs border-b border-dashed border-slate-300 pb-1">
                        <span className="font-bold">تاريخ الاصدار:</span>
                        <span className="font-mono">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between max-w-xs border-b border-dashed border-slate-300 pb-1">
                        <span className="font-bold">تاريخ الاستحقاق:</span>
                        <span className="font-mono">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between max-w-xs border-b border-dashed border-slate-300 pb-1">
                        <span className="font-bold">شروط الدفع:</span>
                        <span>نقدي عند الاستلام</span>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 text-sm text-left" dir="ltr">
                    {/* Using LTR container for alignment matching the image's "Customer Name" on the right side if it was mirrored, but since it's Arabic, RTL is standard. 
                        Wait, the image provided shows "الجهة المحرر لها الفاتورة" on the RIGHT (blue bar). 
                        But the text "اسم العميل" is on the RIGHT column in the image.
                        Let's stick to standard RTL: 
                        Right column: Dates? Left column: Customer? 
                        The image has "Invoice Number" on the left of the bar, "Client" on the right.
                        Below that, on the right side: Client Name, Address, CR.
                        On the left side: Dates. 
                    */}
                    <div className="text-right space-y-2" dir="rtl">
                        <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                            <span className="font-bold">اسم العميل:</span>
                            <span>{order.recipientName || order.user.name || "ضيف"}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                            <span className="font-bold">عنوان العميل:</span>
                            <span className="whitespace-pre-wrap truncate max-w-[200px]">{order.shippingAddress || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                            <span className="font-bold">سجل تجاري:</span>
                            <span>-</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                            <span className="font-bold">الرقم الضريبي:</span>
                            <span>-</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-0">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#002060] text-white text-sm print:print-color-adjust-exact">
                            <th className="py-3 px-4 text-center border-r border-white/20 whitespace-nowrap">الرمز</th>
                            <th className="py-3 px-4 text-right border-r border-white/20 w-1/2">الصنف</th>
                            <th className="py-3 px-4 text-center border-r border-white/20">الكمية</th>
                            <th className="py-3 px-4 text-center border-r border-white/20">سعر الوحدة</th>
                            <th className="py-3 px-4 text-center border-r border-white/20">الضريبة</th>
                            <th className="py-3 px-4 text-center border-r border-white/20">الخصم</th>
                            <th className="py-3 px-4 text-center">الاجمالي</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {order.items.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100 print:bg-gray-100 print:print-color-adjust-exact"}>
                                <td className="py-2 px-4 text-center border-b border-slate-200 text-green-600 font-bold">✔</td>
                                <td className="py-2 px-4 text-right border-b border-slate-200 font-medium">{item.product.title}</td>
                                <td className="py-2 px-4 text-center border-b border-slate-200">{item.quantity}</td>
                                <td className="py-2 px-4 text-center border-b border-slate-200 font-mono" dir="ltr">{formatCurrency(item.price).replace("IQD", "")}</td>
                                <td className="py-2 px-4 text-center border-b border-slate-200">0%</td>
                                <td className="py-2 px-4 text-center border-b border-slate-200">0.00</td>
                                <td className="py-2 px-4 text-center border-b border-slate-200 font-bold font-mono" dir="ltr">{formatCurrency(item.price * item.quantity).replace("IQD", "")}</td>
                            </tr>
                        ))}
                        {/* Empty rows to fill space if needed, matching the aesthetic of the image with striped empty rows */}
                        {[1, 2, 3].map((_, i) => (
                            <tr key={`empty-${i}`} className={(order.items.length + i) % 2 === 0 ? "bg-white" : "bg-gray-100 print:bg-gray-100 print:print-color-adjust-exact"}>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                                <td className="py-4 border-b border-slate-200">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Totals */}
            <div className="flex justify-end mt-4">
                <div className="w-1/2">
                    <div className="flex justify-between items-center py-2 px-4">
                        <span className="font-bold text-slate-800">المجموع الجزئي</span>
                        <span className="font-mono text-slate-800" dir="ltr">{formatCurrency(order.total).replace("IQD", "")} <span className="text-xs text-slate-500">د.ع</span></span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4">
                        <span className="font-bold text-slate-800">الخصومات</span>
                        <span className="font-mono text-slate-800" dir="ltr">0.00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4">
                        <span className="font-bold text-slate-800">ضريبة القيمة المضافة</span>
                        <span className="font-mono text-slate-800" dir="ltr">0.00</span>
                    </div>
                    {/* Grand Total */}
                    <div className="flex justify-between items-center py-3 px-4 bg-slate-200 mt-2 print:bg-slate-200 print:print-color-adjust-exact">
                        <span className="font-bold text-slate-900 text-lg">اجمالي الفاتورة</span>
                        <span className="font-bold text-slate-900 text-lg font-mono" dir="ltr">{formatCurrency(order.total).replace("IQD", "")} <span className="text-sm font-normal">د.ع</span></span>
                    </div>
                    <div className="mt-8 text-right font-bold text-sm">
                        شكراً لتعاملك معنا!
                    </div>
                </div>
            </div>
        </div>
    );
}
