"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    productId: string;
    title: string;
    price: number;
    imageUrl: string;
    quantity: number;
    variant?: string; // e.g. "Size: M, Color: Red"
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, variant?: string) => void;
    updateQuantity: (productId: string, quantity: number, variant?: string) => void;
    incrementQuantity: (productId: string, variant?: string) => void;
    decrementQuantity: (productId: string, variant?: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: CartItem) => {
        setItems((current) => {
            const existing = current.find(
                (i) => i.productId === newItem.productId && i.variant === newItem.variant
            );
            if (existing) {
                return current.map((i) =>
                    i.productId === newItem.productId && i.variant === newItem.variant
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...current, newItem];
        });
    };

    const removeItem = (productId: string, variant?: string) => {
        setItems((current) =>
            current.filter((i) => !(i.productId === productId && i.variant === variant))
        );
    };

    const updateQuantity = (productId: string, quantity: number, variant?: string) => {
        if (quantity < 1) return; // Minimum quantity is 1
        setItems((current) =>
            current.map((i) =>
                i.productId === productId && i.variant === variant
                    ? { ...i, quantity }
                    : i
            )
        );
    };

    const incrementQuantity = (productId: string, variant?: string) => {
        setItems((current) =>
            current.map((i) =>
                i.productId === productId && i.variant === variant
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            )
        );
    };

    const decrementQuantity = (productId: string, variant?: string) => {
        setItems((current) =>
            current.map((i) =>
                i.productId === productId && i.variant === variant
                    ? { ...i, quantity: Math.max(1, i.quantity - 1) } // Minimum 1
                    : i
            )
        );
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, incrementQuantity, decrementQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
