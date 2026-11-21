import {
  ClipboardList,
  Home,
  ShoppingBag,
  Store,
  UserCircle,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/src/components/layout/DashboardShell";

const customerNav: DashboardNavItem[] = [
  { label: "Home", to: "/customer", icon: Home, end: true },
  { label: "Marketplace", to: "/customer/shop", icon: Store },
  { label: "My Cart", to: "/customer/cart", icon: ShoppingBag },
  { label: "My Orders", to: "/customer/orders", icon: ClipboardList },
  { label: "Profile", to: "/customer/profile", icon: UserCircle },
];

export function CustomerLayout() {
  return (
    <DashboardShell
      roleLabel="Customer Portal"
      navItems={customerNav}
      homePath="/customer"
    />
  );
}
