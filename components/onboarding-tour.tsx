"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/actions/profile";

interface OnboardingTourProps {
    hasSeenOnboarding: boolean;
}

export function OnboardingTour({ hasSeenOnboarding }: OnboardingTourProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!hasSeenOnboarding) {
            // Small delay to ensure hydration
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [hasSeenOnboarding]);

    const steps = [
        {
            title: "Welcome to Your Profile!",
            description: "This is your personal hub where you can manage everything related to your account.",
        },
        {
            title: "Manage Your Details",
            description: "You can easily update your name and phone number to keep your contact info current.",
        },
        {
            title: "Multiple Addresses",
            description: "Add multiple shipping addresses (Home, Work, etc.) for faster checkout.",
        },
        {
            title: "Track Your Orders",
            description: "View your order history and track the status of your shipments in real-time.",
        },
    ];

    const handleNext = async () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            await completeOnboarding();
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                // If user closes dialog, mark as seen
                completeOnboarding();
            }
            setIsOpen(open);
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{steps[step].title}</DialogTitle>
                    <DialogDescription className="pt-2">
                        {steps[step].description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-2 rounded-full ${i === step ? "bg-primary" : "bg-muted"
                                    }`}
                            />
                        ))}
                    </div>
                    <Button onClick={handleNext}>
                        {step === steps.length - 1 ? "Get Started" : "Next"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
