import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  LogOut,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import { Logo } from "@/src/components/common/Logo";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { cn, formatDateTime } from "@/src/lib/utils";

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

interface DashboardShellProps {
  roleLabel: string;
  navItems: DashboardNavItem[];
  homePath: string;
}

export function DashboardShell({
  roleLabel,
  navItems,
  homePath,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const {
    getNotificationsForUser,
    markAsRead,
    markAllAsReadForRole,
  } = useNotifications();
  const navigate = useNavigate();

  const userNotifications = currentUser
    ? getNotificationsForUser(currentUser.role, currentUser.id)
    : [];
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-[#E5E5DC] dark:bg-[#121A15] dark:border-[#243329]">
      <div>
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#E5E5DC] dark:border-[#243329]">
          <Logo to={homePath} />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-[#4B5563] hover:bg-[#F2F2EA] dark:text-[#B4C2B9] dark:hover:bg-[#18231C] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-[#E5E5DC] bg-[#FAFAF5]/60 dark:border-[#243329] dark:bg-[#0F1612]">
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">{roleLabel}</p>
          <p className="mt-0.5 text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2] truncate">
            {currentUser?.fullName}
          </p>
          <p className="text-xs text-[#6B7280] dark:text-[#8A9990] truncate">
            @{currentUser?.username}
          </p>
        </div>

        <nav aria-label="Dashboard Navigation" className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[#166534] text-white dark:bg-[#15803D]"
                      : "text-[#4B5563] hover:bg-[#F2F2EA] hover:text-[#1F2937] dark:text-[#B4C2B9] dark:hover:bg-[#18231C] dark:hover:text-[#F1F5F2]"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-[#E5E5DC] dark:border-[#243329] space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-[#4B5563] hover:text-[#B91C1C] hover:border-[#FCA5A5] dark:text-[#B4C2B9] dark:hover:text-[#F87171] dark:hover:border-[#7F1D1D]"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#FAFAF5] text-[#1F2937] dark:bg-[#0B110D] dark:text-[#F1F5F2] transition-colors">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E5E5DC] bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 dark:border-[#243329] dark:bg-[#121A15]/95">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5DC] text-[#1F2937] hover:bg-[#F2F2EA] dark:border-[#243329] dark:text-[#F1F5F2] dark:hover:bg-[#18231C] cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2] truncate">
                {roleLabel}
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#8A9990] hidden sm:block truncate">
                Coordinated by Herbiz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <ThemeToggle />

            {currentUser?.role === "customer" && (
              <Link
                to="/customer/cart"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] px-3 text-sm font-medium text-[#1F2937] hover:border-[#166534] dark:border-[#243329] dark:bg-[#0F1612] dark:text-[#F1F5F2] dark:hover:border-[#4ADE80] transition-colors whitespace-nowrap"
              >
                <ShoppingBag className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
                <span>Cart</span>
                <span className="font-mono text-xs font-semibold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  ({totalItemsCount})
                </span>
              </Link>
            )}

            {/* Working Internal Notifications Panel */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="Toggle notifications"
                className="relative inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5DC] bg-white px-3 text-sm font-medium text-[#1F2937] hover:bg-[#FAFAF5] dark:border-[#243329] dark:bg-[#121A15] dark:text-[#F1F5F2] dark:hover:bg-[#18231C] cursor-pointer"
              >
                <Bell className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
                <span className="hidden sm:inline">Updates</span>
                {unreadCount > 0 && (
                  <span className="font-mono text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] tabular-nums">
                    ({unreadCount})
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-40 w-80 sm:w-96 rounded-xl border border-[#E5E5DC] bg-white shadow-lg overflow-hidden dark:border-[#243329] dark:bg-[#121A15]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5DC] bg-[#FAFAF5] dark:border-[#243329] dark:bg-[#0F1612]">
                      <span className="font-display text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                        Herbiz Updates
                      </span>
                      {currentUser && unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            markAllAsReadForRole(currentUser.role, currentUser.id)
                          }
                          className="text-xs font-medium text-[#166534] dark:text-[#4ADE80] hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#F2F2EA] dark:divide-[#1D2A22]">
                      {userNotifications.length === 0 ? (
                        <p className="p-6 text-center text-sm text-[#6B7280] dark:text-[#8A9990]">
                          You are all caught up. Order and approval notices appear here.
                        </p>
                      ) : (
                        userNotifications.slice(0, 8).map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => markAsRead(n.id)}
                            className={cn(
                              "w-full text-left px-4 py-3 transition-colors hover:bg-[#FAFAF5] dark:hover:bg-[#18231C] cursor-pointer",
                              !n.read && "bg-[#166534]/[0.03] dark:bg-[#4ADE80]/[0.06]"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-[#1F2937] dark:text-[#F1F5F2] truncate">
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="text-[11px] font-medium text-[#166534] dark:text-[#4ADE80] shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#4B5563] dark:text-[#B4C2B9] line-clamp-2">
                              {n.message}
                            </p>
                            <p className="mt-1 text-[11px] text-[#9CA3AF] dark:text-[#6E7E74]">
                              {formatDateTime(n.createdAt)}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
