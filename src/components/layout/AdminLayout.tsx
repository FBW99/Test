import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Store,
  Truck,
  Users,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/src/components/layout/DashboardShell";

const adminNav: DashboardNavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Sellers", to: "/admin/sellers", icon: Store },
  { label: "Product Approval", to: "/admin/products", icon: CheckSquare },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Deliveries", to: "/admin/deliveries", icon: Truck },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Finance & Rates", to: "/admin/finance", icon: DollarSign },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export function AdminLayout() {
  return (
    <DashboardShell
      roleLabel="Herbiz Admin Hub"
      navItems={adminNav}
      homePath="/admin"
    />
  );
}
