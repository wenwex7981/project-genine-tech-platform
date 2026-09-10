"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface PayPalCheckoutButtonProps {
  amount: number;
  currency: string;
  items: any;
  country: string;
  userEmail?: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: any) => void;
}

export function PayPalCheckoutButton({
  amount,
  currency,
  items,
  country,
  userEmail,
  onSuccess,
  onError,
}: PayPalCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

  return (
    <PayPalScriptProvider options={{ clientId: clientId, currency: currency, intent: "capture" }}>
      <div className="w-full mt-4">
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "gold" }}
          createOrder={async (data, actions) => {
            // Check auth
            let emailToUse = userEmail;
            if (!emailToUse) {
              const { data: { session } } = await supabase.auth.getSession();
              emailToUse = session?.user?.email || undefined;
            }
            if (!emailToUse) {
              alert("Please sign in to complete your purchase so we can add the project to your dashboard.");
              window.location.href = "/login";
              throw new Error("User not authenticated");
            }

            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount.toString(),
                  },
                  description: Array.isArray(items) 
                    ? items.map(i => `${i.title} (x${i.quantity || 1})`).join(", ").substring(0, 127)
                    : (items?.title || "GraduateNex Purchase").substring(0, 127)
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (!actions.order) return;
            setIsProcessing(true);
            try {
              const details = await actions.order.capture();
              
              let emailToUse = userEmail;
              if (!emailToUse) {
                const { data: { session } } = await supabase.auth.getSession();
                emailToUse = session?.user?.email || undefined;
              }

              // Verify on our backend
              const res = await fetch('/api/verify-paypal-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paypal_order_id: details.id,
                  items,
                  total_amount: amount,
                  currency_code: currency,
                  country_code: country,
                  user_email: emailToUse
                })
              });
              
              const verifyData = await res.json();
              if (verifyData.success) {
                onSuccess(`paypal_${details.id}`);
              } else {
                onError("Verification failed");
              }
            } catch (err) {
              console.error(err);
              onError(err);
            } finally {
              setIsProcessing(false);
            }
          }}
          onError={(err) => {
            console.error("PayPal Error", err);
            onError(err);
          }}
        />
        {isProcessing && <p className="text-center text-sm mt-2 text-muted-foreground">Verifying payment...</p>}
      </div>
    </PayPalScriptProvider>
  );
}
