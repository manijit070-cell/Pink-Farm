"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";

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
  const maxQty = Math.min(10, currentStock); // Limit to 10 or stock
  
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
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-brand-green">₹{(currentPrice / 100).toFixed(2)}</span>
        {product.originalPrice && !selectedVariant && (
          <span className="text-xl line-through opacity-50">₹{(product.originalPrice / 100).toFixed(2)}</span>
        )}
      </div>

      {variants && variants.length > 0 && (
        <div className="space-y-3">
          <label className="font-bold text-sm text-brand-green">Pack Size</label>
          <div className="flex flex-wrap gap-3">
            {variants.map((v: Variant) => (
              <button
                key={v.id}
                onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                disabled={!v.isAvailable || v.stockQuantity <= 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedVariant?.id === v.id
                    ? "bg-brand-green text-white border-2 border-brand-green"
                    : "bg-white border-2 border-brand-green-light/20 text-brand-charcoal hover:border-brand-green-light"
                } ${(!v.isAvailable || v.stockQuantity <= 0) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {v.name}
              </button>
            ))}
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
              className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty || isOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream disabled:opacity-50"
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
        <Button 
          size="lg" 
          className={`flex-1 px-8 h-14 text-lg ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant="outline"
        >
          {added ? (
            <>
              <Check className="mr-2 h-5 w-5" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </>
          )}
        </Button>
        <Button 
          size="lg" 
          className="flex-1 px-8 h-14 text-lg bg-brand-pink text-brand-green font-bold hover:bg-brand-pink/90"
          onClick={() => {
            handleAddToCart();
            router.push('/checkout');
          }}
          disabled={isOutOfStock}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
