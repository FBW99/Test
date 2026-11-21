import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { MarketplaceProvider } from "@/src/context/MarketplaceContext";
import { NotificationProvider } from "@/src/context/NotificationContext";
import { OrderProvider } from "@/src/context/OrderContext";
import { AppRoutes } from "@/src/routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <MarketplaceProvider>
            <CartProvider>
              <OrderProvider>
                <AppRoutes />
                <Toaster position="top-right" richColors closeButton />
              </OrderProvider>
            </CartProvider>
          </MarketplaceProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
