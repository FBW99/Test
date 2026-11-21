import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Store } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { EmptyState } from "@/src/components/common/EmptyState";
import { ProductCard } from "@/src/components/marketplace/ProductCard";
import { Input } from "@/src/components/ui/input";
import { Select } from "@/src/components/ui/select";
import { useCart } from "@/src/context/CartContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { PRODUCT_CATEGORIES } from "@/src/data/seedData";
import { cn } from "@/src/lib/utils";
import type { Product } from "@/src/types";

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const initialQ = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [search, setSearch] = useState(initialQ);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );

  const { approvedProducts } = useMarketplace();
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = approvedProducts.filter((p) => {
      const catMatch =
        selectedCategory === "All" || p.category === selectedCategory;
      const textMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.priceETB - b.priceETB);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.priceETB - a.priceETB);
    }
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [approvedProducts, search, selectedCategory, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleAdd = (product: Product) => {
    addToCart(product.id, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "Marketplace" },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
              Herbiz Marketplace
            </h1>
            <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
              Approved artisan creations managed from workshop to doorstep.
            </p>
          </div>
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#8A9990] tabular-nums">
            Showing {filteredProducts.length} product(s)
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="space-y-4 rounded-xl border border-[#E5E5DC] bg-white p-4 dark:border-[#243329] dark:bg-[#121A15]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] dark:text-[#8A9990]"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name, material, or category..."
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-52">
            <Select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "featured" | "price-asc" | "price-desc"
                )
              }
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["All", ...PRODUCT_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-[#166534] text-white dark:bg-[#15803D]"
                  : "bg-[#FAFAF5] text-[#4B5563] hover:bg-[#F2F2EA] hover:text-[#1F2937] dark:bg-[#0F1612] dark:text-[#B4C2B9] dark:hover:bg-[#18231C] dark:hover:text-[#F1F5F2]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No matching products found"
          description="Try clearing your search terms or selecting another product category."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch("");
            handleCategoryChange("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailPath={`/customer/product/${product.id}`}
              onAddToCart={handleAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
