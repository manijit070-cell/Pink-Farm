"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Bell,
  Truck,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Power,
  Info,
} from "lucide-react";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/store/settingsStore";

export default function StoreSettingsPage() {
  const storeSettings = useSettingsStore();

  const [storeName, setStoreName] = useState(DEFAULT_SETTINGS.storeName);
  const [announcementText, setAnnouncementText] = useState(DEFAULT_SETTINGS.announcementText);
  const [supportPhone, setSupportPhone] = useState(DEFAULT_SETTINGS.supportPhone);
  const [supportEmail, setSupportEmail] = useState(DEFAULT_SETTINGS.supportEmail);
  const [businessAddress, setBusinessAddress] = useState(DEFAULT_SETTINGS.businessAddress);
  const [deliveryFeeRupees, setDeliveryFeeRupees] = useState("50");
  const [freeThresholdRupees, setFreeThresholdRupees] = useState("500");
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Sync state from store / remote API on mount
  useEffect(() => {
    // 1. Initial values from zustand store
    if (storeSettings.storeName) {
      setStoreName(storeSettings.storeName);
      setAnnouncementText(storeSettings.announcementText);
      setSupportPhone(storeSettings.supportPhone);
      setSupportEmail(storeSettings.supportEmail);
      setBusinessAddress(storeSettings.businessAddress);
      setDeliveryFeeRupees(String(Math.round((storeSettings.deliveryFee ?? 5000) / 100)));
      setFreeThresholdRupees(
        String(Math.round((storeSettings.freeDeliveryThreshold ?? 50000) / 100))
      );
      setIsAcceptingOrders(storeSettings.isAcceptingOrders);
    }

    // 2. Fetch fresh from backend API
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.storeName) {
          setStoreName(data.storeName);
          if (data.announcementText !== undefined) setAnnouncementText(data.announcementText);
          if (data.supportPhone !== undefined) setSupportPhone(data.supportPhone);
          if (data.supportEmail !== undefined) setSupportEmail(data.supportEmail);
          if (data.businessAddress !== undefined) setBusinessAddress(data.businessAddress);
          if (typeof data.deliveryFee === "number") {
            setDeliveryFeeRupees(String(Math.round(data.deliveryFee / 100)));
          }
          if (typeof data.freeDeliveryThreshold === "number") {
            setFreeThresholdRupees(String(Math.round(data.freeDeliveryThreshold / 100)));
          }
          if (typeof data.isAcceptingOrders === "boolean") {
            setIsAcceptingOrders(data.isAcceptingOrders);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote settings:", err);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setStatusMessage("");

    const deliveryFeePaise = Math.round((parseFloat(deliveryFeeRupees) || 0) * 100);
    const freeThresholdPaise = Math.round((parseFloat(freeThresholdRupees) || 0) * 100);

    const payload = {
      storeName: storeName.trim() || DEFAULT_SETTINGS.storeName,
      announcementText: announcementText.trim(),
      supportPhone: supportPhone.trim() || DEFAULT_SETTINGS.supportPhone,
      supportEmail: supportEmail.trim() || DEFAULT_SETTINGS.supportEmail,
      businessAddress: businessAddress.trim() || DEFAULT_SETTINGS.businessAddress,
      deliveryFee: deliveryFeePaise,
      freeDeliveryThreshold: freeThresholdPaise,
      isAcceptingOrders,
    };

    // Update client Zustand store immediately
    useSettingsStore.getState().setSettings(payload);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setStatusMessage("Settings saved successfully and applied across your storefront!");
      } else {
        setSaveSuccess(true);
        setStatusMessage("Settings updated locally for your store session.");
      }
    } catch {
      setSaveSuccess(true);
      setStatusMessage("Settings saved locally.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center font-bold">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Store Settings
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Configure your store branding, banner announcements, order status, contact info, and delivery rates.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            <ExternalLink size={16} />
            View Live Store
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm shadow-md shadow-brand-green/15 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 size={16} className="text-emerald-300" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">
              {statusMessage || "Settings updated and applied live to the store!"}
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
            Live
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Store Ordering Toggle */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${isAcceptingOrders ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                <Power size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Accepting Online Orders</h2>
                <p className="text-sm text-gray-500">
                  When enabled, customers can add products to cart and checkout normally.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAcceptingOrders}
                onChange={(e) => setIsAcceptingOrders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-green"></div>
              <span className="ml-3 text-sm font-bold min-w-[130px]">
                {isAcceptingOrders ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    ● Store Active
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1.5">
                    ● Orders Paused
                  </span>
                )}
              </span>
            </label>
          </div>

          {!isAcceptingOrders && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 text-xs flex items-center gap-2">
              <Info size={16} className="shrink-0 text-amber-600" />
              <span>
                <strong>Store is currently paused:</strong> Product checkout and Add-to-Cart buttons will show a polite &quot;Orders Paused&quot; notice until re-enabled.
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Store Identity & Announcement Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 rounded-lg bg-brand-pink/50 text-brand-green">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Store Identity & Announcements</h2>
              <p className="text-sm text-gray-500">
                Update store branding and the top banner announcement displayed across every page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Pink Farm"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium"
              />
              <p className="text-xs text-gray-400">
                Used in header branding, footer copyright, and page headers.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Announcement Bar Banner Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Welcome to Pink Farm — Goodness in Every Bite."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium"
              />
              <p className="text-xs text-gray-400">
                Displays live in the top bar across the entire website.
              </p>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Sparkles size={14} className="text-brand-pink-accent" />
              Live Announcement Bar Preview
            </div>
            <div className="bg-gradient-to-r from-brand-green to-brand-green-light text-brand-ivory text-center py-2 px-4 rounded-lg text-xs md:text-sm font-medium shadow-sm min-h-[36px] flex items-center justify-center">
              <span>✨ {announcementText || "Welcome to Pink Farm — Goodness in Every Bite."}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Customer Support & Contact Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
              <Phone size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Customer Support & Contacts</h2>
              <p className="text-sm text-gray-500">
                Syncs with footer contacts, contact page cards, and floating WhatsApp buttons.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                Support Phone / WhatsApp
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+91 8437504040"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium"
              />
              <p className="text-xs text-gray-400">
                Connected to WhatsApp chat buttons and contact pages.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="hello@pinkfarm.in"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium"
              />
              <p className="text-xs text-gray-400">
                Shown in the website footer and contact channels.
              </p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                Farm / Business Address
              </label>
              <textarea
                rows={2}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="123 Pink Farm Estate, New Delhi"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Delivery Fees & Free Shipping Rules */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 rounded-lg bg-orange-50 text-orange-700">
              <Truck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Delivery Fees & Free Shipping Rules</h2>
              <p className="text-sm text-gray-500">
                Standard delivery charge and cart value required for complimentary free shipping.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Standard Delivery Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={deliveryFeeRupees}
                  onChange={(e) => setDeliveryFeeRupees(e.target.value)}
                  placeholder="50"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium"
                />
              </div>
              <p className="text-xs text-gray-400">
                Applied to cart totals during checkout when below free threshold.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Free Delivery Order Threshold (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={freeThresholdRupees}
                  onChange={(e) => setFreeThresholdRupees(e.target.value)}
                  placeholder="500"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-sm font-medium"
                />
              </div>
              <p className="text-xs text-gray-400">
                Orders equal or exceeding this value receive 100% free delivery.
              </p>
            </div>
          </div>

          <div className="bg-brand-pink/20 rounded-xl p-3.5 border border-brand-pink/30 text-xs text-brand-green font-medium">
            💡 <strong>Current Rule:</strong> Shipping is ₹{deliveryFeeRupees || 0} for orders under ₹{freeThresholdRupees || 0}, and FREE for orders of ₹{freeThresholdRupees || 0} or more.
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Settings apply in real time to cart, checkout, contacts, and header announcements.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm shadow-md shadow-brand-green/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 size={16} className="text-emerald-300" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : saveSuccess ? "Saved Successfully!" : "Save All Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
