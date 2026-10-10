"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-brand-ivory/85 border-b border-brand-pink-accent/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
      
      {/* Premium Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-green to-brand-green-light text-brand-ivory text-center py-2 text-xs md:text-sm font-medium tracking-wide flex justify-center items-center overflow-hidden">
        <span className="animate-pulse">✨ Welcome to Pink Farm — Premium Goodness in Every Bite.</span>
      </div>

      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-brand-green hover:bg-brand-pink-accent/20 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 md:gap-2 group">
          <Image 
            src="/lotus-logo-gold.png" 
            alt="Pink Farm Logo" 
            width={180} 
            height={180} 
            quality={100}
            priority
            className="w-[80px] h-[80px] md:w-[95px] md:h-[95px] object-contain -translate-y-[5%] group-hover:scale-110 transition-transform duration-300 drop-shadow-sm -mr-1 md:-mr-2"
          />
          <span className="font-serif text-3xl md:text-4xl font-extrabold text-brand-green tracking-tight group-hover:scale-105 transition-transform duration-300">Pink Farm</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-medium text-brand-charcoal/80">
          {[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/products" },
            { name: "About Us", path: "/about" },
            { name: "Contact", path: "/contact" }
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.path} 
              className="relative group text-[15px] hover:text-brand-green transition-colors duration-300 py-2"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5 md:gap-6 text-brand-green">
          <button aria-label="Search" className="hover:text-brand-green-light hover:scale-110 transition-all duration-200">
            <Search size={22} strokeWidth={2.2} />
          </button>
          
          <Link href="/login" aria-label="Account" className="hidden md:block hover:text-brand-green-light hover:scale-110 transition-all duration-200">
            <User size={22} strokeWidth={2.2} />
          </Link>
          
          <Link href="/cart" aria-label="Cart" className="relative group flex items-center justify-center bg-brand-pink/40 p-2.5 rounded-full hover:bg-brand-pink transition-colors duration-300">
            <ShoppingCart size={22} strokeWidth={2.2} className="group-hover:scale-110 transition-transform duration-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-fade-in ring-2 ring-brand-ivory">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-ivory/95 backdrop-blur-xl border-b border-brand-pink-accent absolute w-full shadow-lg animate-fade-in-up">
          <nav className="flex flex-col gap-6 p-6 text-lg font-medium text-brand-charcoal">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/products" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Sign In / Register", path: "/login" }
            ].map((link) => (
              <Link 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-brand-pink/50 pb-2 hover:text-brand-green transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
