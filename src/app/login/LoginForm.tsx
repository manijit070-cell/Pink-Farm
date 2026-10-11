"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCustomerStore } from "@/store/customerStore";
import { 
  User, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Settings, 
  LayoutDashboard,
  ShoppingBag
} from "lucide-react";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");
  
  // Admin form state
  const [email, setEmail] = useState("admin@pinkfarm.in");
  const [password, setPassword] = useState("admin123");
  
  // Customer form state
  const [phone, setPhone] = useState("9876543210");
  const [customerName, setCustomerName] = useState("Shivani Sharma");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const customer = useCustomerStore();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Authenticate and save customer session
    setTimeout(() => {
      customer.loginCustomer({
        phone: phone.startsWith("+91") ? phone : `+91 ${phone}`,
        name: customerName || "Pink Farm Customer",
      });
      setIsLoading(false);
      router.push("/account");
    }, 600);
  };

  const handleDirectCustomerLogin = () => {
    setIsLoading(true);
    customer.loginCustomer({
      name: "Shivani Sharma",
      phone: "+91 98765 43210",
      email: "shivani.sharma@pinkfarm.in",
    });
    router.push("/account");
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-brand-green/5 rounded-2xl border border-brand-green/10">
        <button
          onClick={() => { setActiveTab("customer"); setError(""); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "customer" 
              ? "bg-white text-brand-green shadow-sm border border-brand-green/10" 
              : "text-brand-charcoal/60 hover:text-brand-green"
          }`}
        >
          <User size={16} />
          Customer Login
        </button>
        <button
          onClick={() => { setActiveTab("admin"); setError(""); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "admin" 
              ? "bg-white text-brand-green shadow-sm border border-brand-green/10" 
              : "text-brand-charcoal/60 hover:text-brand-green"
          }`}
        >
          <Settings size={16} />
          Store Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-fade-in-up">
          <span className="text-red-500 font-bold">!</span> {error}
        </div>
      )}

      {/* CUSTOMER LOGIN PANEL */}
      {activeTab === "customer" ? (
        <div className="space-y-5 animate-fade-in-up">
          {/* Prominent Direct Access Button (No Login) */}
          <button
            type="button"
            onClick={handleDirectCustomerLogin}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-brand-green to-[#163625] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-brand-green/25 hover:brightness-105 transition-all cursor-pointer border border-emerald-400/30"
          >
            <Sparkles size={18} className="text-amber-300 shrink-0" />
            <span>⚙️ Direct Access to Customer Settings (No Login)</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-brand-green/10"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-brand-charcoal/50 uppercase tracking-wider">
              Or Sign In with Phone OTP
            </span>
            <div className="flex-grow border-t border-brand-green/10"></div>
          </div>

          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Full Name
              </label>
              <input 
                type="text" 
                required 
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 focus:outline-none focus:border-brand-green focus:bg-white text-sm font-medium transition-colors" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/50 font-medium text-sm">
                  +91
                </span>
                <input 
                  type="tel" 
                  required 
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 pl-14 focus:outline-none focus:border-brand-green focus:bg-white text-sm font-medium transition-colors font-mono" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-sm rounded-xl shadow-lg shadow-brand-green/10 cursor-pointer" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Continue to Customer Account →"}
            </Button>
          </form>

          {/* Quick links */}
          <div className="pt-2 border-t border-brand-green/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-brand-green/5 text-brand-charcoal/70 hover:text-brand-green font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Browse Store as Guest</span>
            </button>
          </div>
        </div>
      ) : (
        /* STORE ADMIN PANEL */
        <div className="space-y-5 animate-fade-in-up">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <ShieldAlert size={16} className="text-amber-700 shrink-0" />
            <span>Store Administrator Backoffice. Authorized personnel only.</span>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Admin Email
              </label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 focus:outline-none focus:border-brand-green focus:bg-white text-sm font-medium transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Password
              </label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 focus:outline-none focus:border-brand-green focus:bg-white text-sm font-medium transition-colors" 
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-sm rounded-xl shadow-lg shadow-brand-green/10 cursor-pointer" 
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
            </Button>
          </form>

          {/* Admin Direct Quick Access */}
          <div className="pt-3 border-t border-brand-green/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/settings")}
              className="w-full py-3 px-4 rounded-xl bg-brand-pink/70 hover:bg-brand-pink text-brand-green font-bold text-xs flex items-center justify-center gap-2 border border-brand-green/20 transition-all hover:shadow-xs cursor-pointer"
            >
              <Settings size={15} />
              <span>Direct Access to Store Settings (No Login)</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-brand-green/5 text-brand-charcoal/70 hover:text-brand-green font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LayoutDashboard size={15} />
              <span>Open Admin Dashboard Directly</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
