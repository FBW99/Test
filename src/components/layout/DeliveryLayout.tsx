import {
  History,
  LayoutDashboard,
  MapPin,
  UserCircle,
} from "lucide-react";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/src/components/layout/DashboardShell";

const deliveryNav: DashboardNavItem[] = [
  { label: "Overview", to: "/delivery", icon: LayoutDashboard, end: true },
  { label: "Assigned Deliveries", to: "/delivery/assignments", icon: MapPin },
  { label: "Delivery History", to: "/delivery/history", icon: History },
  { label: "Partner Profile", to: "/delivery/profile", icon: UserCircle },
];

export function DeliveryLayout() {
  return (
    <DashboardShell
      roleLabel="Delivery Partner Portal"
      navItems={deliveryNav}
      homePath="/delivery"
    />
  );
}
