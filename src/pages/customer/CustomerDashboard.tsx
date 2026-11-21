import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { ProductCard } from "@/src/components/marketplace/ProductCard";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useOrders } from "@/src/context/OrderContext";
import { PRODUCT_CATEGORIES } from "@/src/data/seedData";
import { formatETB, formatShortDate } from "@/src/lib/utils";
import type { Product } from "@/src/types";

export function CustomerDashboard() {
  const { currentUser } = useAuth();
  const { approvedProducts } = useMarketplace();
  const { addToCart } = useCart();
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const myOrders = orders.filter((o) => o.customerId === currentUser?.id);
  const featured = approvedProducts.filter((p) => p.featured).slice(0, 3);
  const recommended = approvedProducts.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/customer/shop?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleAdd = (product: Product) => {
    addToCart(product.id, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumbs items={[{ label: "Customer Portal" }, { label: "Home" }]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Welcome, {currentUser?.fullName.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-[#4B5563]">
              Every item is verified by Herbiz and delivered straight from women entrepreneurs.
            </p>
          </div>
          <Button onClick={() => navigate("/customer/shop")}>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Browse Full Marketplace</span>
          </Button>
        </div>
      </div>

      {/* Quick Search & Category Browse */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]"
                aria-hidden="true"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shawls, baskets, organic skincare, highland honey..."
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#6B7280] mr-1">
              Categories:
            </span>
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  navigate(
                    `/customer/shop?category=${encodeURIComponent(category)}`
                  )
                }
                className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] px-3 py-1.5 text-xs font-medium text-[#1F2937] hover:border-[#166534] hover:text-[#166534] transition-colors cursor-pointer"
              >
                {category}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promotional Banner */}
      <div className="rounded-xl border border-[#166534]/20 bg-[#166534] p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#BBF7D0]">
            Managed Delivery Guarantee
          </p>
          <h2 className="font-display text-lg sm:text-xl font-bold">
            Flat 50 ETB City Delivery Across Addis Ababa
          </h2>
          <p className="text-sm text-white/85 max-w-xl">
            Herbiz coordinates workshop pickup and courier drop-off so your order arrives safely with real-time updates.
          </p>
        </div>
        <Button
          variant="amber"
          onClick={() => navigate("/customer/shop")}
          className="shrink-0"
        >
          Shop Curated Goods
        </Button>
      </div>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#1F2937]">
            Featured Products
          </h2>
          <Link
            to="/customer/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#166534] hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(featured.length > 0 ? featured : recommended).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailPath={`/customer/product/${product.id}`}
              onAddToCart={handleAdd}
            />
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Your Recent Orders</CardTitle>
          <Link
            to="/customer/orders"
            className="text-xs font-medium text-[#166534] hover:underline"
          >
            See all orders
          </Link>
        </CardHeader>
        <CardContent>
          {myOrders.length === 0 ? (
            <p className="text-sm text-[#4B5563] py-4">
              You have not placed an order yet. Explore the marketplace to get started.
            </p>
          ) : (
            <div className="divide-y divide-[#E5E5DC]">
              {myOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <Link
                      to={`/customer/orders/${order.id}`}
                      className="font-mono text-sm font-semibold text-[#166534] hover:underline"
                    >
                      {order.id}
                    </Link>
                    <p className="text-xs text-[#6B7280]">
                      {formatShortDate(order.createdAt)} · {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusText status={order.status} />
                    <span className="font-mono text-sm font-semibold text-[#1F2937] tabular-nums">
                      {formatETB(order.totalETB)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
