"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScaleOnTap, ShimmerSheen } from "@/components/ui/MotionWrappers";

type Product = any;
type Variant = any;

export function AddToCart({ product, variants }: { product: Product; variants: Variant[] }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants?.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const isAcceptingOrders = useSettingsStore((state) => state.isAcceptingOrders);
  const router = useRouter();

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const maxQty = Math.min(10, currentStock);
  
  const isOutOfStock = currentStock <= 0 || !product.isAvailable || (selectedVariant && !selectedVariant.isAvailable);
  const isDisabled = isOutOfStock || !isAcceptingOrders;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      price: currentPrice,
      imageUrl: product.imageUrl || "",
      maxQuantity: maxQty,
    }, quantity);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;
  const formatPrice = (p: number) => (p / 100) % 1 === 0 ? (p / 100).toFixed(0) : (p / 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-extrabold text-brand-green">₹{formatPrice(currentPrice)}</span>
        {hasDiscount && (
          <>
            <span className="text-xl line-through text-brand-charcoal/40 font-medium">₹{formatPrice(originalPrice)}</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {variants && variants.length > 0 && (
        <div className="space-y-3">
          <label className="font-bold text-sm text-brand-green">Pack Size</label>
          <div className="flex flex-wrap gap-3">
            {variants.map((v: Variant) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                  disabled={!v.isAvailable || v.stockQuantity <= 0}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-brand-green text-white border-2 border-brand-green"
                      : "bg-white border-2 border-brand-green-light/20 text-brand-charcoal hover:border-brand-green-light"
                  } ${(!v.isAvailable || v.stockQuantity <= 0) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="variantIndicator"
                      className="absolute inset-0 bg-brand-green rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span>{v.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="font-bold text-sm text-brand-green">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-brand-green-light/30 rounded-lg overflow-hidden h-12 w-32 bg-white">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream disabled:opacity-50 active:scale-95 transition-transform"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            
            <div className="w-10 text-center font-medium overflow-hidden relative h-6 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={quantity}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty || isOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream disabled:opacity-50 active:scale-95 transition-transform"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <span className="text-sm opacity-70">
            {isOutOfStock ? (
              <span className="text-red-500 font-medium">Out of stock</span>
            ) : (
              `${currentStock} available`
            )}
          </span>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <ScaleOnTap className="flex-1">
          <Button 
            size="lg" 
            className={`w-full px-8 h-14 text-lg transition-colors ${added ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
            onClick={handleAddToCart}
            disabled={isDisabled}
            variant="outline"
          >
            {added ? (
              <>
                <Check className="mr-2 h-5 w-5" /> Added to Cart
              </>
            ) : !isAcceptingOrders ? (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> Orders Paused
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </>
            )}
          </Button>
        </ScaleOnTap>

        <ScaleOnTap className="flex-1">
          <ShimmerSheen className="rounded-md">
            <Button 
              size="lg" 
              className="w-full px-8 h-14 text-lg bg-brand-pink text-brand-green font-bold hover:bg-brand-pink/90 disabled:opacity-50"
              onClick={() => {
                handleAddToCart();
                router.push('/checkout');
              }}
              disabled={isDisabled}
            >
              {!isAcceptingOrders ? "Ordering Paused" : "Buy Now"}
            </Button>
          </ShimmerSheen>
        </ScaleOnTap>
      </div>

      {!isAcceptingOrders && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-xs text-center font-medium">
          🔔 Store ordering is temporarily paused. You can still browse our products!
        </div>
      )}
    </div>
  );
}
