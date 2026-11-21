import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { EmptyState } from "@/src/components/common/EmptyState";
import { SafeImage } from "@/src/components/common/SafeImage";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useCart } from "@/src/context/CartContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { formatETB } from "@/src/lib/utils";

export function CartPage() {
  const { products, financeSettings } = useMarketplace();
  const { hydrateCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const items = hydrateCart(products);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotalETB, 0);
  const deliveryFee = items.length > 0 ? financeSettings.customerDeliveryFeeETB : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "Shopping Cart" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Your Shopping Cart
        </h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse handcrafted clothing, baskets, natural skincare, and specialty foods made by women entrepreneurs."
          actionLabel="Explore Marketplace"
          onAction={() => navigate("/customer/shop")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity, lineTotalETB }) => (
              <Card key={product.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-[#F2F2EA] dark:bg-[#18231C]">
                    <SafeImage
                      src={product.imageUrl}
                      alt={product.name}
                      fallbackTitle={product.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#6B7280] dark:text-[#8A9990]">{product.category}</p>
                    <h2 className="font-display text-base font-semibold text-[#1F2937] dark:text-[#F1F5F2] truncate">
                      {product.name}
                    </h2>
                    <p className="mt-1 font-mono text-sm text-[#4B5563] dark:text-[#B4C2B9] tabular-nums">
                      {formatETB(product.priceETB)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="inline-flex items-center rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] dark:border-[#243329] dark:bg-[#0F1612]">
                      <button
                        type="button"
                        aria-label="Decrease item quantity"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="h-8 w-8 flex items-center justify-center text-[#4B5563] hover:text-[#1F2937] dark:text-[#B4C2B9] dark:hover:text-[#F1F5F2] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase item quantity"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            Math.min(product.stock, quantity + 1)
                          )
                        }
                        className="h-8 w-8 flex items-center justify-center text-[#4B5563] hover:text-[#1F2937] dark:text-[#B4C2B9] dark:hover:text-[#F1F5F2] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="w-24 text-right font-mono text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
                      {formatETB(lineTotalETB)}
                    </span>

                    <button
                      type="button"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-[#6B7280] hover:text-[#B91C1C] dark:text-[#8A9990] dark:hover:text-[#F87171] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-[#4B5563] dark:text-[#B4C2B9]">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
                  {formatETB(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#4B5563] dark:text-[#B4C2B9]">
                <span>Herbiz Managed Delivery</span>
                <span className="font-mono font-medium text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
                  {formatETB(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-[#E5E5DC] dark:border-[#243329] pt-3 flex items-center justify-between text-base font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                <span>Total</span>
                <span className="font-mono text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  {formatETB(total)}
                </span>
              </div>

              <div className="pt-3 space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/customer/checkout")}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/customer/shop")}
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
