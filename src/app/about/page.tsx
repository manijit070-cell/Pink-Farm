import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, Heart, Award, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard, ScaleOnTap } from "@/components/ui/MotionWrappers";

export const metadata = {
  title: "About Us — Pink Farm",
  description: "Meet Anjali, the dietitian-turned-food-entrepreneur behind Pink Farm. Learn our story, our mission, and our uncompromising promise on quality.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-0 pb-16 overflow-x-hidden">

      {/* HERO */}
      <section className="relative w-full bg-brand-green text-brand-ivory pt-32 pb-24 md:pt-36 md:pb-28 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #88E2B0 0%, transparent 60%), radial-gradient(circle at 80% 20%, #F7E1D7 0%, transparent 50%)' }}
        />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-3xl">
          <FadeIn direction="down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-champagne text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Story Behind Pink Farm</span>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.15}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6">
              Not Just a Brand.<br />
              <span className="italic font-light text-brand-pink">It&apos;s a Family Dream.</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <p className="text-lg md:text-xl text-brand-ivory/80 leading-relaxed max-w-2xl mx-auto">
              Born from a registered dietitian&apos;s passion for honest, unadulterated food — Pink Farm is where science meets care, and quality is never negotiated.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section className="bg-brand-ivory py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-16 max-w-6xl">
          
          {/* Visual Avatar */}
          <FadeIn direction="right" className="flex-shrink-0 relative">
            <HoverCard lift={-6}>
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-brand-pink via-[#fadbe2] to-brand-cream border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                <span className="text-8xl sm:text-9xl select-none">👩‍⚕️</span>
              </div>
            </HoverCard>
            <div className="absolute -bottom-3 right-2 bg-brand-green text-white px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-xl flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-pink" />
              <span>Founder &amp; Dietitian</span>
            </div>
          </FadeIn>

          {/* Text Content */}
          <FadeIn direction="left" delay={0.2} className="flex-1 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green-light">The Founder&apos;s Word</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-brand-green leading-tight font-extrabold">
              Meet <span className="italic text-brand-green-light font-normal">Anjali.</span>
            </h2>
            <p className="text-brand-charcoal/80 text-base sm:text-lg leading-relaxed">
              Anjali started her journey as a clinical dietitian — observing how modern packaged snacks were overloaded with artificial flavor enhancers, excessive sodium, and harmful refined oils. She knew that real food doesn&apos;t need chemical tricks; it needs the right soil, minimal roasting, and honest hands.
            </p>
            <p className="text-brand-charcoal/80 text-base sm:text-lg leading-relaxed">
              That mission became <strong className="text-brand-green font-bold">Pink Farm</strong>. Sourced straight from local farmers across Bihar and packed under clean hygienic standards, each batch is crafted to bring wellness into everyday snacking.
            </p>
            
            <blockquote className="border-l-4 border-brand-green pl-6 italic text-brand-green font-serif text-xl sm:text-2xl py-1">
              &ldquo;Pure in nature, wholesome for you. Simple food makes a stronger family.&rdquo;
            </blockquote>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {["Dietetics", "Clean Nutrition", "No Artificial Colors", "Zero Palm Oil", "Pan-India Dispatch"].map((tag) => (
                <span key={tag} className="px-3.5 py-1.5 rounded-full bg-brand-pink text-brand-green text-xs font-semibold border border-brand-pink-accent/40 shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>

        </div>
      </section>

      {/* VALUES & PILLARS */}
      <section className="bg-brand-cream/70 py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          
          <FadeIn>
            <div className="text-center mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-brand-green font-bold">Our Philosophy</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green font-bold">
                The 5 Pink Farm <span className="italic text-brand-green-light font-normal">Pillars</span>
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                emoji: "🏆",
                title: "Zero Compromise on Quality",
                desc: "We rigorously inspect every batch. Imperfect, undersized, or burnt puffs are immediately discarded."
              },
              {
                emoji: "🌾",
                title: "Lotus Ponds of Bihar",
                desc: "Our signature Phool Makhana is harvested from Bihar's wetlands — gluten-free, plant-based, and rich in calcium."
              },
              {
                emoji: "📦",
                title: "Pan-India Fast Dispatch",
                desc: "From metro cities to remote pin codes, our fresh packages reach your doorstep safely in 2-4 business days."
              },
              {
                emoji: "🤍",
                title: "Trust First Relationship",
                desc: "Pink Farm is built on personal connections. We love speaking to our customers and hearing your feedback."
              },
              {
                emoji: "🎁",
                title: "A Surprise in Every Order",
                desc: "Every single parcel comes with a secret complimentary gift — because you deserve that extra touch of warmth."
              },
              {
                emoji: "🍃",
                title: "Authentic & Pure",
                desc: "No synthetic chemical preservatives, no cheap filler ingredients. Pure food, true to its roots."
              }
            ].map((pillar, idx) => (
              <StaggerItem key={idx}>
                <HoverCard lift={-6} className="h-full">
                  <div className="h-full bg-white p-7 rounded-3xl shadow-sm border border-brand-pink-accent/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="w-13 h-13 rounded-2xl bg-brand-pink flex items-center justify-center text-3xl mb-5 shadow-inner">
                        {pillar.emoji}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-brand-green mb-2.5">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-charcoal/75 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-pink/50 flex items-center gap-1.5 text-xs font-semibold text-brand-green">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Standard</span>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* FINAL INVITATION */}
      <section className="container mx-auto px-4 lg:px-8 max-w-4xl pt-16 text-center">
        <FadeIn>
          <div className="bg-gradient-to-br from-brand-pink via-white to-brand-cream border border-brand-pink-accent/50 p-10 sm:p-14 rounded-[2.5rem] shadow-md space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-green font-bold">
              Ready to Experience the Crunch?
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoal/70 max-w-lg mx-auto">
              Join thousands of families enjoying dietitian-approved Makhana and pure pantry favourites.
            </p>
            <div className="pt-2">
              <ScaleOnTap>
                <Button asChild size="lg" className="rounded-full px-9 py-6 text-base font-bold bg-brand-green text-white hover:bg-brand-green-light shadow-lg">
                  <Link href="/products" className="flex items-center gap-2">
                    <span>Shop the Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </ScaleOnTap>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
