import {
  ClipboardCheck,
  LayoutDashboard,
  Package,
  PlusCircle,
  UserCircle,
  Wallet,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/src/components/layout/DashboardShell";

const sellerNav: DashboardNavItem[] = [
  { label: "Overview", to: "/seller", icon: LayoutDashboard, end: true },
  { label: "My Products", to: "/seller/products", icon: Package, end: true },
  { label: "Add Product", to: "/seller/products/new", icon: PlusCircle },
  { label: "Incoming Orders", to: "/seller/orders", icon: ClipboardCheck },
  { label: "My Earnings", to: "/seller/earnings", icon: Wallet },
  { label: "Studio Profile", to: "/seller/profile", icon: UserCircle },
];

export function SellerLayout() {
  return (
    <DashboardShell
      roleLabel="Woman Entrepreneur Studio"
      navItems={sellerNav}
      homePath="/seller"
    />
  );
}
