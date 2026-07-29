"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { CreditCard, Minus, Plus, ShoppingCart, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const { cart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsCheckoutLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    if (!isCheckoutLoaded || totalPrice === 0) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || null;

      if (!userEmail) {
        alert("Please sign in to complete your purchase so we can add the project to your dashboard.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Payment setup failed: " + (errData.error || "Please contact support."));
        return;
      }

      const order = await res.json();

      if (!order.id) {
        alert("Could not create payment order. Please try again.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GraduateNex",
        description: "Premium Purchase",
        order_id: order.id,
        modal: {
          // Fix scroll lock — restore body scroll when modal is dismissed
          ondismiss: function () {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }
        },
        handler: async function (response: any) {
          // Restore scroll immediately when payment completes
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cart,
                total_amount: order.amount / 100,
                user_email: userEmail
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentSuccess(response.razorpay_payment_id);
              clearCart();
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment.");
          }
        },
        theme: { color: "#10b981" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      // Always restore scroll on any error
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      console.error(err);
      alert("Error initiating checkout.");
    }
  };


  if (paymentSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Payment Successful!</h1>
        <div className="max-w-md bg-muted/50 p-6 rounded-2xl border space-y-2 text-left w-full mt-4">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Transaction Details</p>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-zinc-500">Payment ID</span>
            <span className="font-mono font-medium">{paymentSuccess}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-500">Status</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Verified</span>
          </div>
        </div>
        <p className="text-muted-foreground max-w-lg mt-6">
          Your order has been confirmed. A receipt and download links have been sent to your registered email address.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/projects">
            <Button size="lg" variant="outline" className="px-8 font-bold">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="px-8 font-bold">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
          <ShoppingCart className="h-24 w-24 text-muted-foreground opacity-50" />
        </div>
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Looks like you haven't added any projects yet.</p>
        <Link href="/projects">
          <Button size="lg" className="mt-4 px-8 font-bold">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl min-h-screen">
      <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="text-4xl font-extrabold tracking-tight mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between w-full h-full">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{item.price}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                  <div className="flex items-center gap-1 bg-muted rounded-xl p-1 border">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold w-12 text-center text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-zinc-900 border rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-lg">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-black text-2xl">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} size="lg" className="w-full h-16 text-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl flex items-center justify-center gap-3 rounded-2xl transition-transform hover:scale-105">
              <CreditCard className="h-6 w-6" /> Proceed to Pay
            </Button>
            
            <div className="mt-6 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider text-center">Secure Payments By</p>
              <div className="bg-muted px-4 py-2 rounded-lg font-bold text-slate-800 dark:text-white tracking-widest border shadow-sm">
                RAZORPAY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
