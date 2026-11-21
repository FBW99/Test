import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { SafeImage } from "@/src/components/common/SafeImage";
import { Button } from "@/src/components/ui/button";
import { formatETB } from "@/src/lib/utils";
import type { Product } from "@/src/types";

interface ProductCardProps {
  product: Product;
  detailPath: string;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  detailPath,
  onAddToCart,
}: ProductCardProps) {
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E5DC] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-[#243329] dark:bg-[#121A15] dark:hover:border-[#364D3E]">
      <Link
        to={detailPath}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2F2EA] dark:bg-[#18231C]"
      >
        <SafeImage
          src={product.imageUrl}
          alt={product.name}
          fallbackTitle={product.name}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-[#6B7280] dark:text-[#8A9990]">
          <span className="truncate">{product.category}</span>
          <span className="shrink-0 tabular-nums">
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>

        <Link to={detailPath} className="mt-1.5">
          <h3 className="font-display text-base font-semibold leading-snug text-[#1F2937] dark:text-[#F1F5F2] line-clamp-2 group-hover:text-[#166534] dark:group-hover:text-[#4ADE80] transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 text-sm text-[#4B5563] dark:text-[#B4C2B9] line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-[#F2F2EA] dark:border-[#1D2A22]">
          <span className="font-mono text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
            {formatETB(product.priceETB)}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={detailPath}
              className="text-xs font-medium text-[#4B5563] hover:text-[#166534] dark:text-[#B4C2B9] dark:hover:text-[#4ADE80] px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              Details
            </Link>
            {onAddToCart && (
              <Button
                type="button"
                size="sm"
                disabled={outOfStock}
                onClick={() => onAddToCart(product)}
              >
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
