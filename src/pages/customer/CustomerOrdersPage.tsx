import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { EmptyState } from "@/src/components/common/EmptyState";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useAuth } from "@/src/context/AuthContext";
import { useOrders } from "@/src/context/OrderContext";
import { cn, formatETB, formatShortDate } from "@/src/lib/utils";

export function CustomerOrdersPage() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  const myOrders = orders.filter((o) => o.customerId === currentUser?.id);
  const filtered = myOrders.filter((o) => {
    if (filter === "delivered") return o.status === "Delivered";
    if (filter === "active")
      return o.status !== "Delivered" && o.status !== "Cancelled";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "My Orders" },
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1F2937]">
              My Orders
            </h1>
            <p className="text-sm text-[#4B5563]">
              Track every stage from Herbiz confirmation through courier delivery.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[#E5E5DC] bg-white self-start">
            {(["all", "active", "delivered"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md capitalize cursor-pointer transition-colors",
                  filter === tab
                    ? "bg-[#166534] text-white"
                    : "text-[#4B5563] hover:text-[#1F2937]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders in this view"
          description="Once you place an order, you can follow every step from preparation to doorstep delivery."
          actionLabel="Explore Marketplace"
          onAction={() => navigate("/customer/shop")}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-semibold text-[#166534]">
                    <Link
                      to={`/customer/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-[#4B5563]">
                    {formatShortDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.items.map((i) => `${i.quantity}× ${i.productName}`).join(", ")}
                  </TableCell>
                  <TableCell>
                    <StatusText status={order.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {formatETB(order.totalETB)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/customer/orders/${order.id}`)}
                    >
                      Track Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
