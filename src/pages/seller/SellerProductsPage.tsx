import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Package, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { EmptyState } from "@/src/components/common/EmptyState";
import { SafeImage } from "@/src/components/common/SafeImage";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { formatETB } from "@/src/lib/utils";
import type { Product } from "@/src/types";

export function SellerProductsPage() {
  const { currentUser } = useAuth();
  const { products, updateProduct, deleteProduct } = useMarketplace();
  const navigate = useNavigate();

  const [editing, setEditing] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const myProducts = products.filter((p) => p.sellerId === currentUser?.id);

  const openEdit = (product: Product) => {
    setEditing(product);
    setEditName(product.name);
    setEditPrice(String(product.priceETB));
    setEditStock(String(product.stock));
    setEditDesc(product.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateProduct(editing.id, {
      name: editName.trim(),
      priceETB: Math.max(1, Number(editPrice) || editing.priceETB),
      stock: Math.max(0, Number(editStock) || 0),
      description: editDesc.trim(),
    });
    toast.success("Product details updated");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Seller Studio", to: "/seller" },
            { label: "My Products" },
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1F2937]">
              My Products
            </h1>
            <p className="text-sm text-[#4B5563]">
              Products approved by Herbiz are automatically published to shoppers.
            </p>
          </div>
          <Button onClick={() => navigate("/seller/products/new")}>
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {myProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products submitted yet"
          description="Submit your first handcrafted item. Herbiz will review it and publish it to customers."
          actionLabel="Add First Product"
          onAction={() => navigate("/seller/products/new")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full bg-[#F2F2EA]">
                <SafeImage
                  src={product.imageUrl}
                  alt={product.name}
                  fallbackTitle={product.name}
                  className="h-full w-full"
                />
              </div>
              <CardContent className="p-4 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#6B7280] truncate">
                    {product.category}
                  </span>
                  <StatusText
                    status={
                      product.status.charAt(0).toUpperCase() +
                      product.status.slice(1)
                    }
                  />
                </div>

                <h2 className="font-display text-base font-semibold text-[#1F2937] line-clamp-2">
                  {product.name}
                </h2>

                {product.status === "rejected" && product.rejectionReason && (
                  <p className="rounded-lg bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
                    Review note: {product.rejectionReason}
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-[#F2F2EA] flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#1F2937] tabular-nums">
                      {formatETB(product.priceETB)}
                    </p>
                    <p className="text-xs text-[#6B7280] tabular-nums">
                      Stock: {product.stock}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(product)}
                    >
                      <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => setDeletingId(product.id)}
                      className="text-[#B91C1C] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent onClose={() => setEditing(null)}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edName">Product Name</Label>
              <Input
                id="edName"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edPrice">Price (ETB)</Label>
                <Input
                  id="edPrice"
                  type="number"
                  min={1}
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edStock">Stock Quantity</Label>
                <Input
                  id="edStock"
                  type="number"
                  min={0}
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edDesc">Description</Label>
              <Textarea
                id="edDesc"
                required
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Remove Product?"
        description="This removes the product listing from your studio and the marketplace."
        confirmLabel="Remove Product"
        destructive
        onConfirm={() => {
          if (deletingId) {
            deleteProduct(deletingId);
            toast.success("Product removed");
          }
        }}
      />
    </div>
  );
}
