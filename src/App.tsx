import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { MarketplaceProvider } from "@/src/context/MarketplaceContext";
import { NotificationProvider } from "@/src/context/NotificationContext";
import { OrderProvider } from "@/src/context/OrderContext";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { AppRoutes } from "@/src/routes/AppRoutes";

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="top-right" richColors closeButton />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <MarketplaceProvider>
              <CartProvider>
                <OrderProvider>
                  <AppRoutes />
                  <ThemedToaster />
                </OrderProvider>
              </CartProvider>
            </MarketplaceProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
