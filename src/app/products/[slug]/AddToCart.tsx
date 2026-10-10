"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check, ShieldCheck, Truck, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScaleOnTap } from "@/components/ui/MotionWrappers";

type Product = any;
type Variant = any;

export function AddToCart({ product, variants }: { product: Product; variants: Variant[] }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants?.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const maxQty = Math.min(10, currentStock);
  
  const isOutOfStock = currentStock <= 0 || !product.isAvailable || (selectedVariant && !selectedVariant.isAvailable);

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
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3">
        <motion.span 
          key={currentPrice}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold text-brand-green tracking-tight"
        >
          ₹{(currentPrice / 100).toFixed(0)}
        </motion.span>
        {product.originalPrice && !selectedVariant && (
          <span className="text-xl line-through text-brand-charcoal/40">
            ₹{(product.originalPrice / 100).toFixed(0)}
          </span>
        )}
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-pink text-brand-green border border-brand-pink-accent/40">
          Inclusive of all taxes
        </span>
      </div>

      {/* Pack Size Variants */}
      {variants && variants.length > 0 && (
        <div className="space-y-3">
          <label className="font-bold text-xs uppercase tracking-wider text-brand-green flex items-center gap-1.5">
            <span>Select Pack Size</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {variants.map((v: Variant) => {
              const isSelected = selectedVariant?.id === v.id;
              const isVariantDisabled = !v.isAvailable || v.stockQuantity <= 0;

              return (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                  disabled={isVariantDisabled}
                  className={`relative px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
                    isSelected
                      ? "text-white border-brand-green shadow-md"
                      : "bg-white text-brand-charcoal border-brand-pink-accent/40 hover:border-brand-green/40 shadow-sm"
                  } ${isVariantDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeVariantPill"
                      className="absolute inset-0 bg-brand-green rounded-2xl shadow-md -z-10"
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

      {/* Quantity Selector with Animated Numbers */}
      <div className="space-y-3">
        <label className="font-bold text-xs uppercase tracking-wider text-brand-green">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-brand-pink-accent/50 rounded-2xl overflow-hidden h-12 w-36 bg-white shadow-sm">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream active:scale-95 transition-all disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            
            {/* Animated Quantity Counter */}
            <div className="w-12 text-center font-bold text-brand-green overflow-hidden relative h-6 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={quantity}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block text-base"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty || isOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream active:scale-95 transition-all disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <span className="text-xs font-medium text-brand-charcoal/70">
            {isOutOfStock ? (
              <span className="text-red-500 font-bold">Currently Sold Out</span>
            ) : (
              `${currentStock} in stock • Ready to dispatch`
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-4">
        
        {/* Add to Cart Button */}
        <ScaleOnTap className="flex-1">
          <Button 
            size="lg" 
            className={`w-full rounded-2xl h-14 text-base font-bold transition-all duration-300 shadow-md ${
              added 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-white hover:bg-brand-cream text-brand-green border-2 border-brand-green/30'
            }`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.div
                  key="added"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  <span>Added to Cart!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="cart"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </ScaleOnTap>

        {/* Buy Now (Direct to Checkout) */}
        <ScaleOnTap className="flex-1">
          <Button 
            size="lg" 
            className="w-full rounded-2xl h-14 text-base font-bold bg-brand-green text-white hover:bg-brand-green-light shadow-lg hover:shadow-xl"
            onClick={() => {
              handleAddToCart();
              router.push('/checkout');
            }}
            disabled={isOutOfStock}
          >
            <span>Buy Now with UPI</span>
          </Button>
        </ScaleOnTap>

      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-pink-accent/40 text-xs font-semibold text-brand-charcoal/80">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 border border-brand-pink-accent/20">
          <Truck className="w-4 h-4 text-brand-green" />
          <span>Dispatched within 24h</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 border border-brand-pink-accent/20">
          <ShieldCheck className="w-4 h-4 text-brand-green" />
          <span>100% Quality Assured</span>
        </div>
      </div>

    </div>
  );
}
