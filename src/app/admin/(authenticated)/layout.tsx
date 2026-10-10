import Link from "next/link";
import { LogOut, LayoutDashboard, ShoppingBag, Settings, PackageOpen } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="font-serif text-2xl font-bold text-brand-green">Pink Farm Admin</Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-brand-pink/50 hover:text-brand-green transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-brand-pink/50 hover:text-brand-green transition-colors">
            <ShoppingBag size={20} />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-brand-pink/50 hover:text-brand-green transition-colors">
            <PackageOpen size={20} />
            <span className="font-medium">Products & Inventory</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-brand-pink/50 hover:text-brand-green transition-colors">
            <Settings size={20} />
            <span className="font-medium">Store Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
