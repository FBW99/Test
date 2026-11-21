import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/src/components/layout/AdminLayout";
import { CustomerLayout } from "@/src/components/layout/CustomerLayout";
import { DeliveryLayout } from "@/src/components/layout/DeliveryLayout";
import { PublicLayout } from "@/src/components/layout/PublicLayout";
import { SellerLayout } from "@/src/components/layout/SellerLayout";
import { AdminAnalyticsPage } from "@/src/pages/admin/AdminAnalyticsPage";
import { AdminCustomersPage } from "@/src/pages/admin/AdminCustomersPage";
import { AdminDashboard } from "@/src/pages/admin/AdminDashboard";
import { AdminDeliveriesPage } from "@/src/pages/admin/AdminDeliveriesPage";
import { AdminFinancePage } from "@/src/pages/admin/AdminFinancePage";
import { AdminOrdersPage } from "@/src/pages/admin/AdminOrdersPage";
import { AdminProductsPage } from "@/src/pages/admin/AdminProductsPage";
import { AdminSellersPage } from "@/src/pages/admin/AdminSellersPage";
import { ForgotPasswordPage } from "@/src/pages/auth/ForgotPasswordPage";
import { LoginPage } from "@/src/pages/auth/LoginPage";
import { RegisterPage } from "@/src/pages/auth/RegisterPage";
import { CartPage } from "@/src/pages/customer/CartPage";
import { CheckoutPage } from "@/src/pages/customer/CheckoutPage";
import { CustomerDashboard } from "@/src/pages/customer/CustomerDashboard";
import { CustomerOrderDetailPage } from "@/src/pages/customer/CustomerOrderDetailPage";
import { CustomerOrdersPage } from "@/src/pages/customer/CustomerOrdersPage";
import { CustomerProfilePage } from "@/src/pages/customer/CustomerProfilePage";
import { ProductDetailsPage } from "@/src/pages/customer/ProductDetailsPage";
import { ShopPage } from "@/src/pages/customer/ShopPage";
import { DeliveryAssignmentsPage } from "@/src/pages/delivery/DeliveryAssignmentsPage";
import { DeliveryDashboard } from "@/src/pages/delivery/DeliveryDashboard";
import { DeliveryHistoryPage } from "@/src/pages/delivery/DeliveryHistoryPage";
import { DeliveryProfilePage } from "@/src/pages/delivery/DeliveryProfilePage";
import { LandingPage } from "@/src/pages/public/LandingPage";
import { NotFoundPage } from "@/src/pages/public/NotFoundPage";
import { SellerAddProductPage } from "@/src/pages/seller/SellerAddProductPage";
import { SellerDashboard } from "@/src/pages/seller/SellerDashboard";
import { SellerEarningsPage } from "@/src/pages/seller/SellerEarningsPage";
import { SellerOrdersPage } from "@/src/pages/seller/SellerOrdersPage";
import { SellerProductsPage } from "@/src/pages/seller/SellerProductsPage";
import { SellerProfilePage } from "@/src/pages/seller/SellerProfilePage";
import {
  GuestOnlyRoute,
  ProtectedRoute,
  RoleProtectedRoute,
} from "@/src/routes/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Protected Role Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Customer */}
        <Route element={<RoleProtectedRoute allowedRole="customer" />}>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
            <Route path="orders/:id" element={<CustomerOrderDetailPage />} />
            <Route path="profile" element={<CustomerProfilePage />} />
          </Route>
        </Route>

        {/* Seller / Woman Entrepreneur */}
        <Route element={<RoleProtectedRoute allowedRole="seller" />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="products/new" element={<SellerAddProductPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="earnings" element={<SellerEarningsPage />} />
            <Route path="profile" element={<SellerProfilePage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sellers" element={<AdminSellersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="deliveries" element={<AdminDeliveriesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>
        </Route>

        {/* Delivery Partner */}
        <Route element={<RoleProtectedRoute allowedRole="delivery" />}>
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<DeliveryDashboard />} />
            <Route path="assignments" element={<DeliveryAssignmentsPage />} />
            <Route path="history" element={<DeliveryHistoryPage />} />
            <Route path="profile" element={<DeliveryProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
