"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScaleOnTap, FadeIn } from "@/components/ui/MotionWrappers";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 && subtotal < 80000 ? 6000 : 0; // Free above 800 INR
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-brand-cream/80 border border-brand-pink-accent/40 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-6 text-brand-green/40 shadow-inner"
        >
          <ShoppingBag size={48} strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-green font-bold mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-sm sm:text-base text-brand-charcoal/70 mb-8 max-w-sm mx-auto">
          Looks like you haven&apos;t added any wholesome goodness to your bag yet.
        </p>
        
        <ScaleOnTap>
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-semibold bg-brand-green text-white hover:bg-brand-green-light shadow-md">
            <Link href="/products" className="flex items-center gap-2">
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </ScaleOnTap>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
      
      <FadeIn direction="down">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green-light">Your Order</span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green font-extrabold mt-1">
            Shopping Cart <span className="text-xl font-normal text-brand-charcoal/50">({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
          </h1>
        </div>
      </FadeIn>
      
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        
        {/* Cart Items List */}
        <div className="flex-[2] space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div 
                key={`${item.id}-${item.variantId}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-3xl border border-brand-pink-accent/40 shadow-sm relative overflow-hidden"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-cream relative overflow-hidden flex-shrink-0 border border-brand-pink-accent/20">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-brand-green/30">Item</div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <Link 
                        href={`/products/${item.slug}`} 
                        className="font-serif text-base sm:text-lg text-brand-green hover:text-brand-green-light transition-colors font-bold leading-snug"
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.id, item.variantId)} 
                        className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.variantName && (
                      <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-pink text-brand-green font-medium">
                        Pack: {item.variantName}
                      </span>
                    )}
                    <p className="font-extrabold text-brand-green mt-2 text-sm sm:text-base">
                      ₹{(item.price / 100).toFixed(0)}
                    </p>
                  </div>
                  
                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-pink/50">
                    <div className="flex items-center border border-brand-pink-accent/50 rounded-xl overflow-hidden h-9 bg-brand-cream/60">
                      <button 
                        onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                        className="px-2.5 h-full flex items-center justify-center hover:bg-white active:scale-95 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-brand-green">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                        className="px-2.5 h-full flex items-center justify-center hover:bg-white active:scale-95 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <p className="font-bold text-sm sm:text-base text-brand-charcoal">
                      ₹{((item.price * item.quantity) / 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary Sticky Panel */}
        <div className="flex-1">
          <FadeIn direction="left" delay={0.2}>
            <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-brand-pink-accent/40 shadow-lg sticky top-28 space-y-6">
              <h2 className="font-serif text-2xl text-brand-green font-bold">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-brand-charcoal/80 pb-6 border-b border-brand-pink-accent/30">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">₹{(subtotal / 100).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">FREE</span>
                    ) : (
                      `₹${(deliveryFee / 100).toFixed(0)}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-brand-charcoal/60 pt-1">
                    Add ₹{((80000 - subtotal) / 100).toFixed(0)} more for FREE Delivery!
                  </p>
                )}
              </div>
              
              <div className="flex justify-between font-extrabold text-xl text-brand-green">
                <span>Total Amount</span>
                <span>₹{(total / 100).toFixed(0)}</span>
              </div>
              
              <ScaleOnTap>
                <Button asChild size="lg" className="w-full text-base h-14 rounded-2xl bg-brand-green text-white hover:bg-brand-green-light font-bold shadow-lg shadow-brand-green/20">
                  <Link href="/checkout" className="flex items-center justify-center gap-2">
                    <span>Proceed to UPI Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </ScaleOnTap>
              
              <div className="pt-2 text-center text-xs text-brand-charcoal/60 space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-brand-green font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Secure Instant UPI Payment</span>
                </div>
                <p>Pan-India fast dispatch within 24 hours.</p>
              </div>

            </div>
          </FadeIn>
        </div>

      </div>
    </div>
  );
}
