import { prisma } from "@/lib/db";
import { PackageOpen, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const instant = false;

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Could not query products:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Products & Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of store catalog items, stock availability, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            <ExternalLink size={15} />
            View Catalog
          </Link>
          <div className="text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
            Total Products: <span className="text-brand-green font-bold">{products.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-semibold">Product Name</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">SKU</th>
                <th className="py-4 px-6 font-semibold">Stock</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.map((p) => {
                const isLow = p.stockQuantity <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400 line-clamp-1">{p.shortDescription}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">{p.sku}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isLow ? "text-amber-600" : "text-gray-800"}`}>
                          {p.stockQuantity} units
                        </span>
                        {isLow && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.isAvailable ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {p.isAvailable ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900">
                      ₹{(p.basePrice / 100).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <PackageOpen size={36} className="mx-auto mb-2 text-gray-300" />
                    No products cataloged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
