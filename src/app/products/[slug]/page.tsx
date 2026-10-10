import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddToCart } from "./AddToCart";
import { ChevronRight, Sparkles, ShieldCheck, Heart, Leaf } from "lucide-react";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrappers";

export const instant = false;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug: slug },
      include: { variants: true },
    });
  } catch (error) {
    console.error("Database connection failed", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-16">
      
      {/* Breadcrumb */}
      <FadeIn direction="down" delay={0.1}>
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-charcoal/70 mb-8 sm:mb-10">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <Link href="/products" className="hover:text-brand-green transition-colors">Pantry Products</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-brand-green font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Column: Visual Showcase */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none mx-auto">
          <FadeIn direction="right">
            <HoverCard lift={-4}>
              <div className="relative aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-pink to-brand-cream border-2 border-brand-pink-accent/40 shadow-xl">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-brand-green/30">
                    Product Image
                  </div>
                )}
                
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ★ Signature Selection
                  </div>
                )}
              </div>
            </HoverCard>
          </FadeIn>
        </div>

        {/* Right Column: Details & Add to Cart */}
        <div className="flex-1 flex flex-col justify-start">
          <FadeIn direction="left" delay={0.15}>
            <div className="space-y-4">
              
              {product.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink text-brand-green text-xs font-bold uppercase tracking-wider border border-brand-pink-accent/50">
                  <Sparkles className="w-3 h-3" />
                  <span>{product.category}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green font-extrabold leading-tight">
                {product.name}
              </h1>

              <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Add to Cart Component */}
              <div className="pt-4">
                <AddToCart product={product} variants={product.variants} />
              </div>

              {/* Expanded Description & Details */}
              <div className="mt-10 space-y-6 border-t border-brand-pink-accent/40 pt-8">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-green mb-2">About this product</h3>
                  <p className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
                
                {product.ingredients && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-green mb-1.5">Ingredients</h3>
                    <p className="text-sm text-brand-charcoal/80 leading-relaxed">{product.ingredients}</p>
                  </div>
                )}

                {/* Storage & Delivery Strip */}
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm bg-brand-cream/80 border border-brand-pink-accent/30 p-4 rounded-2xl">
                  <div>
                    <span className="block font-bold text-brand-green mb-1">🌿 Storage Instructions</span>
                    <span className="text-brand-charcoal/70">{product.storage || "Store in an airtight container in a cool, dry place away from direct sunlight."}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-brand-green mb-1">🚚 Pan-India Shipping</span>
                    <span className="text-brand-charcoal/70">{product.deliveryNotes || "Carefully vacuum-packed and delivered in 2-4 business days."}</span>
                  </div>
                </div>

              </div>

            </div>
          </FadeIn>
        </div>

      </div>

    </div>
  );
}
