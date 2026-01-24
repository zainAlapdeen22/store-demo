"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertOptions {
    title: string;
    message: string;
    type?: AlertType;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirm?: boolean; // If true, shows Cancel button
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    showConfirm: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState<AlertOptions | null>(null);

    const showAlert = (options: AlertOptions) => {
        setConfig({ ...options, isConfirm: false });
        setOpen(true);
    };

    const showConfirm = (options: AlertOptions) => {
        setConfig({ ...options, isConfirm: true });
        setOpen(true);
    };

    const handleConfirm = () => {
        setOpen(false);
        if (config?.onConfirm) config.onConfirm();
    };

    const handleCancel = () => {
        setOpen(false);
        if (config?.onCancel) config.onCancel();
    };

    const getIcon = () => {
        switch (config?.type) {
            case "success":
                return <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />;
            case "error":
                return <AlertCircle className="h-12 w-12 text-destructive mb-4" />;
            case "warning":
                return <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />;
            default:
                return <Info className="h-12 w-12 text-blue-500 mb-4" />;
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="flex flex-col items-center text-center sm:max-w-[400px]">
                    <AlertDialogHeader className="flex flex-col items-center">
                        {getIcon()}
                        <AlertDialogTitle className="text-xl">{config?.title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-base mt-2">
                            {config?.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 w-full sm:justify-center gap-2">
                        {config?.isConfirm && (
                            <AlertDialogCancel onClick={handleCancel} className="w-full sm:w-auto">
                                {config.cancelText || "Cancel"}
                            </AlertDialogCancel>
                        )}
                        <AlertDialogAction onClick={handleConfirm} className="w-full sm:w-auto">
                            {config?.confirmText || "OK"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}
