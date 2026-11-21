import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select } from "@/src/components/ui/select";
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
import { formatDateTime, formatETB, formatShortDate } from "@/src/lib/utils";
import type { Order, OrderStatus } from "@/src/types";

const ORDER_STATUSES: OrderStatus[] = [
  "Order Placed",
  "Confirmation Pending",
  "Confirmed",
  "Preparing",
  "Ready for Pickup",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export function AdminOrdersPage() {
  const { users } = useAuth();
  const {
    orders,
    adminConfirmWithSellers,
    adminUpdateOrderStatus,
    adminAssignDelivery,
    adminCompleteOrder,
  } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [driverId, setDriverId] = useState("");
  const [pickupNote, setPickupNote] = useState(
    "Collect sealed Herbiz parcel from workshop reception and verify item count."
  );

  const drivers = users.filter(
    (u) => u.role === "delivery" && u.status === "active"
  );

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeOrder: Order | undefined = orders.find(
    (o) => o.id === selectedOrderId
  );

  const openOrderModal = (order: Order) => {
    setSelectedOrderId(order.id);
    setDriverId(order.deliveryPartnerId || drivers[0]?.id || "");
    setPickupNote(
      order.pickupInstructions ||
        `Collect ${order.items.length} packed item(s) from ${order.items[0]?.sellerWorkshopLabel || "workshop"} and deliver to ${order.deliveryAddress}.`
    );
  };

  const handleAssignDriver = () => {
    if (!activeOrder || !driverId) return;
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    adminAssignDelivery(
      activeOrder.id,
      driver.id,
      driver.fullName,
      pickupNote.trim()
    );
    toast.success(`Assigned ${driver.fullName} to ${activeOrder.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Order Management" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          Centralized Order Coordination
        </h1>
        <p className="text-sm text-[#4B5563]">
          Coordinate between customers, women sellers, and delivery partners—all from one hub.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by Order ID (e.g. HBZ-1045) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            aria-label="Filter orders by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-semibold text-[#166534]">
                  {order.id}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[#1F2937]">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-[#6B7280]">{order.city}</p>
                </TableCell>
                <TableCell className="text-xs text-[#6B7280]">
                  {formatShortDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <StatusText status={order.status} />
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <StatusText status={order.deliveryStatus} />
                    {order.deliveryPartnerName && (
                      <p className="text-xs text-[#6B7280]">
                        {order.deliveryPartnerName}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  {formatETB(order.totalETB)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openOrderModal(order)}
                  >
                    Coordinate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Coordinate Order Dialog */}
      <Dialog
        open={Boolean(activeOrder)}
        onOpenChange={(open) => !open && setSelectedOrderId(null)}
      >
        <DialogContent
          className="max-w-2xl"
          onClose={() => setSelectedOrderId(null)}
        >
          {activeOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between pr-6">
                  <span className="font-mono">{activeOrder.id}</span>
                  <StatusText status={activeOrder.status} />
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                {/* Customer & Seller Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4">
                  <div>
                    <p className="text-xs font-semibold text-[#6B7280]">
                      Customer Details
                    </p>
                    <p className="font-medium text-[#1F2937] mt-1">
                      {activeOrder.customerName}
                    </p>
                    <p className="text-xs font-mono text-[#4B5563]">
                      {activeOrder.customerPhone}
                    </p>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      {activeOrder.deliveryAddress}, {activeOrder.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#6B7280]">
                      Financial Summary
                    </p>
                    <p className="mt-1 font-mono text-xs">
                      Items: {formatETB(activeOrder.subtotalETB)} + Delivery:{" "}
                      {formatETB(activeOrder.deliveryFeeETB)}
                    </p>
                    <p className="font-mono text-xs text-[#166534]">
                      Commission ({Math.round(activeOrder.commissionRate * 100)}%):{" "}
                      {formatETB(activeOrder.herbizCommissionETB)} · Seller Net:{" "}
                      {formatETB(activeOrder.sellerNetEarningsETB)}
                    </p>
                  </div>
                </div>

                {/* Items & Seller Prep Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1F2937]">
                      Items & Seller Preparation
                    </h4>
                    {(activeOrder.status === "Order Placed" ||
                      activeOrder.status === "Confirmation Pending") && (
                      <Button
                        size="sm"
                        onClick={() => {
                          adminConfirmWithSellers(activeOrder.id);
                          toast.success(
                            `Sent availability confirmation request to seller(s) for ${activeOrder.id}`
                          );
                        }}
                      >
                        Request Seller Confirmation
                      </Button>
                    )}
                  </div>
                  <div className="divide-y divide-[#F2F2EA] rounded-lg border border-[#E5E5DC]">
                    {activeOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-medium text-[#1F2937]">
                            {item.quantity} × {item.productName}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {item.sellerWorkshopLabel}
                          </p>
                        </div>
                        <StatusText status={item.sellerStage} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assign Delivery Partner */}
                <div className="rounded-lg border border-[#E5E5DC] p-4 space-y-3">
                  <h4 className="font-semibold text-[#1F2937]">
                    Assign Delivery Partner
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="admDriver">Delivery Partner</Label>
                      <Select
                        id="admDriver"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                      >
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.fullName} ({d.vehicleType || "Courier"})
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="admStatus">Override Order Status</Label>
                      <Select
                        id="admStatus"
                        value={activeOrder.status}
                        onChange={(e) => {
                          adminUpdateOrderStatus(
                            activeOrder.id,
                            e.target.value as OrderStatus
                          );
                          toast.success("Order status updated");
                        }}
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admPickup">Pickup Instructions</Label>
                    <Input
                      id="admPickup"
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAssignDriver}
                    >
                      {activeOrder.deliveryPartnerId
                        ? "Reassign Delivery Partner"
                        : "Assign Delivery Partner"}
                    </Button>
                    {!activeOrder.adminCompleted &&
                      activeOrder.status !== "Cancelled" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            adminCompleteOrder(activeOrder.id);
                            toast.success(
                              `Order ${activeOrder.id} marked completed & earnings settled!`
                            );
                          }}
                        >
                          Finalize & Settle Earnings
                        </Button>
                      )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-[#1F2937]">Activity Log</h4>
                  <div className="max-h-36 overflow-y-auto space-y-2 text-xs text-[#4B5563]">
                    {activeOrder.timeline.map((t) => (
                      <div key={t.id}>
                        <span className="font-semibold text-[#1F2937]">
                          {t.label}
                        </span>{" "}
                        · {t.actor} · {formatDateTime(t.timestamp)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedOrderId(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
