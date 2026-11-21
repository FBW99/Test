import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useOrders } from "@/src/context/OrderContext";
import { summarizeOrdersFinancials } from "@/src/services/calculations";
import { formatETB } from "@/src/lib/utils";

export function AdminFinancePage() {
  const { financeSettings, updateFinanceSettings } = useMarketplace();
  const { orders } = useOrders();

  const [commissionPct, setCommissionPct] = useState(
    String(Math.round(financeSettings.commissionRate * 100))
  );
  const [customerDeliveryFee, setCustomerDeliveryFee] = useState(
    String(financeSettings.customerDeliveryFeeETB)
  );
  const [driverPayout, setDriverPayout] = useState(
    String(financeSettings.deliveryPartnerPayoutETB)
  );

  const summary = summarizeOrdersFinancials(orders, financeSettings);
  const validOrders = orders.filter((o) => o.status !== "Cancelled");

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Math.max(0, Math.min(50, Number(commissionPct) || 0)) / 100;
    const custFee = Math.max(0, Number(customerDeliveryFee) || 0);
    const payout = Math.max(0, Math.min(custFee, Number(driverPayout) || 0));

    updateFinanceSettings({
      commissionRate: rate,
      customerDeliveryFeeETB: custFee,
      deliveryPartnerPayoutETB: payout,
    });
    toast.success("Platform commission & delivery fee rates updated!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Revenue & Commissions" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          Financial Management & Unit Economics
        </h1>
        <p className="text-sm text-[#4B5563]">
          Separate Gross Sales Value from Herbiz Revenue (Commission + Delivery Margin). Changes update active estimates immediately.
        </p>
      </div>

      {/* Clear Financial Distinction */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280]">
              Gross Merchandise Sales
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] tabular-nums">
              {formatETB(summary.grossMerchandiseSalesETB)}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Total product value sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280]">
              Herbiz Net Revenue
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#166534] tabular-nums">
              {formatETB(summary.totalHerbizRevenueETB)}
            </p>
            <p className="mt-1 text-xs text-[#4B5563] tabular-nums">
              {formatETB(summary.totalHerbizCommissionETB)} comm. +{" "}
              {formatETB(summary.totalHerbizDeliveryMarginETB)} delivery margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280]">
              Seller Net Earnings
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#1F2937] tabular-nums">
              {formatETB(summary.totalSellerNetEarningsETB)}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Payable to women makers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-[#6B7280]">
              Delivery Partner Payouts
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-[#B45309] tabular-nums">
              {formatETB(summary.totalDeliveryPartnerPayoutsETB)}
            </p>
            <p className="mt-1 text-xs text-[#6B7280] tabular-nums">
              Out of {formatETB(summary.totalDeliveryFeesCollectedETB)} collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configurable Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Configure Commission & Delivery Economics
          </CardTitle>
          <CardDescription>
            Example: 1,000 ETB product at 10% = 100 ETB Herbiz commission + 900 ETB seller payout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSaveRates}
            className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end"
          >
            <div className="space-y-1.5">
              <Label htmlFor="ratePct">Commission Rate (%)</Label>
              <Input
                id="ratePct"
                type="number"
                min={0}
                max={50}
                value={commissionPct}
                onChange={(e) => setCommissionPct(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="custDelFee">Customer Delivery Fee (ETB)</Label>
              <Input
                id="custDelFee"
                type="number"
                min={0}
                value={customerDeliveryFee}
                onChange={(e) => setCustomerDeliveryFee(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="drvPay">Delivery Partner Cost / Payout (ETB)</Label>
              <Input
                id="drvPay"
                type="number"
                min={0}
                value={driverPayout}
                onChange={(e) => setDriverPayout(e.target.value)}
              />
            </div>
            <Button type="submit">Apply New Rates</Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Ledger */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Product Sales</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Seller Net</TableHead>
                <TableHead className="text-right">Delivery Fee</TableHead>
                <TableHead className="text-right">Partner Cost</TableHead>
                <TableHead className="text-right">Herbiz Total Rev.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validOrders.map((o) => {
                const effRate = o.adminCompleted
                  ? o.commissionRate
                  : financeSettings.commissionRate;
                const comm = Math.round(o.subtotalETB * effRate);
                const sellerNet = o.subtotalETB - comm;
                const delMargin = Math.max(
                  0,
                  o.deliveryFeeETB - o.deliveryPartnerPayoutETB
                );
                const herbizRev = comm + delMargin;

                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono font-semibold text-[#166534]">
                      {o.id}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatETB(o.subtotalETB)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatETB(comm)} ({Math.round(effRate * 100)}%)
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatETB(sellerNet)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatETB(o.deliveryFeeETB)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatETB(o.deliveryPartnerPayoutETB)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-[#166534] tabular-nums">
                      {formatETB(herbizRev)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
