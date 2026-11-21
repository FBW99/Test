import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bell, CheckCircle2, Clock, Package, PlusCircle, Wallet } from "lucide-react";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatDateTime, formatETB } from "@/src/lib/utils";

export function SellerDashboard() {
  const { currentUser } = useAuth();
  const { products, financeSettings } = useMarketplace();
  const { orders } = useOrders();
  const { getNotificationsForUser, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const myProducts = products.filter((p) => p.sellerId === currentUser?.id);
  const approvedCount = myProducts.filter((p) => p.status === "approved").length;
  const pendingCount = myProducts.filter((p) => p.status === "pending").length;

  const myOrderItems = orders
    .filter((o) => o.status !== "Cancelled")
    .flatMap((o) =>
      o.items
        .filter((item) => item.sellerId === currentUser?.id)
        .map((item) => ({ order: o, item }))
    );

  const uniqueOrdersCount = new Set(myOrderItems.map((x) => x.order.id)).size;
  const grossSales = myOrderItems.reduce((sum, x) => sum + x.item.subtotalETB, 0);
  const netEarnings = myOrderItems.reduce((sum, x) => {
    const rate = x.order.adminCompleted
      ? x.order.commissionRate
      : financeSettings.commissionRate;
    return sum + Math.round(x.item.subtotalETB * (1 - rate));
  }, 0);

  const now = new Date();
  const monthlyGrossSales = myOrderItems
    .filter((x) => {
      const d = new Date(x.order.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, x) => sum + x.item.subtotalETB, 0);

  const notifications = currentUser
    ? getNotificationsForUser("seller", currentUser.id).slice(0, 4)
    : [];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumbs items={[{ label: "Seller Studio" }, { label: "Overview" }]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
              Hello, {currentUser?.fullName.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-[#4B5563] dark:text-[#B4C2B9]">
              {currentUser?.businessName || "Your Herbiz Studio"} — Craft your products, and Herbiz handles shoppers and doorstep delivery.
            </p>
          </div>
          <Button onClick={() => navigate("/seller/products/new")}>
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {currentUser?.status === "pending" && (
        <div className="rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] dark:bg-[#2A200D] dark:border-[#F59E0B]/30 p-4 text-sm text-[#92400E] dark:text-[#FCD34D]">
          <p className="font-semibold">Account Review in Progress</p>
          <p className="mt-1">
            Herbiz Administration is reviewing your workshop registration. You can prepare product drafts now; once approved, your items go live in the marketplace.
          </p>
        </div>
      )}

      {/* Simple 6-Stat Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Total Products</span>
              <Package className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
              {myProducts.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Approved & Live</span>
              <CheckCircle2 className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
              {approvedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Pending Approval</span>
              <Clock className="h-4 w-4 text-[#B45309] dark:text-[#FBBF24]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#B45309] dark:text-[#FBBF24] tabular-nums">
              {pendingCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">Total Orders</p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
              {uniqueOrdersCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Your Net Earnings</span>
              <Wallet className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
              {formatETB(netEarnings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              This Month&apos;s Sales
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
              {formatETB(monthlyGrossSales || grossSales)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clear Intuitive Next Actions + Herbiz Admin Updates */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Orders Waiting for You</CardTitle>
            <Link
              to="/seller/orders"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#166534] dark:text-[#4ADE80] hover:underline whitespace-nowrap shrink-0"
            >
              <span>Open orders</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardHeader>
          <CardContent>
            {myOrderItems.length === 0 ? (
              <p className="text-sm text-[#6B7280] dark:text-[#8A9990] py-4">
                No incoming orders yet. Once customers buy your approved products, Herbiz sends preparation requests here.
              </p>
            ) : (
              <div className="divide-y divide-[#F2F2EA] dark:divide-[#1D2A22]">
                {myOrderItems.slice(0, 4).map(({ order, item }) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2] truncate">
                        {item.quantity} × {item.productName}
                      </p>
                      <p className="text-xs text-[#6B7280] dark:text-[#8A9990] font-mono">
                        {order.id} · Destination: {order.city}
                      </p>
                    </div>
                    <StatusText status={item.sellerStage} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
              <span>Messages from Herbiz Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-sm text-[#6B7280] dark:text-[#8A9990] py-4">
                No administrative notices right now.
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markAsRead(n.id)}
                    className="w-full text-left rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-[#FAFAF5] dark:bg-[#0F1612] p-3.5 hover:border-[#166534]/40 dark:hover:border-[#4ADE80]/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                        {n.title}
                      </span>
                      <span className="text-[11px] text-[#6B7280] dark:text-[#8A9990]">
                        {formatDateTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#4B5563] dark:text-[#B4C2B9]">{n.message}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
