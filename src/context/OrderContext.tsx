import React, { createContext, useContext, useEffect, useState } from "react";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { SEED_ORDERS } from "@/src/data/seedData";
import { calculateOrderFinancials } from "@/src/services/calculations";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/src/services/storage";
import type {
  DeliveryStatus,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  SellerItemStage,
} from "@/src/types";

interface PlaceOrderPayload {
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  paymentMethod: PaymentMethod;
  cartItems: { product: Product; quantity: number }[];
}

interface OrderContextValue {
  orders: Order[];
  placeOrder: (payload: PlaceOrderPayload) => Order;
  adminConfirmWithSellers: (orderId: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  sellerUpdateStage: (
    orderId: string,
    sellerId: string,
    stage: SellerItemStage,
    note?: string
  ) => void;
  adminAssignDelivery: (
    orderId: string,
    deliveryPartnerId: string,
    deliveryPartnerName: string,
    pickupInstructions: string
  ) => void;
  deliveryUpdateStatus: (
    orderId: string,
    deliveryStatus: DeliveryStatus,
    failureReason?: string
  ) => void;
  adminCompleteOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, actorName: string) => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS)
  );
  const { financeSettings, decrementProductStock } = useMarketplace();
  const { addNotification } = useNotifications();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  const placeOrder = (payload: PlaceOrderPayload): Order => {
    const orderNum = 1046 + orders.length;
    const orderId = `HBZ-${orderNum}`;
    const now = new Date().toISOString();

    const items: OrderItem[] = payload.cartItems.map(({ product, quantity }, idx) => ({
      id: `oi-${orderNum}-${idx + 1}`,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      sellerId: product.sellerId,
      sellerWorkshopLabel: product.sellerWorkshopLabel,
      quantity,
      unitPriceETB: product.priceETB,
      subtotalETB: product.priceETB * quantity,
      sellerStage: "Awaiting Confirmation",
    }));

    const subtotalETB = items.reduce((sum, item) => sum + item.subtotalETB, 0);
    const financials = calculateOrderFinancials(subtotalETB, financeSettings);

    const newOrder: Order = {
      id: orderId,
      customerId: payload.customerId,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryAddress: payload.deliveryAddress,
      city: payload.city,
      paymentMethod: payload.paymentMethod,
      items,
      subtotalETB: financials.subtotalETB,
      deliveryFeeETB: financials.customerDeliveryFeeETB,
      deliveryPartnerPayoutETB: financials.deliveryPartnerPayoutETB,
      commissionRate: financials.commissionRate,
      herbizCommissionETB: financials.herbizCommissionETB,
      sellerNetEarningsETB: financials.sellerNetEarningsETB,
      totalETB: financials.totalCustomerPayableETB,
      status: "Confirmation Pending",
      deliveryStatus: "Unassigned",
      adminCompleted: false,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          label: "Order Placed",
          actor: `${payload.customerName} (Customer)`,
          timestamp: now,
          note: `Payment: ${payload.paymentMethod}`,
        },
      ],
    };

    payload.cartItems.forEach(({ product, quantity }) => {
      decrementProductStock(product.id, quantity);
    });

    setOrders((prev) => [newOrder, ...prev]);

    addNotification({
      recipientRole: "admin",
      title: `New Customer Order · ${orderId}`,
      message: `${payload.customerName} placed an order totaling ${financials.totalCustomerPayableETB.toLocaleString()} ETB.`,
      relatedOrderId: orderId,
    });

    const uniqueSellerIds = Array.from(new Set(items.map((i) => i.sellerId)));
    uniqueSellerIds.forEach((sellerId) => {
      addNotification({
        recipientRole: "seller",
        recipientUserId: sellerId,
        title: `New Order Request via Herbiz · ${orderId}`,
        message: "Herbiz received a new order containing your product. Please confirm availability in Incoming Orders.",
        relatedOrderId: orderId,
      });
    });

    return newOrder;
  };

  const adminConfirmWithSellers = (orderId: string) => {
    const now = new Date().toISOString();
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Confirmed",
              updatedAt: now,
              timeline: [
                ...o.timeline,
                {
                  id: `tl-${Date.now()}`,
                  label: "Coordinated with Seller",
                  actor: "Herbiz Admin",
                  timestamp: now,
                  note: "Availability request sent to seller workshop.",
                },
              ],
            }
          : o
      )
    );

    const uniqueSellers = Array.from(new Set(target.items.map((i) => i.sellerId)));
    uniqueSellers.forEach((sellerId) => {
      addNotification({
        recipientRole: "seller",
        recipientUserId: sellerId,
        title: `Action Requested by Herbiz · ${orderId}`,
        message: "Please confirm stock and prepare items for courier pickup.",
        relatedOrderId: orderId,
      });
    });
  };

  const adminUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: now,
              timeline: [
                ...o.timeline,
                {
                  id: `tl-${Date.now()}`,
                  label: `Status updated to ${status}`,
                  actor: "Herbiz Admin",
                  timestamp: now,
                },
              ],
            }
          : o
      )
    );
  };

  const sellerUpdateStage = (
    orderId: string,
    sellerId: string,
    stage: SellerItemStage,
    note?: string
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = o.items.map((item) =>
          item.sellerId === sellerId
            ? {
                ...item,
                sellerStage: stage,
                preparationNote: note ?? item.preparationNote,
              }
            : item
        );

        let nextOrderStatus: OrderStatus = o.status;
        const allReady = updatedItems.every(
          (i) => i.sellerStage === "Ready for Pickup"
        );
        const anyPreparing = updatedItems.some(
          (i) =>
            i.sellerStage === "Preparing" ||
            i.sellerStage === "Ready for Pickup"
        );
        const allConfirmed = updatedItems.every(
          (i) => i.sellerStage !== "Awaiting Confirmation"
        );

        if (allReady) nextOrderStatus = "Ready for Pickup";
        else if (anyPreparing) nextOrderStatus = "Preparing";
        else if (allConfirmed) nextOrderStatus = "Confirmed";

        return {
          ...o,
          items: updatedItems,
          status: nextOrderStatus,
          updatedAt: now,
          timeline: [
            ...o.timeline,
            {
              id: `tl-${Date.now()}`,
              label: `Seller marked items ${stage}`,
              actor: "Seller Workshop (via Herbiz)",
              timestamp: now,
              note,
            },
          ],
        };
      })
    );

    addNotification({
      recipientRole: "admin",
      title: `Seller Update · ${orderId}`,
      message: `Seller marked items as "${stage}".`,
      relatedOrderId: orderId,
    });
  };

  const adminAssignDelivery = (
    orderId: string,
    deliveryPartnerId: string,
    deliveryPartnerName: string,
    pickupInstructions: string
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              deliveryPartnerId,
              deliveryPartnerName,
              deliveryStatus: "Assigned",
              pickupInstructions,
              updatedAt: now,
              timeline: [
                ...o.timeline,
                {
                  id: `tl-${Date.now()}`,
                  label: `Delivery Partner Assigned (${deliveryPartnerName})`,
                  actor: "Herbiz Admin",
                  timestamp: now,
                  note: pickupInstructions,
                },
              ],
            }
          : o
      )
    );

    addNotification({
      recipientRole: "delivery",
      recipientUserId: deliveryPartnerId,
      title: `New Delivery Assignment · ${orderId}`,
      message: `Pickup instructions: ${pickupInstructions}`,
      relatedOrderId: orderId,
    });
  };

  const deliveryUpdateStatus = (
    orderId: string,
    deliveryStatus: DeliveryStatus,
    failureReason?: string
  ) => {
    const now = new Date().toISOString();
    const target = orders.find((o) => o.id === orderId);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        let nextOrderStatus: OrderStatus = o.status;
        if (deliveryStatus === "Picked Up" || deliveryStatus === "In Transit") {
          nextOrderStatus = "Out for Delivery";
        } else if (deliveryStatus === "Delivered") {
          nextOrderStatus = "Delivered";
        }

        return {
          ...o,
          deliveryStatus,
          status: nextOrderStatus,
          failureReason:
            deliveryStatus === "Failed" ? failureReason : o.failureReason,
          updatedAt: now,
          timeline: [
            ...o.timeline,
            {
              id: `tl-${Date.now()}`,
              label: `Delivery ${deliveryStatus}`,
              actor: o.deliveryPartnerName
                ? `${o.deliveryPartnerName} (Delivery Partner)`
                : "Delivery Partner",
              timestamp: now,
              note: failureReason,
            },
          ],
        };
      })
    );

    if (target) {
      addNotification({
        recipientRole: "admin",
        title: `Delivery Update · ${orderId}`,
        message: `Delivery partner updated delivery status to "${deliveryStatus}".`,
        relatedOrderId: orderId,
      });
      if (deliveryStatus === "In Transit" || deliveryStatus === "Delivered") {
        addNotification({
          recipientRole: "customer",
          recipientUserId: target.customerId,
          title:
            deliveryStatus === "Delivered"
              ? `Order ${orderId} Delivered`
              : `Order ${orderId} is Out for Delivery`,
          message:
            deliveryStatus === "Delivered"
              ? "Your Herbiz parcel has been delivered. Thank you for supporting women entrepreneurs."
              : "Your order has been collected and is on its way to you.",
          relatedOrderId: orderId,
        });
      }
    }
  };

  const adminCompleteOrder = (orderId: string) => {
    const now = new Date().toISOString();
    const target = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const recalculated = calculateOrderFinancials(o.subtotalETB, financeSettings);
        return {
          ...o,
          status: "Delivered",
          deliveryStatus: "Delivered",
          adminCompleted: true,
          commissionRate: recalculated.commissionRate,
          herbizCommissionETB: recalculated.herbizCommissionETB,
          sellerNetEarningsETB: recalculated.sellerNetEarningsETB,
          updatedAt: now,
          timeline: [
            ...o.timeline,
            {
              id: `tl-${Date.now()}`,
              label: "Order Finalized & Earnings Settled",
              actor: "Herbiz Admin",
              timestamp: now,
              note: `Commission: ${recalculated.herbizCommissionETB} ETB · Seller Net: ${recalculated.sellerNetEarningsETB} ETB`,
            },
          ],
        };
      })
    );

    if (target) {
      const uniqueSellers = Array.from(new Set(target.items.map((i) => i.sellerId)));
      uniqueSellers.forEach((sellerId) => {
        addNotification({
          recipientRole: "seller",
          recipientUserId: sellerId,
          title: `Earnings Credited · ${orderId}`,
          message: "Order delivery completed and verified by Herbiz. Net earnings updated.",
          relatedOrderId: orderId,
        });
      });
    }
  };

  const cancelOrder = (orderId: string, actorName: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Cancelled",
              updatedAt: now,
              timeline: [
                ...o.timeline,
                {
                  id: `tl-${Date.now()}`,
                  label: "Order Cancelled",
                  actor: actorName,
                  timestamp: now,
                },
              ],
            }
          : o
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        adminConfirmWithSellers,
        adminUpdateOrderStatus,
        sellerUpdateStage,
        adminAssignDelivery,
        deliveryUpdateStatus,
        adminCompleteOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
