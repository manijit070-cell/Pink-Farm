"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, User, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      
      {/* Premium Announcement Bar with Shimmer */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green text-brand-ivory text-center py-2 text-xs md:text-sm font-medium tracking-wide flex justify-center items-center shadow-inner">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-pink-accent animate-pulse" />
          <span>✨ Welcome to Pink Farm — Premium Goodness in Every Bite. Pan-India Delivery.</span>
          <Sparkles className="w-3.5 h-3.5 text-brand-pink-accent animate-pulse" />
        </motion.div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full backdrop-blur-xl border-b transition-all duration-300 ${
          scrolled
            ? "bg-brand-ivory/95 border-brand-pink-accent/40 shadow-[0_10px_30px_rgba(26,60,52,0.06)] h-16 md:h-18"
            : "bg-brand-ivory/85 border-brand-pink-accent/30 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-20"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-brand-green hover:bg-brand-pink-accent/20 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 md:gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.08 }}
              transition={{ duration: 0.4 }}
            >
              <Image 
                src="/lotus-logo-gold.png" 
                alt="Pink Farm Logo" 
                width={180} 
                height={180} 
                quality={100}
                priority
                className={`object-contain -translate-y-[5%] drop-shadow-sm -mr-1 md:-mr-2 transition-all duration-300 ${
                  scrolled ? "w-[65px] h-[65px] md:w-[75px] md:h-[75px]" : "w-[80px] h-[80px] md:w-[95px] md:h-[95px]"
                }`}
              />
            </motion.div>
            <span className="font-serif text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-green tracking-tight group-hover:text-brand-green-light transition-colors">
              Pink Farm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-brand-charcoal/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  className={`relative text-[15px] py-1.5 transition-colors duration-200 ${
                    isActive ? "text-brand-green font-semibold" : "hover:text-brand-green"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive ? (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-brand-green rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 md:gap-6 text-brand-green">
            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.12 }} 
                whileTap={{ scale: 0.92 }}
                aria-label="Search" 
                className="p-1 hover:text-brand-green-light transition-colors"
              >
                <Search size={21} strokeWidth={2.2} />
              </motion.button>
            </Link>
            
            <Link href="/login" aria-label="Account" className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className="p-1 hover:text-brand-green-light transition-colors"
              >
                <User size={21} strokeWidth={2.2} />
              </motion.div>
            </Link>
            
            {/* Cart with animated badge */}
            <Link href="/cart" aria-label="Cart">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="relative flex items-center justify-center bg-brand-pink/60 hover:bg-brand-pink border border-brand-pink-accent/40 p-2.5 rounded-full transition-colors shadow-sm"
              >
                <ShoppingCart size={21} strokeWidth={2.2} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-1.5 -right-1.5 bg-brand-green text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md ring-2 ring-brand-ivory"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-brand-ivory/95 backdrop-blur-2xl border-b border-brand-pink-accent/40 shadow-xl"
          >
            <motion.nav 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-4 p-6 text-lg font-medium text-brand-charcoal"
            >
              {[
                { name: "Home", path: "/" },
                { name: "Shop All Products", path: "/products" },
                { name: "About Our Story", path: "/about" },
                { name: "Contact & WhatsApp", path: "/contact" },
                { name: "Sign In / Admin", path: "/login" }
              ].map((link) => (
                <motion.div
                  key={link.name}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -16 }
                  }}
                >
                  <Link 
                    href={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 border-b border-brand-pink/50 hover:text-brand-green transition-colors font-medium text-base"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-brand-green/60 font-serif">→</span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
