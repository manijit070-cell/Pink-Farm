import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  Package, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  Award, 
  Leaf, 
  Star 
} from "lucide-react";
import { 
  FadeIn, 
  StaggerContainer, 
  StaggerItem, 
  HoverCard, 
  FloatingElement, 
  ScaleOnTap 
} from "@/components/ui/MotionWrappers";

export const instant = false;

export default async function Home() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      where: { isAvailable: true },
      take: 7,
      orderBy: { isFeatured: 'desc' },
      include: { variants: true }
    });
  } catch (error) {
    console.error("Database connection failed for products", error);
  }

  const makhanaProduct = products.find(p => p.category.toLowerCase() === 'makhana') || products[0];

  return (
    <div className="flex flex-col gap-10 md:gap-16 pb-24 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION - ULTRA LUXURY WITH FRAMER MOTION DYNAMICS */}
      {/* ========================================================= */}
      <section className="relative w-full overflow-hidden bg-brand-ivory pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Dynamic Abstract CSS Mesh Background */}
        <div 
          className="absolute inset-0 z-0 animate-mesh opacity-80"
          style={{
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(247, 225, 215, 0.95) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(165, 180, 163, 0.65) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(255, 245, 230, 0.85) 0px, transparent 60%), radial-gradient(at 0% 100%, rgba(240, 210, 220, 0.75) 0px, transparent 60%)',
            backgroundSize: '200% 200%'
          }}
        />
        
        {/* Fine Grain Texture */}
        <div 
          className="absolute inset-0 opacity-[0.22] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />

        <div className="container relative z-10 mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Hero Typography & CTA */}
          <div className="flex-1 space-y-6 md:space-y-8 max-w-2xl text-center lg:text-left">
            
            {/* Trust Pill Badge */}
            <FadeIn direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-brand-pink-accent/50 shadow-sm text-brand-green text-xs md:text-sm font-semibold tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                <Sparkles className="w-4 h-4 text-brand-green-light" />
                <span>100% Direct From Pristine Lotus Ponds of Bihar</span>
                <span className="hidden sm:inline text-xs text-brand-charcoal/50">✦ PAN-India Fast Dispatch</span>
              </div>
            </FadeIn>
            
            {/* Headline */}
            <FadeIn direction="up" delay={0.2} duration={0.8}>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-brand-green font-extrabold">
                Goodness That <br />
                <span className="italic font-light bg-gradient-to-r from-brand-green via-brand-green-light to-[#4CA371] text-transparent bg-clip-text">
                  Feels Like Home.
                </span>
              </h1>
            </FadeIn>
            
            {/* Subtitle */}
            <FadeIn direction="up" delay={0.35} duration={0.7}>
              <p className="text-lg md:text-xl text-brand-charcoal/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Thoughtfully curated everyday pantry favourites, with jumbo roasted Makhana at our heart. Founded by a dietitian with zero compromises on quality.
              </p>
            </FadeIn>
            
            {/* CTA Buttons */}
            <FadeIn direction="up" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <ScaleOnTap>
                  <Button asChild size="lg" className="w-full sm:w-auto text-base rounded-full px-8 py-6 shadow-lg shadow-brand-green/20 hover:shadow-xl hover:shadow-brand-green/30 text-white bg-brand-green hover:bg-brand-green-light border-0">
                    <Link href="/products" className="flex items-center gap-2 font-semibold">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </ScaleOnTap>
                
                <ScaleOnTap>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base border-brand-green/30 bg-white/60 backdrop-blur-md rounded-full px-8 py-6 hover:bg-brand-green hover:text-white transition-all">
                    <Link href={makhanaProduct ? `/products/${makhanaProduct.slug}` : "/products"} className="font-semibold">
                      Discover Signature Makhana
                    </Link>
                  </Button>
                </ScaleOnTap>
              </div>
            </FadeIn>

            {/* Quick Metrics */}
            <FadeIn direction="up" delay={0.65}>
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-brand-charcoal/70">
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span><strong>4.9 / 5</strong> Verified Rating</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-brand-green/30" />
                <div className="flex items-center gap-1.5 font-medium">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Zero Preservatives</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-brand-green/30" />
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-brand-green" />
                  <span>Dietitian Crafted</span>
                </div>
              </div>
            </FadeIn>

          </div>

          {/* Right Column: Floating Interactive Visual Composition */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative h-[420px] sm:h-[480px] lg:h-[520px] flex justify-center items-center">
            
            {/* Center Main Floating Hero Image */}
            <FloatingElement amplitude={14} duration={6} delay={0} className="absolute z-20">
              <HoverCard lift={-8}>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-8 border-white/80 shadow-2xl bg-gradient-to-tr from-brand-pink to-brand-cream">
                  <Image 
                    src="/images/makhana_sig.jpg" 
                    alt="Signature Makhana" 
                    fill 
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-brand-green/90 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                    ✦ Signature Phool Makhana
                  </div>
                </div>
              </HoverCard>
            </FloatingElement>

            {/* Top Right Floating Satellite */}
            <FloatingElement amplitude={18} duration={7} delay={1.2} className="absolute top-2 right-2 sm:right-6 z-10">
              <HoverCard lift={-6}>
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/90 shadow-xl bg-white">
                  <Image 
                    src="/images/ghee.jpg" 
                    alt="A2 Bilona Ghee" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] text-white font-bold tracking-wider uppercase">Pure Bilona Ghee</span>
                  </div>
                </div>
              </HoverCard>
            </FloatingElement>

            {/* Bottom Left Floating Satellite */}
            <FloatingElement amplitude={16} duration={5.5} delay={0.6} className="absolute bottom-2 left-2 sm:left-6 z-30">
              <HoverCard lift={-6}>
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white/90 shadow-2xl bg-white">
                  <Image 
                    src="/images/almonds.jpg" 
                    alt="Premium Almonds" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] text-white font-bold tracking-wider uppercase">Crisp California Almonds</span>
                  </div>
                </div>
              </HoverCard>
            </FloatingElement>

            {/* Floating Organic Accent Badges */}
            <FloatingElement amplitude={10} duration={4.5} delay={1.8} className="absolute top-12 left-4 z-40 hidden sm:block">
              <div className="px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-brand-pink-accent/40 text-brand-green text-xs font-bold flex items-center gap-1.5">
                <span className="text-base">🌱</span>
                <span>Hand-Sorted</span>
              </div>
            </FloatingElement>

            <FloatingElement amplitude={12} duration={5} delay={2.2} className="absolute bottom-16 right-4 z-40 hidden sm:block">
              <div className="px-3.5 py-2 rounded-2xl bg-brand-green text-brand-ivory shadow-lg text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>GI Tagged Bihar</span>
              </div>
            </FloatingElement>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INFINITE MARQUEE TICKER */}
      {/* ========================================================= */}
      <div className="w-full bg-brand-green text-brand-ivory py-3.5 overflow-hidden flex whitespace-nowrap border-y border-brand-green-light/40 shadow-sm">
        <div className="animate-marquee inline-block font-semibold tracking-widest text-xs sm:text-sm uppercase text-brand-champagne/90">
          ✦ 100% NATURAL & HYGIENIC ✦ PREMIUM DARBHANGA MAKHANA ✦ PAN-INDIA EXPRESS DISPATCH ✦ NO ARTIFICIAL PRESERVATIVES ✦ DIETITIAN FORMULATED ✦ GOOGLE 4.9 RATING ✦ FREE SURPRISE GIFT IN EVERY ORDER ✦ 100% NATURAL & HYGIENIC ✦ PREMIUM DARBHANGA MAKHANA ✦ PAN-INDIA EXPRESS DISPATCH ✦ NO ARTIFICIAL PRESERVATIVES ✦ DIETITIAN FORMULATED ✦ GOOGLE 4.9 RATING ✦ FREE SURPRISE GIFT IN EVERY ORDER ✦
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TRUST HIGHLIGHTS */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6">
            {[
              { icon: Package, title: "Carefully Packed", desc: "Airtight vacuum sealing for peak freshness" },
              { icon: ShieldCheck, title: "Lab & Dietitian Tested", desc: "Rigorous quality rejection rate" },
              { icon: Truck, title: "Pan-India Express", desc: "Dispatched within 24 hours of order" },
              { icon: Lock, title: "Instant UPI Checkout", desc: "100% secure, zero transaction delay" }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <HoverCard key={i} lift={-4} className="h-full">
                  <div className="h-full flex flex-col items-center text-center p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-brand-pink-accent/30 shadow-sm transition-colors hover:border-brand-green/30">
                    <div className="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center text-brand-green mb-3 shadow-inner">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="font-serif font-bold text-brand-green text-sm sm:text-base">{feature.title}</span>
                    <span className="text-xs text-brand-charcoal/70 mt-1 line-clamp-2">{feature.desc}</span>
                  </div>
                </HoverCard>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* ========================================================= */}
      {/* 4. SIGNATURE 7 PRODUCTS COLLECTION */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 lg:px-8 py-6">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-16 space-y-3">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-brand-green-light font-bold">Curated Excellence</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green uppercase tracking-wide">
              Our Signature <span className="italic text-brand-green-light lowercase font-light text-4xl sm:text-5xl md:text-6xl align-baseline">collection</span>
            </h2>
            <p className="text-brand-charcoal/70 tracking-wide text-sm sm:text-base max-w-lg mx-auto">
              Exactly seven pantry essentials, perfected for your healthy home.
            </p>
          </div>
        </FadeIn>

        {products.length > 0 ? (
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.slice(0, 7).map((product, index) => (
              <StaggerItem key={product.id}>
                <HoverCard lift={-8} className="h-full">
                  <Link href={`/products/${product.slug}`} className="group flex flex-col h-full bg-white rounded-3xl p-3 sm:p-4 border border-brand-pink-accent/40 shadow-sm hover:shadow-xl transition-all duration-300">
                    
                    {/* Product Image Box */}
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
                        <div className="absolute inset-0 flex items-center justify-center text-brand-green/30">
                          Placeholder
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {index === 0 && (
                          <span className="bg-brand-green text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                            Signature
                          </span>
                        )}
                        {product.category && (
                          <span className="bg-white/90 backdrop-blur-md text-brand-green text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            {product.category}
                          </span>
                        )}
                      </div>

                      {/* Quick View Hover Bar */}
                      <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <div className="w-full py-2 bg-brand-green/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl text-center shadow-md flex items-center justify-center gap-1.5">
                          <span>View Product</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="pt-4 px-1 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green group-hover:text-brand-green-light transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-brand-charcoal/65 line-clamp-1 mt-1 mb-3">
                          {product.shortDescription}
                        </p>
                      </div>
                      
                      {/* Dual-Pill Pricing Bar */}
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
                          100% PURE
                        </span>
                      </div>
                    </div>

                  </Link>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-16 text-brand-charcoal/70 bg-brand-pink/40 rounded-3xl border border-brand-pink-accent/40">
            <p className="font-medium text-lg">Products are being loaded from the database...</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <ScaleOnTap>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-brand-green/30 hover:bg-brand-green hover:text-white transition-all">
              <Link href="/products" className="flex items-center gap-2">
                <span>View All 7 Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </ScaleOnTap>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FEATURED MAKHANA SPOTLIGHT (HERO CARD) */}
      {/* ========================================================= */}
      {makhanaProduct && (
        <section className="container mx-auto px-4 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-pink via-[#fae8ec] to-brand-cream rounded-[2.5rem] p-8 md:p-14 lg:p-16 border border-brand-pink-accent/40 shadow-lg">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-pink-accent/30 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                
                {/* Visual */}
                <div className="flex-1 w-full max-w-md lg:max-w-none">
                  <HoverCard lift={-6}>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                      {makhanaProduct.imageUrl ? (
                        <Image
                          src={makhanaProduct.imageUrl}
                          alt={makhanaProduct.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-brand-cream flex items-center justify-center font-serif text-brand-green/40">
                          Makhana Image
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        ★ Best Seller
                      </div>
                    </div>
                  </HoverCard>
                </div>

                {/* Text and Actions */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>The Star of Pink Farm</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green font-extrabold leading-tight">
                    Meet Your New <br className="hidden sm:inline" />
                    <span className="italic font-light">Favourite Guilt-Free Snack.</span>
                  </h2>

                  <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed">
                    {makhanaProduct.shortDescription || "Crispy, light, and perfectly roasted without excess fat. Our signature Makhana is sourced directly from Darbhanga, Bihar and sorted so only the biggest, crunchiest puffs reach you."}
                  </p>

                  {/* Bullet features */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-medium text-brand-charcoal/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      <span>Rich in Plant Protein &amp; Calcium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      <span>Zero Preservatives or Chemicals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      <span>Naturally Gluten-Free &amp; Vegan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      <span>Low Glycemic Index (Diabetic Friendly)</span>
                    </div>
                  </div>

                  {/* Pricing and Button */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-brand-green">
                        ₹{(makhanaProduct.basePrice / 100).toFixed(0)}
                      </span>
                      {makhanaProduct.originalPrice && (
                        <span className="text-lg line-through text-brand-charcoal/40">
                          ₹{(makhanaProduct.originalPrice / 100).toFixed(0)}
                        </span>
                      )}
                    </div>

                    <ScaleOnTap>
                      <Button asChild size="lg" className="rounded-full px-8 py-6 shadow-md hover:shadow-lg text-white bg-brand-green hover:bg-brand-green-light font-semibold">
                        <Link href={`/products/${makhanaProduct.slug}`} className="flex items-center gap-2">
                          <span>Order Signature Makhana</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </ScaleOnTap>
                  </div>

                </div>

              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* ========================================================= */}
      {/* 6. WHY PINK FARM? (3 ULTRA CARDS) */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 lg:px-8 py-10 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-brand-green font-bold">Uncompromising Standard</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green uppercase tracking-wide">
              Why Choose <span className="italic text-brand-green-light lowercase font-light text-4xl sm:text-5xl md:text-6xl align-baseline">pink farm?</span>
            </h2>
            <p className="text-brand-charcoal/70 text-sm sm:text-base max-w-xl mx-auto">
              We started Pink Farm because our own families deserved better food. Here is how we guarantee it.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              emoji: "🌱",
              badge: "Farm Clean",
              title: "100% Wholesome",
              desc: "Absolutely zero artificial preservatives, MSG, synthetic colors, or hidden palm oils. Wholesome ingredients as nature intended."
            },
            {
              emoji: "🌾",
              badge: "Origin Traceable",
              title: "Sourced from Bihar",
              desc: "Our signature Makhana is handpicked directly from the pristine lotus ponds of Darbhanga, Bihar — the global epicenter of authentic GI-status foxnuts."
            },
            {
              emoji: "✨",
              badge: "Hand Inspected",
              title: "Dietitian Standard",
              desc: "Every single lot is meticulously sorted. We reject imperfect puffs so you only receive extra-large, crunchy bites that satisfy."
            }
          ].map((item, index) => (
            <StaggerItem key={index}>
              <HoverCard lift={-8} className="h-full">
                <div className="h-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-brand-pink-accent/30 hover:border-brand-green/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-brand-pink rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                        {item.emoji}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-cream text-brand-green border border-brand-green-light/20">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-brand-green mb-3 font-bold">
                      {item.title}
                    </h3>
                    <p className="text-brand-charcoal/75 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-brand-pink/50 flex items-center gap-2 text-xs font-bold text-brand-green">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pink Farm Guaranteed</span>
                  </div>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ========================================================= */}
      {/* 7. YOUTUBE RECIPES SECTION */}
      {/* ========================================================= */}
      <section className="relative w-full overflow-hidden bg-[#0d1a14] text-brand-ivory py-20 md:py-28 my-4">
        {/* Glowing background auras */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(255,0,0,0.12) 0%, transparent 65%), radial-gradient(ellipse at 20% 50%, rgba(136,226,176,0.08) 0%, transparent 60%)' }}
        />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-5xl">
          
          {/* Left Icon with Pulse */}
          <FadeIn direction="right">
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <HoverCard lift={-6}>
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-[#FF0000] to-[#cc0000] flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.4)] transition-all">
                  <svg viewBox="0 0 24 24" fill="white" className="w-14 h-14 md:w-16 md:h-16">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </HoverCard>
              <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">YouTube Channel</span>
            </div>
          </FadeIn>

          {/* Right Text + CTA */}
          <FadeIn direction="left" className="flex-1 space-y-5 text-center md:text-left">
            <p className="text-[#FF6B6B] text-xs sm:text-sm font-bold tracking-widest uppercase">Wholesome Recipes &amp; Stories</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Watch Anjali&apos;s Kitchen<br />
              <span className="italic font-light text-brand-pink">Live on YouTube.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg">
              Explore easy roasted Makhana snack seasonings, traditional Bilona ghee recipes, and healthy everyday meal ideas made with love.
            </p>
            
            <div className="pt-2">
              <ScaleOnTap>
                <a
                  href="https://www.youtube.com/@pinkfarm.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF0000] text-white font-bold text-base shadow-[0_0_30px_rgba(255,0,0,0.35)] hover:shadow-[0_0_50px_rgba(255,0,0,0.55)] transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Subscribe on YouTube</span>
                </a>
              </ScaleOnTap>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. SIMPLE 3-STEP PROCESS */}
      {/* ========================================================= */}
      <section className="bg-brand-green text-brand-ivory py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn>
            <div className="text-center mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-brand-champagne font-bold">Seamless Experience</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-champagne">Simple. Secure. Satisfying.</h2>
            </div>
          </FadeIn>
          
          <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
            {[
              { num: "1", title: "Choose Your Favourites", desc: "Select from our 7 pure pantry essentials or our signature Bihar Makhana." },
              { num: "2", title: "Instant UPI Checkout", desc: "Pay in seconds using Google Pay, PhonePe, Paytm, or BHIM. Zero hassle." },
              { num: "3", title: "Delivered to Your Door", desc: "Carefully packaged with a secret free gift, shipped PAN-India in 24 hours." }
            ].map((step, i) => (
              <StaggerItem key={i}>
                <HoverCard lift={-6}>
                  <div className="flex flex-col items-center text-center gap-5 p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-brand-pink text-brand-green flex items-center justify-center text-2xl font-black shadow-lg">
                      {step.num}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white">{step.title}</h3>
                    <p className="opacity-80 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FAQ PREVIEW */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 max-w-4xl py-6">
        <FadeIn>
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-green-light font-bold">Got Questions?</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border border-brand-pink-accent/40 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-base sm:text-lg text-brand-green mb-2">How do I pay for my order?</h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                We accept instant payments through UPI (Google Pay, PhonePe, Paytm, CRED, BHIM). It is completely secure, familiar, and requires zero OTP typing delays.
              </p>
            </div>

            <div className="bg-white border border-brand-pink-accent/40 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-base sm:text-lg text-brand-green mb-2">Where does your Makhana come from?</h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                Our Makhana is harvested directly from the natural wetland lotus ponds of Darbhanga and Madhubani, Bihar — home to the world&apos;s purest GI-tagged foxnuts.
              </p>
            </div>

            <div className="bg-white border border-brand-pink-accent/40 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-base sm:text-lg text-brand-green mb-2">How fast is delivery?</h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                All orders are dispatched within 24 hours. Delivery takes 2-4 business days across India depending on your location.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="link" asChild className="text-brand-green font-semibold">
              <Link href="/contact">Have another question? Chat with us →</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* ========================================================= */}
      {/* 10. FINAL CTA BANNER */}
      {/* ========================================================= */}
      <section className="container mx-auto px-4 max-w-5xl">
        <FadeIn>
          <div className="bg-gradient-to-r from-brand-cream via-brand-pink to-brand-cream border border-brand-pink-accent/60 rounded-[3rem] p-10 md:p-16 text-center shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green-light">From Our Family to Yours</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green font-bold">
                A Little Wholesome Goodness Goes a Long Way.
              </h2>
              <p className="text-sm sm:text-base text-brand-charcoal/80">
                Taste the crunch of authentic Bihar Makhana and pure pantry essentials today.
              </p>
              
              <div className="pt-2">
                <ScaleOnTap>
                  <Button asChild size="lg" className="rounded-full px-10 py-6 text-base font-bold shadow-lg text-white bg-brand-green hover:bg-brand-green-light">
                    <Link href="/products" className="flex items-center gap-2">
                      <span>Shop Pink Farm Collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </ScaleOnTap>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
