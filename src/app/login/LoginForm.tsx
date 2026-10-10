"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");
  
  const [email, setEmail] = useState("admin@pinkfarm.in");
  const [password, setPassword] = useState("admin123");
  const [phone, setPhone] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate customer login for now
    setTimeout(() => {
      setIsLoading(false);
      setError("Customer accounts are currently being rolled out. Please checkout as a guest for now!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-brand-green/5 rounded-xl border border-brand-green/10">
        <button
          onClick={() => { setActiveTab("customer"); setError(""); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "customer" ? "bg-white text-brand-green shadow-sm" : "text-brand-charcoal/60 hover:text-brand-green"}`}
        >
          Customer
        </button>
        <button
          onClick={() => { setActiveTab("admin"); setError(""); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "admin" ? "bg-white text-brand-green shadow-sm" : "text-brand-charcoal/60 hover:text-brand-green"}`}
        >
          Store Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
          <span className="text-red-500 font-bold">!</span> {error}
        </div>
      )}

      {activeTab === "customer" ? (
        <form onSubmit={handleCustomerSubmit} className="space-y-5 animate-fade-in-up">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-charcoal">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/50 font-medium">+91</span>
              <input 
                type="tel" 
                required 
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 pl-12 focus:outline-none focus:border-brand-green focus:bg-white transition-colors" 
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full h-12 text-base rounded-xl shadow-lg shadow-brand-green/10" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Continue with Phone"}
          </Button>
          <p className="text-center text-xs text-brand-charcoal/50 mt-4">
            We will send you a one-time password to verify your account securely.
          </p>
        </form>
      ) : (
        <form onSubmit={handleAdminSubmit} className="space-y-5 animate-fade-in-up">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-charcoal">Admin Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 focus:outline-none focus:border-brand-green focus:bg-white transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-brand-charcoal">Password</label>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brand-green-light/20 bg-brand-cream/30 rounded-xl p-3.5 focus:outline-none focus:border-brand-green focus:bg-white transition-colors" 
            />
          </div>
          <Button type="submit" size="lg" className="w-full h-12 text-base rounded-xl shadow-lg shadow-brand-green/10" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Access Dashboard"}
          </Button>

          <div className="pt-3 border-t border-brand-green/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/settings")}
              className="w-full py-3 px-4 rounded-xl bg-brand-pink/70 hover:bg-brand-pink text-brand-green font-bold text-sm flex items-center justify-center gap-2 border border-brand-green/20 transition-all hover:shadow-md cursor-pointer"
            >
              ⚙️ Direct Access to Store Settings (No Login)
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-brand-green/5 text-brand-charcoal/70 hover:text-brand-green font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              ⚡ Open Admin Dashboard Directly
            </button>
          </div>
        </form>
      )}

      {activeTab === "customer" && (
        <div className="pt-2 border-t border-brand-green/10">
          <button
            type="button"
            onClick={() => router.push("/admin/settings")}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-pink/40 hover:bg-brand-pink/70 text-brand-green font-semibold text-xs flex items-center justify-center gap-2 border border-brand-green/15 transition-all cursor-pointer"
          >
            ⚙️ Skip to Store Settings
          </button>
        </div>
      )}
    </div>
  );
}
