import type { FinanceSettings, Order } from "@/src/types";

export const DEFAULT_FINANCE_SETTINGS: FinanceSettings = {
  commissionRate: 0.1, // 10%
  customerDeliveryFeeETB: 50,
  deliveryPartnerPayoutETB: 35,
};

export interface OrderFinancialBreakdown {
  subtotalETB: number;
  commissionRate: number;
  herbizCommissionETB: number;
  sellerNetEarningsETB: number;
  customerDeliveryFeeETB: number;
  deliveryPartnerPayoutETB: number;
  herbizDeliveryMarginETB: number;
  totalCustomerPayableETB: number;
  herbizNetRevenueETB: number;
}

export function calculateOrderFinancials(
  subtotalETB: number,
  settings: FinanceSettings
): OrderFinancialBreakdown {
  const commissionRate = Math.max(0, Math.min(0.5, settings.commissionRate));
  const herbizCommissionETB = Math.round(subtotalETB * commissionRate);
  const sellerNetEarningsETB = Math.max(0, subtotalETB - herbizCommissionETB);

  const customerDeliveryFeeETB = Math.max(0, settings.customerDeliveryFeeETB);
  const deliveryPartnerPayoutETB = Math.max(
    0,
    Math.min(customerDeliveryFeeETB, settings.deliveryPartnerPayoutETB)
  );
  const herbizDeliveryMarginETB = Math.max(
    0,
    customerDeliveryFeeETB - deliveryPartnerPayoutETB
  );

  return {
    subtotalETB,
    commissionRate,
    herbizCommissionETB,
    sellerNetEarningsETB,
    customerDeliveryFeeETB,
    deliveryPartnerPayoutETB,
    herbizDeliveryMarginETB,
    totalCustomerPayableETB: subtotalETB + customerDeliveryFeeETB,
    herbizNetRevenueETB: herbizCommissionETB + herbizDeliveryMarginETB,
  };
}

export interface AggregateFinancialSummary {
  grossMerchandiseSalesETB: number;
  totalCustomerBilledETB: number;
  totalHerbizCommissionETB: number;
  totalDeliveryFeesCollectedETB: number;
  totalDeliveryPartnerPayoutsETB: number;
  totalHerbizDeliveryMarginETB: number;
  totalHerbizRevenueETB: number;
  totalSellerNetEarningsETB: number;
  activeOrderCount: number;
  completedOrderCount: number;
}

export function summarizeOrdersFinancials(
  orders: Order[],
  currentSettings?: FinanceSettings
): AggregateFinancialSummary {
  const validOrders = orders.filter((o) => o.status !== "Cancelled");

  return validOrders.reduce<AggregateFinancialSummary>(
    (acc, order) => {
      // If currentSettings is provided and order isn't finalized/completed yet, recalculate dynamically
      // Completed orders preserve their locked rate, or if recalculating live ledger we reflect active rate
      const effectiveRate =
        !order.adminCompleted && currentSettings
          ? currentSettings.commissionRate
          : order.commissionRate;

      const commission = Math.round(order.subtotalETB * effectiveRate);
      const sellerNet = Math.max(0, order.subtotalETB - commission);
      const deliveryMargin = Math.max(
        0,
        order.deliveryFeeETB - order.deliveryPartnerPayoutETB
      );

      acc.grossMerchandiseSalesETB += order.subtotalETB;
      acc.totalCustomerBilledETB += order.totalETB;
      acc.totalHerbizCommissionETB += commission;
      acc.totalDeliveryFeesCollectedETB += order.deliveryFeeETB;
      acc.totalDeliveryPartnerPayoutsETB += order.deliveryPartnerPayoutETB;
      acc.totalHerbizDeliveryMarginETB += deliveryMargin;
      acc.totalHerbizRevenueETB += commission + deliveryMargin;
      acc.totalSellerNetEarningsETB += sellerNet;
      acc.activeOrderCount += 1;
      if (order.status === "Delivered" || order.adminCompleted) {
        acc.completedOrderCount += 1;
      }
      return acc;
    },
    {
      grossMerchandiseSalesETB: 0,
      totalCustomerBilledETB: 0,
      totalHerbizCommissionETB: 0,
      totalDeliveryFeesCollectedETB: 0,
      totalDeliveryPartnerPayoutsETB: 0,
      totalHerbizDeliveryMarginETB: 0,
      totalHerbizRevenueETB: 0,
      totalSellerNetEarningsETB: 0,
      activeOrderCount: 0,
      completedOrderCount: 0,
    }
  );
}
