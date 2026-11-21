export type UserRole = "customer" | "seller" | "delivery" | "admin";

export type AccountStatus = "active" | "pending" | "suspended" | "rejected";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: AccountStatus;
  city?: string;
  address?: string;
  businessName?: string;
  businessBio?: string;
  vehicleType?: string;
  joinedAt: string;
}

export type ProductCategory =
  | "Fashion"
  | "Handmade Crafts"
  | "Beauty and Personal Care"
  | "Food Products"
  | "Home and Decoration"
  | "Accessories";

export type ProductApprovalStatus = "pending" | "approved" | "rejected";

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerWorkshopLabel: string; // Public-safe alias managed by Herbiz (no direct seller contact)
  name: string;
  category: ProductCategory;
  description: string;
  priceETB: number;
  stock: number;
  imageUrl: string;
  status: ProductApprovalStatus;
  rejectionReason?: string;
  featured?: boolean;
  createdAt: string;
}

export type OrderStatus =
  | "Order Placed"
  | "Confirmation Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready for Pickup"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type SellerItemStage =
  | "Awaiting Confirmation"
  | "Confirmed"
  | "Preparing"
  | "Ready for Pickup";

export type DeliveryStatus =
  | "Unassigned"
  | "Assigned"
  | "Accepted"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Failed";

export type PaymentMethod = "Cash on Delivery" | "Mobile Money (Demo)";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerId: string;
  sellerWorkshopLabel: string;
  quantity: number;
  unitPriceETB: number;
  subtotalETB: number;
  sellerStage: SellerItemStage;
  preparationNote?: string;
}

export interface OrderTimelineEvent {
  id: string;
  label: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotalETB: number;
  deliveryFeeETB: number;
  deliveryPartnerPayoutETB: number;
  commissionRate: number; // e.g., 0.10 for 10%
  herbizCommissionETB: number;
  sellerNetEarningsETB: number;
  totalETB: number;
  status: OrderStatus;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryStatus: DeliveryStatus;
  pickupInstructions?: string;
  failureReason?: string;
  adminCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface AppNotification {
  id: string;
  recipientRole: UserRole | "all";
  recipientUserId?: string;
  title: string;
  message: string;
  relatedOrderId?: string;
  read: boolean;
  createdAt: string;
}

export interface SupportInquiry {
  id: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  subject: string;
  message: string;
  status: "Open" | "Resolved";
  adminReply?: string;
  createdAt: string;
}

export interface FinanceSettings {
  commissionRate: number; // Default 0.10 (10%)
  customerDeliveryFeeETB: number; // Default 50
  deliveryMarginRate: number; // Default 0.15 (15%)
  deliveryPartnerPayoutETB: number; // Derived from fee * (1 - deliveryMarginRate), default 42
}
