import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddToCart } from "./AddToCart";
import { ChevronRight } from "lucide-react";



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
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-brand-charcoal opacity-70 mb-8">
        <Link href="/" className="hover:text-brand-green">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-brand-green">Products</Link>
        <ChevronRight size={14} />
        <span className="text-brand-green font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Images */}
        <div className="flex-1 w-full space-y-4">
          <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-brand-pink-accent/10 border border-brand-green-light/10">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-brand-green/30">
                Main Image
              </div>
            )}
          </div>
          {/* Thumbnails could go here if additionalImages exist */}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col pt-4">
          <h1 className="font-serif text-3xl md:text-5xl text-brand-green mb-4">{product.name}</h1>
          <p className="text-lg text-brand-charcoal opacity-80 mb-8">
            {product.shortDescription}
          </p>

          <AddToCart product={product} variants={product.variants} />

          <div className="mt-12 space-y-8 border-t border-brand-green-light/20 pt-8">
            <div>
              <h3 className="font-bold text-lg text-brand-green mb-3">About this product</h3>
              <p className="opacity-90 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
            
            {product.ingredients && (
              <div>
                <h3 className="font-bold text-lg text-brand-green mb-3">Ingredients</h3>
                <p className="opacity-90 leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm opacity-90 bg-brand-cream p-4 rounded-xl">
              <div>
                <span className="block font-bold mb-1">Storage</span>
                <span>{product.storage || "Store in a cool, dry place."}</span>
              </div>
              <div>
                <span className="block font-bold mb-1">Delivery</span>
                <span>{product.deliveryNotes || "Delivered within 2-4 business days."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
