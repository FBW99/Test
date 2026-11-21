import { History } from "lucide-react";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { EmptyState } from "@/src/components/common/EmptyState";
import { StatusText } from "@/src/components/common/StatusText";
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
import { formatETB, formatShortDate } from "@/src/lib/utils";

export function DeliveryHistoryPage() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();

  const history = orders.filter(
    (o) =>
      o.deliveryPartnerId === currentUser?.id &&
      (o.deliveryStatus === "Delivered" || o.deliveryStatus === "Failed")
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Delivery Partner Portal", to: "/delivery" },
            { label: "Delivery History" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          Completed & Past Deliveries
        </h1>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No completed trips yet"
          description="Delivered parcels and payout records appear here once you complete a trip."
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer & Address</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Partner Payout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-semibold text-[#166534]">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-[#1F2937]">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {order.deliveryAddress}, {order.city}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-[#6B7280]">
                    {formatShortDate(order.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <StatusText status={order.deliveryStatus} />
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-[#166534] tabular-nums">
                    {order.deliveryStatus === "Delivered"
                      ? formatETB(order.deliveryPartnerPayoutETB)
                      : "0 ETB"}
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
