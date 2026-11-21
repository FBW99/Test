import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatETB, formatShortDate } from "@/src/lib/utils";

export function SellerEarningsPage() {
  const { currentUser } = useAuth();
  const { financeSettings } = useMarketplace();
  const { orders } = useOrders();

  const rows = orders
    .filter((o) => o.status !== "Cancelled")
    .flatMap((order) => {
      const myItems = order.items.filter((i) => i.sellerId === currentUser?.id);
      if (myItems.length === 0) return [];
      const gross = myItems.reduce((s, i) => s + i.subtotalETB, 0);
      const rate = order.adminCompleted
        ? order.commissionRate
        : financeSettings.commissionRate;
      const commission = Math.round(gross * rate);
      const net = gross - commission;

      return [
        {
          orderId: order.id,
          date: order.createdAt,
          itemsLabel: myItems.map((i) => `${i.quantity}× ${i.productName}`).join(", "),
          gross,
          rate,
          commission,
          net,
          settled: order.adminCompleted || order.status === "Delivered",
        },
      ];
    });

  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);
  const totalNet = rows.reduce((s, r) => s + r.net, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Seller Studio", to: "/seller" },
            { label: "My Earnings" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Earnings & Payout Ledger
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
          Transparent earnings breakdown after Herbiz&apos;s{" "}
          {Math.round(financeSettings.commissionRate * 100)}% platform commission.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">Total Product Sales</p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
              {formatETB(totalGross)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">Herbiz Commission</p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#B45309] dark:text-[#FBBF24] tabular-nums">
              -{formatETB(totalCommission)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990]">Net Seller Earnings</p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
              {formatETB(totalNet)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-[#6B7280] dark:text-[#8A9990]">
              No sales recorded yet. Earnings appear automatically as orders come in.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Gross Sales</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead className="text-right">Net Payout</TableHead>
                  <TableHead className="text-right">Payout Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.orderId}>
                    <TableCell className="font-mono font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                      {r.orderId}
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280] dark:text-[#8A9990]">
                      {formatShortDate(r.date)}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {r.itemsLabel}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatETB(r.gross)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#B45309] dark:text-[#FBBF24] tabular-nums">
                      -{formatETB(r.commission)} ({Math.round(r.rate * 100)}%)
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                      {formatETB(r.net)}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusText status={r.settled ? "Completed" : "Pending"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
