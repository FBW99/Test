import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  ClipboardList,
  DollarSign,
  RotateCcw,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useOrders } from "@/src/context/OrderContext";
import { summarizeOrdersFinancials } from "@/src/services/calculations";
import { formatETB, formatShortDate } from "@/src/lib/utils";

export function AdminDashboard() {
  const { users, resetDemoPlatform } = useAuth();
  const { products, financeSettings } = useMarketplace();
  const { orders } = useOrders();
  const [resetOpen, setResetOpen] = useState(false);

  const sellers = users.filter((u) => u.role === "seller");
  const customers = users.filter((u) => u.role === "customer");
  const pendingSellers = sellers.filter((s) => s.status === "pending");
  const pendingProducts = products.filter((p) => p.status === "pending");

  const deliveriesInProgress = orders.filter(
    (o) =>
      o.deliveryPartnerId &&
      o.deliveryStatus !== "Delivered" &&
      o.deliveryStatus !== "Failed" &&
      o.status !== "Cancelled"
  ).length;
  const successfulDeliveries = orders.filter(
    (o) => o.deliveryStatus === "Delivered"
  ).length;

  const financials = summarizeOrdersFinancials(orders, financeSettings);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumbs items={[{ label: "Admin Hub" }, { label: "Overview" }]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Herbiz Operations Overview
            </h1>
            <p className="mt-1 text-sm text-[#4B5563]">
              Central command for seller onboarding, product curation, order coordination, and delivery dispatch.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetOpen(true)}
            className="self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </div>

      {/* Live Derived KPI Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Herbiz Revenue</span>
              <DollarSign className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] tabular-nums">
              {formatETB(financials.totalHerbizRevenueETB)}
            </p>
            <p className="mt-1 text-xs text-[#6B7280] tabular-nums">
              From {formatETB(financials.grossMerchandiseSalesETB)} gross sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Total Orders</span>
              <ClipboardList className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] tabular-nums">
              {orders.length}
            </p>
            <p className="mt-1 text-xs text-[#6B7280] tabular-nums">
              {financials.completedOrderCount} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Women Sellers</span>
              <Store className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] tabular-nums">
              {sellers.length}
            </p>
            <p className="mt-1 text-xs text-[#B45309] tabular-nums">
              {pendingSellers.length} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Active Customers</span>
              <Users className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] tabular-nums">
              {customers.filter((c) => c.status === "active").length}
            </p>
            <p className="mt-1 text-xs text-[#6B7280] tabular-nums">
              {products.filter((p) => p.status === "approved").length} live products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Pending Products</span>
              <CheckSquare className="h-4 w-4 text-[#B45309]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#B45309] tabular-nums">
              {pendingProducts.length}
            </p>
            <Link
              to="/admin/products"
              className="mt-1 inline-block text-xs font-medium text-[#166534] hover:underline"
            >
              Review queue →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>Deliveries In Progress</span>
              <Truck className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#0F766E] tabular-nums">
              {deliveriesInProgress}
            </p>
            <Link
              to="/admin/deliveries"
              className="mt-1 inline-block text-xs font-medium text-[#166534] hover:underline"
            >
              Manage dispatch →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280]">
              Successful Deliveries
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] tabular-nums">
              {successfulDeliveries}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">Verified doorstep drops</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280]">
              Seller Net Earnings
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] tabular-nums">
              {formatETB(financials.totalSellerNetEarningsETB)}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              After {Math.round(financeSettings.commissionRate * 100)}% commission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Queues */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Orders Requiring Action</CardTitle>
            <Link
              to="/admin/orders"
              className="text-xs font-medium text-[#166534] hover:underline"
            >
              Open all orders →
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-[#F2F2EA]">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-[#1F2937]">
                    {order.id} · {order.customerName}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {formatShortDate(order.createdAt)} · {order.items.length} item(s) · Courier:{" "}
                    {order.deliveryPartnerName || "Unassigned"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusText status={order.status} />
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {formatETB(order.totalETB)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">
                  Seller Applications
                </p>
                <p className="text-xs text-[#6B7280]">
                  {pendingSellers.length} entrepreneur(s) awaiting verification
                </p>
              </div>
              <Link to="/admin/sellers">
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </Link>
            </div>

            <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">
                  Product Submissions
                </p>
                <p className="text-xs text-[#6B7280]">
                  {pendingProducts.length} product(s) waiting for catalog approval
                </p>
              </div>
              <Link to="/admin/products">
                <Button size="sm" variant="outline">
                  Approve
                </Button>
              </Link>
            </div>

            <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">
                  Commission & Delivery Fees
                </p>
                <p className="text-xs text-[#6B7280]">
                  Current rate: {Math.round(financeSettings.commissionRate * 100)}% ·{" "}
                  {formatETB(financeSettings.customerDeliveryFeeETB)} fee
                </p>
              </div>
              <Link to="/admin/finance">
                <Button size="sm" variant="outline">
                  Configure
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset Hackathon Demo Data?"
        description="This clears local browser changes and restores the original seeded Herbiz accounts, products, orders, and financial settings."
        confirmLabel="Reset Platform"
        destructive
        onConfirm={resetDemoPlatform}
      />
    </div>
  );
}
