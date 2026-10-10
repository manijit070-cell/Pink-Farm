import { prisma } from "@/lib/db";
import { ProductListClient } from "./ProductListClient";
import { FadeIn } from "@/components/ui/MotionWrappers";

export const instant = false;

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { isFeatured: "desc" },
    });
  } catch (error) {
    console.error("Database connection failed", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <FadeIn direction="up">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-green mb-4">Our Products</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Thoughtfully curated essentials for your home.
          </p>
        </div>
      </FadeIn>

      <ProductListClient initialProducts={products} />
    </div>
  );
}
