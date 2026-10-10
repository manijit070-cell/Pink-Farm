import { prisma } from "@/lib/db";
import { ProductListClient } from "./ProductListClient";
import { FadeIn } from "@/components/ui/MotionWrappers";
import { Sparkles } from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Shop All Products — Pink Farm",
  description: "Browse our complete collection of roasted Makhana, premium dry fruits, and traditional pantry essentials.",
};

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { isFeatured: "desc" },
    });
  } catch (error) {
    console.error("Database connection failed in products page", error);
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
      
      {/* Header */}
      <FadeIn direction="up">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink border border-brand-pink-accent/50 text-brand-green text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm Direct &bull; Zero Preservatives</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-green font-extrabold tracking-tight">
            Our Pantry <span className="italic font-light text-brand-green-light">Collection</span>
          </h1>
          
          <p className="text-base sm:text-lg text-brand-charcoal/75 leading-relaxed">
            Thoughtfully curated daily essentials, crafted for health, crunch, and authentic flavor.
          </p>
        </div>
      </FadeIn>

      {/* Interactive Animated Client List */}
      <ProductListClient initialProducts={products} />

    </div>
  );
}
