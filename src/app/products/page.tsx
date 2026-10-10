import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";



export const instant = false;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
}) {
  const { category, sort, search } = await searchParams;

  let whereClause: any = { isAvailable: true };
  if (category) {
    whereClause.category = { equals: category, mode: "insensitive" };
  }
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderByClause: any = { isFeatured: "desc" };
  if (sort === "price-low") {
    orderByClause = { basePrice: "asc" };
  } else if (sort === "price-high") {
    orderByClause = { basePrice: "desc" };
  } else if (sort === "alphabetical") {
    orderByClause = { name: "asc" };
  }

  let products = [];
  try {
    products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });
  } catch (error) {
    console.error("Database connection failed", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green mb-4">Our Products</h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Thoughtfully curated essentials for your home.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-brand-cream p-4 rounded-xl">
        <div className="flex gap-4">
           <Link href="/products" className={`font-medium ${!category ? 'text-brand-green underline underline-offset-4' : 'text-brand-charcoal opacity-70 hover:text-brand-green'}`}>All</Link>
           <Link href="/products?category=makhana" className={`font-medium ${category?.toLowerCase() === 'makhana' ? 'text-brand-green underline underline-offset-4' : 'text-brand-charcoal opacity-70 hover:text-brand-green'}`}>Makhana</Link>
           <Link href="/products?category=nuts" className={`font-medium ${category?.toLowerCase() === 'nuts' ? 'text-brand-green underline underline-offset-4' : 'text-brand-charcoal opacity-70 hover:text-brand-green'}`}>Nuts</Link>
           <Link href="/products?category=pantry" className={`font-medium ${category?.toLowerCase() === 'pantry' ? 'text-brand-green underline underline-offset-4' : 'text-brand-charcoal opacity-70 hover:text-brand-green'}`}>Pantry</Link>
        </div>
        <div className="flex items-center gap-4">
          <form method="GET" action="/products" className="flex items-center">
            <input type="text" name="search" placeholder="Search..." defaultValue={search || ""} className="border border-brand-green-light/20 rounded-l-md px-3 py-1.5 focus:outline-none focus:border-brand-green bg-white text-sm" />
            <button type="submit" className="bg-brand-green text-white px-3 py-1.5 rounded-r-md text-sm">Go</button>
          </form>
          <form method="GET" action="/products" className="flex items-center gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <select name="sort" defaultValue={sort || ""} className="border border-brand-green-light/20 rounded-md px-3 py-1.5 focus:outline-none focus:border-brand-green bg-white text-sm">
              <option value="">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <button type="submit" className="bg-brand-green text-white px-3 py-1.5 rounded-md text-sm">Sort</button>
          </form>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col gap-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-pink-accent/20">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-brand-green/30">
                    Placeholder
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green group-hover:text-brand-green-light transition-colors leading-tight">{product.name}</h3>
                <p className="hidden sm:block text-sm text-brand-charcoal opacity-70 line-clamp-2 mt-1">{product.shortDescription}</p>
                <p className="font-medium mt-1 sm:mt-2 text-brand-green-light">₹{(product.basePrice / 100).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-brand-cream rounded-2xl">
          <p className="text-lg opacity-80">No products found matching your criteria.</p>
          <Button asChild className="mt-6" variant="outline">
             <Link href="/products">View All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
