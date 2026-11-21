import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatETB } from "@/src/lib/utils";

export function DeliveryDashboard() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const myDeliveries = orders.filter(
    (o) => o.deliveryPartnerId === currentUser?.id && o.status !== "Cancelled"
  );

  const pendingPickups = myDeliveries.filter(
    (o) => o.deliveryStatus === "Assigned" || o.deliveryStatus === "Accepted"
  );
  const inProgress = myDeliveries.filter(
    (o) => o.deliveryStatus === "Picked Up" || o.deliveryStatus === "In Transit"
  );
  const completed = myDeliveries.filter(
    (o) => o.deliveryStatus === "Delivered"
  );

  const totalDriverPayout = completed.reduce(
    (sum, o) => sum + o.deliveryPartnerPayoutETB,
    0
  );

  const activeList = [...pendingPickups, ...inProgress];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumbs
          items={[{ label: "Delivery Partner Portal" }, { label: "Overview" }]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
              Ready for Dispatch, {currentUser?.fullName.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-[#4B5563] dark:text-[#B4C2B9]">
              Vehicle: {currentUser?.vehicleType || "Herbiz Courier"} · View assigned pickups and update live delivery progress.
            </p>
          </div>
          <Button onClick={() => navigate("/delivery/assignments")}>
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>Open Assigned Deliveries</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Assigned Trips</span>
              <Truck className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
              {myDeliveries.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Pending Pickups</span>
              <Package className="h-4 w-4 text-[#B45309] dark:text-[#FBBF24]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#B45309] dark:text-[#FBBF24] tabular-nums">
              {pendingPickups.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">In Progress</p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
              {inProgress.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">
              <span>Completed Drops</span>
              <CheckCircle2 className="h-4 w-4 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
              {completed.length}
            </p>
            <p className="mt-1 text-xs text-[#6B7280] dark:text-[#8A9990] font-mono tabular-nums">
              Earned: {formatETB(totalDriverPayout)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Active Queue</CardTitle>
          <Link
            to="/delivery/assignments"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#166534] dark:text-[#4ADE80] hover:underline whitespace-nowrap shrink-0"
          >
            <span>Manage trips</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </CardHeader>
        <CardContent>
          {activeList.length === 0 ? (
            <p className="text-sm text-[#6B7280] dark:text-[#8A9990] py-4">
              No active deliveries right now. New assignments from Herbiz Admin appear here automatically.
            </p>
          ) : (
            <div className="divide-y divide-[#F2F2EA] dark:divide-[#1D2A22]">
              {activeList.map((order) => (
                <div
                  key={order.id}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                      {order.id} · {order.customerName}
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-[#8A9990]">
                      Drop-off: {order.deliveryAddress}, {order.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusText status={order.deliveryStatus} />
                    <span className="font-mono text-sm font-semibold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                      {formatETB(order.deliveryPartnerPayoutETB)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
