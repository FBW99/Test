import { useState } from "react";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { SafeImage } from "@/src/components/common/SafeImage";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Textarea } from "@/src/components/ui/textarea";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { cn, formatETB } from "@/src/lib/utils";
import type { Product, ProductApprovalStatus } from "@/src/types";

export function AdminProductsPage() {
  const {
    products,
    approveProduct,
    rejectProduct,
    updateProduct,
    deleteProduct,
  } = useMarketplace();
  const { addNotification } = useNotifications();

  const [filter, setFilter] = useState<"all" | ProductApprovalStatus>("all");
  const [rejecting, setRejecting] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [editing, setEditing] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const visibleProducts = products.filter(
    (p) => filter === "all" || p.status === filter
  );

  const handleApprove = (product: Product) => {
    approveProduct(product.id);
    addNotification({
      recipientRole: "seller",
      recipientUserId: product.sellerId,
      title: `Product Approved: ${product.name}`,
      message: "Your product is now live in the Herbiz Marketplace.",
    });
    toast.success(`"${product.name}" published to marketplace`);
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejecting) return;
    const reason = rejectReason.trim() || "Please update photos or description.";
    rejectProduct(rejecting.id, reason);
    addNotification({
      recipientRole: "seller",
      recipientUserId: rejecting.sellerId,
      title: `Product Needs Updates: ${rejecting.name}`,
      message: reason,
    });
    toast.success(`Returned "${rejecting.name}" with feedback`);
    setRejecting(null);
    setRejectReason("");
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setEditName(p.name);
    setEditPrice(String(p.priceETB));
    setEditDesc(p.description);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateProduct(editing.id, {
      name: editName.trim(),
      priceETB: Math.max(1, Number(editPrice) || editing.priceETB),
      description: editDesc.trim(),
    });
    toast.success("Product details updated by Admin");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Product Approval" },
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
              Product Quality & Publishing
            </h1>
            <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
              Only approved products appear in the public customer marketplace.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-white dark:bg-[#121A15] self-start">
            {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md capitalize cursor-pointer transition-colors",
                  filter === tab
                    ? "bg-[#166534] dark:bg-[#1E7A40] text-white"
                    : "text-[#4B5563] dark:text-[#B4C2B9] hover:text-[#1F2937] dark:hover:text-[#F1F5F2]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Workshop</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-14 shrink-0 overflow-hidden rounded-md bg-[#F2F2EA] dark:bg-[#18231C]">
                      <SafeImage
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full"
                      />
                    </div>
                    <span className="font-semibold text-[#1F2937] dark:text-[#F1F5F2] max-w-[200px] truncate">
                      {p.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-[#4B5563] dark:text-[#B4C2B9]">
                  {p.category}
                </TableCell>
                <TableCell className="text-xs text-[#6B7280] dark:text-[#8A9990] max-w-[160px] truncate">
                  {p.sellerWorkshopLabel}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  {formatETB(p.priceETB)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {p.stock}
                </TableCell>
                <TableCell>
                  <StatusText
                    status={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {p.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(p)}
                        title="Approve and publish"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Approve</span>
                      </Button>
                    )}
                    {p.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRejecting(p);
                          setRejectReason("");
                        }}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Reject</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Edit ${p.name}`}
                      onClick={() => openEdit(p)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Remove ${p.name}`}
                      className="text-[#B91C1C] dark:text-[#F87171]"
                      onClick={() => setDeletingId(p.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Reject Reason Modal */}
      <Dialog
        open={Boolean(rejecting)}
        onOpenChange={(open) => !open && setRejecting(null)}
      >
        <DialogContent onClose={() => setRejecting(null)}>
          <DialogHeader>
            <DialogTitle>Reject Product Submission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRejectConfirm} className="space-y-4">
            <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
              Explain what {rejecting?.name} needs before publishing so the entrepreneur can fix and resubmit.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="rejReason">Reason / Guidance</Label>
              <Textarea
                id="rejReason"
                required
                placeholder="e.g. Please upload a brighter daylight photo and clarify dimensions."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejecting(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Edit Modal */}
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent onClose={() => setEditing(null)}>
          <DialogHeader>
            <DialogTitle>Edit Listing Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admEdName">Name</Label>
              <Input
                id="admEdName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admEdPrice">Price (ETB)</Label>
              <Input
                id="admEdPrice"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admEdDesc">Description</Label>
              <Textarea
                id="admEdDesc"
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
        title="Remove Product Permanently?"
        description="This immediately removes the product from the marketplace and seller catalog."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (deletingId) {
            deleteProduct(deletingId);
            toast.success("Product removed from platform");
          }
        }}
      />
    </div>
  );
}
