import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
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
import { Select } from "@/src/components/ui/select";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useOrders } from "@/src/context/OrderContext";
import { calculateOrderFinancials } from "@/src/services/calculations";
import { formatETB } from "@/src/lib/utils";
import type { PaymentMethod } from "@/src/types";

export function CheckoutPage() {
  const { currentUser } = useAuth();
  const { products, financeSettings } = useMarketplace();
  const { hydrateCart, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const items = hydrateCart(products);
  const subtotal = items.reduce((sum, i) => sum + i.lineTotalETB, 0);
  const breakdown = calculateOrderFinancials(subtotal, financeSettings);

  const [customerName, setCustomerName] = useState(currentUser?.fullName || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || ""
  );
  const [city, setCity] = useState(currentUser?.city || "Addis Ababa");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Cash on Delivery");

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "Checkout" },
          ]}
        />
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-base font-medium text-[#1F2937] dark:text-[#F1F5F2]">
              Your cart is empty. Add products before checking out.
            </p>
            <Button onClick={() => navigate("/customer/shop")}>
              Browse Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      toast.error("Please fill in your name, phone number, and delivery address.");
      return;
    }

    const order = placeOrder({
      customerId: currentUser.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      city: city.trim(),
      paymentMethod,
      cartItems: items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
      })),
    });

    clearCart();
    toast.success(`Order ${order.id} confirmed! Herbiz is coordinating your items.`);
    navigate(`/customer/orders/${order.id}`, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "Cart", to: "/customer/cart" },
            { label: "Checkout" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handleConfirmOrder}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
      >
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Delivery & Payment Details</CardTitle>
            <CardDescription>
              Herbiz handles product collection and assigns a verified delivery partner to your address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="chkName">Recipient Name</Label>
                <Input
                  id="chkName"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="chkPhone">Phone Number</Label>
                <Input
                  id="chkPhone"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="chkAddress">Delivery Street / Sub-city / Landmark</Label>
                <Input
                  id="chkAddress"
                  required
                  placeholder="e.g. Kazanchis, Street 14, Apt 3B"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="chkCity">City</Label>
                <Input
                  id="chkCity"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="chkPayment">Payment Method</Label>
              <Select
                id="chkPayment"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Mobile Money (Demo)">Mobile Money</option>
              </Select>
            </div>

            <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-3.5 flex items-start gap-2.5 text-xs text-[#4B5563] dark:border-[#243329] dark:bg-[#0F1612] dark:text-[#B4C2B9]">
              <ShieldCheck className="h-4 w-4 text-[#166534] dark:text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Your order is managed centrally by Herbiz. Once placed, our team confirms availability with the makers and dispatches a courier.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y divide-[#F2F2EA] dark:divide-[#1D2A22] text-sm">
              {items.map(({ product, quantity, lineTotalETB }) => (
                <div
                  key={product.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#1F2937] dark:text-[#F1F5F2] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-[#8A9990]">Qty: {quantity}</p>
                  </div>
                  <span className="font-mono font-medium text-[#1F2937] dark:text-[#F1F5F2] tabular-nums shrink-0">
                    {formatETB(lineTotalETB)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E5E5DC] dark:border-[#243329] pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#4B5563] dark:text-[#B4C2B9]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">
                  {formatETB(breakdown.subtotalETB)}
                </span>
              </div>
              <div className="flex justify-between text-[#4B5563] dark:text-[#B4C2B9]">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums">
                  {formatETB(breakdown.customerDeliveryFeeETB)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1F2937] dark:text-[#F1F5F2] pt-2 border-t border-[#E5E5DC] dark:border-[#243329]">
                <span>Total Payable</span>
                <span className="font-mono text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  {formatETB(breakdown.totalCustomerPayableETB)}
                </span>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Confirm Order
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
