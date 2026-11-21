import { useState } from "react";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
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
import { formatETB } from "@/src/lib/utils";
import type { Order } from "@/src/types";

export function AdminDeliveriesPage() {
  const { users } = useAuth();
  const { orders, adminAssignDelivery, adminCompleteOrder } = useOrders();

  const drivers = users.filter(
    (u) => u.role === "delivery" && u.status === "active"
  );

  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState(
    drivers[0]?.id || ""
  );
  const [pickupNote, setPickupNote] = useState("");

  const activeDeliveries = orders.filter((o) => o.status !== "Cancelled");

  const openAssign = (order: Order) => {
    setAssigningOrder(order);
    setSelectedDriverId(order.deliveryPartnerId || drivers[0]?.id || "");
    setPickupNote(
      order.pickupInstructions ||
        `Collect parcel for ${order.id} and deliver to ${order.deliveryAddress}.`
    );
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningOrder || !selectedDriverId) return;
    const driver = drivers.find((d) => d.id === selectedDriverId);
    if (!driver) return;
    adminAssignDelivery(
      assigningOrder.id,
      driver.id,
      driver.fullName,
      pickupNote.trim()
    );
    toast.success(`Assigned ${driver.fullName} to ${assigningOrder.id}`);
    setAssigningOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Delivery Management" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          Delivery Partners & Dispatch
        </h1>
        <p className="text-sm text-[#4B5563]">
          Assign couriers to ready orders, monitor transit updates, and confirm completed deliveries.
        </p>
      </div>

      {/* Active Fleet Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => {
          const activeCount = orders.filter(
            (o) =>
              o.deliveryPartnerId === driver.id &&
              o.deliveryStatus !== "Delivered" &&
              o.status !== "Cancelled"
          ).length;
          const completedCount = orders.filter(
            (o) =>
              o.deliveryPartnerId === driver.id &&
              o.deliveryStatus === "Delivered"
          ).length;

          return (
            <Card key={driver.id}>
              <CardContent className="p-5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1F2937]">
                    {driver.fullName}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    @{driver.username} · {driver.vehicleType || "Courier"}
                  </p>
                  <p className="text-xs font-mono text-[#4B5563] mt-1">
                    {driver.phone}
                  </p>
                </div>
                <div className="text-right font-mono text-xs tabular-nums">
                  <p className="font-semibold text-[#166534]">
                    {activeCount} active
                  </p>
                  <p className="text-[#6B7280]">{completedCount} delivered</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            <span>Delivery Dispatch Queue</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Order Stage</TableHead>
                <TableHead>Assigned Courier</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead className="text-right">Partner Payout</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDeliveries.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-semibold text-[#166534]">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-[#1F2937]">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-[#6B7280] max-w-[200px] truncate">
                      {order.deliveryAddress}, {order.city}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StatusText status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.deliveryPartnerName || (
                      <span className="text-[#9CA3AF]">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusText status={order.deliveryStatus} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {formatETB(order.deliveryPartnerPayoutETB)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.deliveryStatus !== "Delivered" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAssign(order)}
                        >
                          {order.deliveryPartnerId ? "Reassign" : "Assign"}
                        </Button>
                      )}
                      {order.deliveryStatus === "Delivered" &&
                        !order.adminCompleted && (
                          <Button
                            size="sm"
                            onClick={() => {
                              adminCompleteOrder(order.id);
                              toast.success(`Verified delivery for ${order.id}`);
                            }}
                          >
                            Confirm Done
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(assigningOrder)}
        onOpenChange={(open) => !open && setAssigningOrder(null)}
      >
        <DialogContent onClose={() => setAssigningOrder(null)}>
          <DialogHeader>
            <DialogTitle>
              Assign Courier · {assigningOrder?.id}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="drvSelect">Select Delivery Partner</Label>
              <Select
                id="drvSelect"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} — {d.vehicleType}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="drvNote">Pickup Instructions</Label>
              <Input
                id="drvNote"
                required
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssigningOrder(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Confirm Assignment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
