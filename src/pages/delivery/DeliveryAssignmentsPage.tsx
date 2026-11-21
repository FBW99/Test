import { useState } from "react";
import { MapPin, Phone, Truck } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { EmptyState } from "@/src/components/common/EmptyState";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatETB } from "@/src/lib/utils";
import type { Order } from "@/src/types";

export function DeliveryAssignmentsPage() {
  const { currentUser } = useAuth();
  const { orders, deliveryUpdateStatus } = useOrders();

  const [failingOrder, setFailingOrder] = useState<Order | null>(null);
  const [failReason, setFailReason] = useState("");

  const activeTrips = orders.filter(
    (o) =>
      o.deliveryPartnerId === currentUser?.id &&
      o.status !== "Cancelled" &&
      o.deliveryStatus !== "Delivered" &&
      o.deliveryStatus !== "Failed"
  );

  const handleReportFailed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!failingOrder) return;
    deliveryUpdateStatus(
      failingOrder.id,
      "Failed",
      failReason.trim() || "Customer unavailable at delivery address."
    );
    toast.error(`Reported failed delivery for ${failingOrder.id}`);
    setFailingOrder(null);
    setFailReason("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Delivery Partner Portal", to: "/delivery" },
            { label: "Assigned Deliveries" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          Assigned Deliveries
        </h1>
        <p className="text-sm text-[#4B5563]">
          Follow pickup instructions from Herbiz, collect parcels, and confirm doorstep delivery.
        </p>
      </div>

      {activeTrips.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No active delivery assignments"
          description="You have completed all assigned deliveries. Check back when Herbiz Admin assigns new trips."
        />
      ) : (
        <div className="space-y-4">
          {activeTrips.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2F2EA] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold text-[#166534]">
                      {order.id}
                    </span>
                    <StatusText status={order.deliveryStatus} />
                  </div>
                  <div className="text-sm font-mono font-semibold text-[#1F2937] tabular-nums">
                    Delivery Partner Fee: {formatETB(order.deliveryPartnerPayoutETB)}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
                  <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#6B7280]">
                      Customer Delivery Location
                    </p>
                    <p className="font-semibold text-[#1F2937]">
                      {order.customerName}
                    </p>
                    <p className="flex items-start gap-1.5 text-[#4B5563]">
                      <MapPin className="h-4 w-4 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        {order.deliveryAddress}, {order.city}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5 font-mono text-xs text-[#1F2937]">
                      <Phone className="h-3.5 w-3.5 text-[#166534]" aria-hidden="true" />
                      <span>{order.customerPhone}</span>
                    </p>
                    {order.paymentMethod === "Cash on Delivery" && (
                      <p className="pt-1 text-xs font-semibold text-[#B45309] font-mono tabular-nums">
                        Collect Cash on Delivery: {formatETB(order.totalETB)}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#6B7280]">
                      Package & Herbiz Pickup Instructions
                    </p>
                    <ul className="space-y-1 text-sm text-[#1F2937]">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity} × {item.productName}
                        </li>
                      ))}
                    </ul>
                    <p className="pt-1 text-xs text-[#4B5563]">
                      <span className="font-semibold text-[#1F2937]">
                        Pickup Note:
                      </span>{" "}
                      {order.pickupInstructions ||
                        "Collect sealed Herbiz parcel at workshop reception."}
                    </p>
                  </div>
                </div>

                {/* Driver Workflow Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {order.deliveryStatus === "Assigned" && (
                      <Button
                        onClick={() => {
                          deliveryUpdateStatus(order.id, "Accepted");
                          toast.success(`Accepted delivery ${order.id}`);
                        }}
                      >
                        Accept Delivery
                      </Button>
                    )}

                    {(order.deliveryStatus === "Assigned" ||
                      order.deliveryStatus === "Accepted") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          deliveryUpdateStatus(order.id, "Picked Up");
                          toast.success(`Confirmed pickup for ${order.id}`);
                        }}
                      >
                        Confirm Pickup
                      </Button>
                    )}

                    {order.deliveryStatus === "Picked Up" && (
                      <Button
                        variant="amber"
                        onClick={() => {
                          deliveryUpdateStatus(order.id, "In Transit");
                          toast.success(`Marked ${order.id} In Transit`);
                        }}
                      >
                        Mark In Transit
                      </Button>
                    )}

                    {(order.deliveryStatus === "Picked Up" ||
                      order.deliveryStatus === "In Transit") && (
                      <Button
                        onClick={() => {
                          deliveryUpdateStatus(order.id, "Delivered");
                          toast.success(
                            `Delivery ${order.id} completed! Herbiz and customer notified.`
                          );
                        }}
                      >
                        Confirm Delivery
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#B91C1C] hover:bg-[#FEF2F2]"
                    onClick={() => {
                      setFailingOrder(order);
                      setFailReason("");
                    }}
                  >
                    Report Failed Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(failingOrder)}
        onOpenChange={(open) => !open && setFailingOrder(null)}
      >
        <DialogContent onClose={() => setFailingOrder(null)}>
          <DialogHeader>
            <DialogTitle>
              Report Failed Delivery · {failingOrder?.id}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReportFailed} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="failReason">Reason for Failed Attempt</Label>
              <Textarea
                id="failReason"
                required
                placeholder="e.g. Customer unreachable by phone after 2 attempts."
                value={failReason}
                onChange={(e) => setFailReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFailingOrder(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
