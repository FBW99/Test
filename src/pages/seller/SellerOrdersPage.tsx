import { useState } from "react";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { EmptyState } from "@/src/components/common/EmptyState";
import { SafeImage } from "@/src/components/common/SafeImage";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/context/AuthContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatETB, formatShortDate } from "@/src/lib/utils";

export function SellerOrdersPage() {
  const { currentUser } = useAuth();
  const { orders, sellerUpdateStage } = useOrders();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const sellerOrders = orders
    .filter(
      (o) =>
        o.status !== "Cancelled" &&
        o.items.some((item) => item.sellerId === currentUser?.id)
    )
    .map((o) => ({
      order: o,
      myItems: o.items.filter((item) => item.sellerId === currentUser?.id),
    }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Seller Studio", to: "/seller" },
            { label: "Incoming Orders" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          Incoming Orders from Herbiz
        </h1>
        <p className="text-sm text-[#4B5563]">
          Confirm stock and pack your products. Herbiz handles all customer communication and courier pickup.
        </p>
      </div>

      <div className="rounded-xl border border-[#E5E5DC] bg-white p-4 flex items-start gap-3 text-xs text-[#4B5563]">
        <ShieldCheck className="h-4 w-4 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Customer phone numbers and home addresses are kept private by Herbiz. Once you mark items Ready for Pickup, a Herbiz courier collects the parcel from your workshop.
        </span>
      </div>

      {sellerOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No orders to prepare right now"
          description="When Herbiz receives customer orders for your approved products, they will appear here step by step."
        />
      ) : (
        <div className="space-y-4">
          {sellerOrders.map(({ order, myItems }) => {
            const currentStage = myItems[0]?.sellerStage || "Awaiting Confirmation";
            const itemsTotal = myItems.reduce((s, i) => s + i.subtotalETB, 0);

            return (
              <Card key={order.id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#F2F2EA] pb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-[#1F2937]">
                          {order.id}
                        </span>
                        <StatusText status={currentStage} />
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Requested {formatShortDate(order.createdAt)} · Delivery City:{" "}
                        {order.city} · Order Status: {order.status}
                      </p>
                    </div>
                    <p className="font-mono text-sm font-semibold text-[#166534] tabular-nums">
                      Gross Items: {formatETB(itemsTotal)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {myItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg bg-[#FAFAF5] p-3"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#F2F2EA]">
                          <SafeImage
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1F2937] truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#4B5563] tabular-nums">
                            Quantity needed: <span className="font-bold">{item.quantity}</span> ·{" "}
                            {formatETB(item.subtotalETB)}
                          </p>
                          {item.preparationNote && (
                            <p className="text-xs text-[#166534] mt-0.5">
                              Note: {item.preparationNote}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentStage !== "Ready for Pickup" && currentUser && (
                    <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Input
                        placeholder="Optional packing note for Herbiz courier (e.g. Fragile, box ready at reception)"
                        value={notes[order.id] ?? ""}
                        onChange={(e) =>
                          setNotes((prev) => ({
                            ...prev,
                            [order.id]: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {currentStage === "Awaiting Confirmation" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              sellerUpdateStage(
                                order.id,
                                currentUser.id,
                                "Confirmed",
                                notes[order.id]
                              );
                              toast.success(`Confirmed stock for ${order.id}`);
                            }}
                          >
                            Confirm Availability
                          </Button>
                        )}
                        {(currentStage === "Awaiting Confirmation" ||
                          currentStage === "Confirmed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              sellerUpdateStage(
                                order.id,
                                currentUser.id,
                                "Preparing",
                                notes[order.id]
                              );
                              toast.success(`Marked ${order.id} as Preparing`);
                            }}
                          >
                            Mark Preparing
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="amber"
                          onClick={() => {
                            sellerUpdateStage(
                              order.id,
                              currentUser.id,
                              "Ready for Pickup",
                              notes[order.id]
                            );
                            toast.success(
                              `${order.id} marked Ready for Pickup! Herbiz has been notified.`
                            );
                          }}
                        >
                          Ready for Pickup
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
