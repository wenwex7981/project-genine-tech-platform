"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  file_url?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addedPopup, setAddedPopup] = useState<{show: boolean, title: string}>({show: false, title: ""});

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("genie_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("genie_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        // Already in cart — do NOT double-add, just return unchanged
        setAddedPopup({show: true, title: item.title});
        return prev;
      }
      setAddedPopup({show: true, title: item.title});
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, quantity: Math.max(0, p.quantity + delta) };
      }
      return p;
    }).filter(p => p.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
      
      {/* Added to Cart Popup */}
      {addedPopup.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">Added to Cart!</h3>
            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
              <strong className="text-zinc-700 dark:text-zinc-300">{addedPopup.title}</strong> has been successfully added to your cart.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/cart" onClick={() => setAddedPopup({show: false, title: ""})} className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40">
                Proceed to Checkout
              </Link>
              <button onClick={() => setAddedPopup({show: false, title: ""})} className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-4 py-3.5 rounded-xl font-bold transition-all">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
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
