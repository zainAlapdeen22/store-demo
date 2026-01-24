"use client";

import { CheckCircle2, Circle, Clock, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

export function OrderStatusTimeline({ status }: { status: string }) {
    const { dict } = useI18n();

    const steps = [
        { status: "PENDING_PAYMENT", label: dict.pendingPayment, icon: Clock },
        { status: "PAYMENT_VERIFIED", label: dict.paymentVerified, icon: CheckCircle2 },
        { status: "PROCESSING", label: dict.processing, icon: Package },
        { status: "SHIPPED", label: dict.shipped, icon: Truck },
        { status: "DELIVERED", label: dict.delivered, icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex((s) => s.status === status);
    // Handle cancelled or unknown
    const isCancelled = status === "CANCELLED";

    if (isCancelled) {
        return <div className="text-red-500 font-bold">{dict.cancelled}</div>;
    }

    return (
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto py-4">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <div key={step.status} className="flex flex-col items-center relative flex-1">
                        {/* Connector Line */}
                        {index !== 0 && (
                            <div
                                className={cn(
                                    "absolute top-4 right-[50%] w-full h-1 -z-10",
                                    index <= currentStepIndex ? "bg-primary" : "bg-muted"
                                )}
                            />
                        )}

                        <div
                            className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background z-10 transition-colors",
                                isCompleted ? "border-primary text-primary" : "border-muted text-muted-foreground",
                                isCurrent && "ring-4 ring-primary/20"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <span className={cn("text-xs mt-2 font-medium text-center", isCurrent ? "text-primary" : "text-muted-foreground")}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
