"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown, ArrowRight, Sparkles, Check } from "lucide-react";
import { HoverCard, ScaleOnTap } from "@/components/ui/MotionWrappers";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  originalPrice: number | null;
  category: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

export function ProductListClient({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "makhana", label: "Signature Makhana" },
    { id: "nuts", label: "Nuts & Dry Fruits" },
    { id: "pantry", label: "Pantry & Ghee" },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      
      {/* Controls Bar */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-brand-pink-accent/30 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Pills with animated tab indicator */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-brand-cream/70 rounded-2xl">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                  isSelected ? "text-white" : "text-brand-charcoal/70 hover:text-brand-green"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="categoryActiveIndicator"
                    className="absolute inset-0 bg-brand-green rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-brand-green/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-pink-accent/40 bg-white/90 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-brand-pink-accent/40 bg-white/90 font-medium text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-green/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Product Results Grid */}
      <AnimatePresence mode="popLayout">
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <HoverCard lift={-8} className="h-full">
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex flex-col h-full bg-white rounded-3xl p-3 sm:p-4 border border-brand-pink-accent/40 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    
                    {/* Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-pink to-brand-cream border border-brand-pink-accent/20">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-brand-green/30 text-xs">
                          Product Image
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isFeatured && (
                          <span className="bg-brand-green text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                            ★ Featured
                          </span>
                        )}
                        {product.category && (
                          <span className="bg-white/90 backdrop-blur-md text-brand-green text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            {product.category}
                          </span>
                        )}
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <div className="w-full py-2 bg-brand-green/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl text-center shadow-md flex items-center justify-center gap-1.5">
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-4 px-1 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green group-hover:text-brand-green-light transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-brand-charcoal/65 line-clamp-2 mt-1 mb-3">
                          {product.shortDescription}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between pt-2 border-t border-brand-pink/60">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-brand-green font-extrabold text-base sm:text-lg">
                            ₹{(product.basePrice / 100).toFixed(0)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs line-through text-brand-charcoal/40">
                              ₹{(product.originalPrice / 100).toFixed(0)}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-pink text-brand-green border border-brand-pink-accent/50">
                          PREMIUM
                        </span>
                      </div>
                    </div>

                  </Link>
                </HoverCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-brand-pink-accent/40 shadow-sm max-w-lg mx-auto"
          >
            <Sparkles className="w-10 h-10 text-brand-green/40 mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-brand-green font-bold mb-2">No matching items found</h3>
            <p className="text-sm text-brand-charcoal/70 mb-6">
              Try adjusting your search terms or filter selection.
            </p>
            <button
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-semibold hover:bg-brand-green-light transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
