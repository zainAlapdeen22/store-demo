"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress, deleteAddress } from "@/actions/profile";
import { Loader2, Plus, Trash2, MapPin } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import { useAlert } from "@/components/alert-provider";

interface Address {
    id: string;
    label: string;
    street: string | null;
    city: string;
    state: string | null;
    zip: string | null;
    country: string;
    landmark: string | null;
    notes: string | null;
}

interface AddressManagerProps {
    addresses: Address[];
    onSelect?: (address: Address) => void;
    selectedId?: string;
    onAddressAdded?: (address: any) => void;
}

const governorates = [
    "baghdad", "basra", "nineveh", "erbil", "kirkuk", "sulaymaniyah", "anbar", "babil",
    "dhiQar", "najaf", "karbala", "saladin", "wasit", "qadisiyah", "maysan", "diyala",
    "muthanna", "duhok"
] as const;

export function AddressManager({ addresses, onSelect, selectedId, onAddressAdded }: AddressManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { dict } = useI18n();
    const { showAlert, showConfirm } = useAlert();

    async function onAdd(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsAdding(true);

        const formData = new FormData(e.currentTarget);
        const result = await addAddress(formData);
        setIsAdding(false);

        if (result.error) {
            console.error(result.error);
            showAlert({
                title: "Error",
                message: typeof result.error === 'string' ? result.error : JSON.stringify(result.error),
                type: "error"
            });
        } else {
            setIsOpen(false);
            showAlert({
                title: "Success",
                message: "Address added successfully",
                type: "success"
            });
            // Call the callback with the new address if provided
            if (result.address && onAddressAdded) {
                onAddressAdded(result.address);
            }
        }
    }

    async function onDelete(id: string) {
        showConfirm({
            title: "Delete Address",
            message: "Are you sure you want to delete this address?",
            type: "warning",
            confirmText: "Delete",
            onConfirm: async () => {
                await deleteAddress(id);
                showAlert({
                    title: "Success",
                    message: "Address deleted successfully",
                    type: "success"
                });
            }
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{dict.multipleAddresses}</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> {dict.addAddress}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{dict.addAddress}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={onAdd} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">{dict.address} Label</Label>
                                <Input id="label" name="label" required placeholder="Home, Work..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state">{dict.governorate}</Label>
                                    <select
                                        id="state"
                                        name="state"
                                        required
                                        defaultValue=""
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="" disabled>{dict.selectGovernorate}</option>
                                        {governorates.map((gov) => (
                                            <option key={gov} value={gov}>
                                                {dict[gov]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">{dict.region}</Label>
                                    <Input id="city" name="city" required placeholder={dict.region} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="landmark">{dict.landmark}</Label>
                                <Input id="landmark" name="landmark" required placeholder={dict.landmark} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">{dict.notes}</Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={dict.notes}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isAdding}>
                                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {dict.saveAddress}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                    <Card
                        key={address.id}
                        className={cn(
                            "cursor-pointer transition-all hover:border-primary",
                            selectedId === address.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                        )}
                        onClick={() => onSelect?.(address)}
                    >
                        <CardContent className="p-4 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {onSelect && (
                                        <div className={cn(
                                            "h-4 w-4 rounded-full border border-primary flex items-center justify-center",
                                            selectedId === address.id ? "bg-primary" : "bg-transparent"
                                        )}>
                                            {selectedId === address.id && <div className="h-2 w-2 rounded-full bg-white" />}
                                        </div>
                                    )}
                                    {!onSelect && <MapPin className="h-5 w-5 text-muted-foreground" />}
                                </div>
                                <div>
                                    <p className="font-medium">{address.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {dict[address.state as keyof typeof dict] || address.state}, {address.city}
                                    </p>
                                    {address.landmark && (
                                        <p className="text-sm text-muted-foreground">{address.landmark}</p>
                                    )}
                                    {address.notes && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">&quot;{address.notes}&quot;</p>
                                    )}
                                </div>
                            </div>
                            {!onSelect && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(address.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {addresses.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        {dict.noAddresses || "No addresses saved yet."}
                    </div>
                )}
            </div>
        </div>
    );
}
