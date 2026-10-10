"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/store/cartStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit PIN code required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutClient() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const deliveryFeeSetting = useSettingsStore((state) => state.deliveryFee);
  const freeDeliveryThreshold = useSettingsStore((state) => state.freeDeliveryThreshold);
  const isAcceptingOrders = useSettingsStore((state) => state.isAcceptingOrders);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  if (!mounted) return null;

  if (items.length === 0 && !isSuccess) {
    router.push("/cart");
    return null;
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeDelivery = freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : (deliveryFeeSetting ?? 5000)) : 0;
  const total = subtotal + deliveryFee;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!isAcceptingOrders) {
      setError("Online orders are currently paused by the store admin. Please try again later.");
      return;
    }
    setIsProcessing(true);
    setError("");

    try {
      // 1. Create order on server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerDetails: data, items }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to create order");
      }

      // If development and Razorpay keys aren't set, it might bypass payment
      if (responseData.bypassed) {
        setIsSuccess(true);
        clearCart();
        router.push(`/order/${responseData.orderNumber}`);
        return;
      }

      // 2. Launch Razorpay UPI Checkout
      const options = {
        key: responseData.keyId, 
        amount: responseData.amount, 
        currency: "INR",
        name: "Pink Farm",
        description: "Premium Grocery Order",
        order_id: responseData.gatewayOrderId,
        handler: async function (response: any) {
          // Verify payment on server
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: responseData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order/${responseData.orderNumber}?status=success`);
            } else {
              setError("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err) {
            setError("Error verifying payment.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: data.fullName,
          contact: data.mobile,
        },
        theme: {
          color: "#1A3C34", // brand-green
        },
        method: {
          upi: true,
          netbanking: false,
          card: false,
          wallet: false,
          paylater: false
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setError("Payment failed. You can retry.");
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Checkout Form */}
      <div className="flex-[2]">
        <h2 className="font-serif text-2xl text-brand-green mb-6">Delivery Details</h2>
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-charcoal">Full Name *</label>
              <input {...register("fullName")} className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-charcoal">Mobile Number *</label>
              <input {...register("mobile")} type="tel" placeholder="10 digits" className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
              {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-charcoal">House/Flat No. & Street *</label>
            <input {...register("addressLine1")} className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
            {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-charcoal">Landmark (Optional)</label>
            <input {...register("addressLine2")} className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-bold text-brand-charcoal">PIN Code *</label>
              <input {...register("pinCode")} maxLength={6} className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
              {errors.pinCode && <p className="text-red-500 text-xs">{errors.pinCode.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-bold text-brand-charcoal">City *</label>
              <input {...register("city")} className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-bold text-brand-charcoal">State *</label>
              <input {...register("state")} className="w-full border border-brand-green-light/20 rounded-md p-3 focus:outline-none focus:border-brand-green" />
              {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
            </div>
          </div>
        </form>
      </div>

      {/* Order Summary & Payment */}
      <div className="flex-1">
        <div className="bg-brand-cream p-6 md:p-8 rounded-3xl sticky top-24 border border-brand-green-light/10 shadow-sm">
          <h2 className="font-serif text-2xl text-brand-green mb-6">Review & Pay</h2>
          
          <div className="space-y-4 mb-6 pb-6 border-b border-brand-green-light/20 max-h-60 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={`${item.id}-${item.variantId}`} className="flex justify-between text-sm">
                <div className="flex gap-3">
                  <span className="font-bold">{item.quantity}x</span>
                  <div>
                    <p className="font-medium text-brand-green">{item.name}</p>
                    {item.variantName && <p className="opacity-70 text-xs">{item.variantName}</p>}
                  </div>
                </div>
                <span className="font-medium">₹{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3 text-sm opacity-90 mb-6 pb-6 border-b border-brand-green-light/20">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${formatPrice(deliveryFee)}`}</span>
            </div>
          </div>
          
          <div className="flex justify-between font-bold text-xl text-brand-green mb-6">
            <span>Total Payable</span>
            <span>₹{formatPrice(total)}</span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}
          
          <div className="bg-brand-green/5 p-4 rounded-xl mb-6 text-sm text-center">
             <p className="font-medium text-brand-green mb-1">Pay Securely via UPI</p>
             <p className="opacity-70">GPay, PhonePe, Paytm, and more.</p>
          </div>
          
          <Button 
            type="submit" 
            form="checkout-form"
            size="lg" 
            className="w-full text-base h-14"
            disabled={isProcessing || !isAcceptingOrders}
          >
            {isProcessing ? "Processing..." : !isAcceptingOrders ? "Orders Temporarily Paused" : `Pay ₹${(total / 100).toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
