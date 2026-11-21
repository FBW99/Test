import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { SafeImage } from "@/src/components/common/SafeImage";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { formatETB, formatShortDate } from "@/src/lib/utils";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { approvedProducts, reviews, addReview } = useMarketplace();
  const { addToCart } = useCart();
  const { createSupportInquiry } = useNotifications();

  const product = approvedProducts.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  if (!product) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/customer/shop")}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Marketplace</span>
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-base font-semibold text-[#1F2937]">
              Product not found or currently pending review.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const maxQty = Math.max(1, product.stock);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product.id, quantity);
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(
      product.id,
      currentUser?.fullName || "Herbiz Customer",
      reviewRating,
      reviewComment.trim()
    );
    setReviewComment("");
    toast.success("Thank you for sharing your review!");
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !inquirySubject.trim() || !inquiryMessage.trim()) return;
    createSupportInquiry({
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      subject: `${product.name}: ${inquirySubject.trim()}`,
      message: inquiryMessage.trim(),
    });
    setInquirySubject("");
    setInquiryMessage("");
    setInquiryOpen(false);
    toast.success("Your question was sent to the Herbiz coordination team.");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "Marketplace", to: "/customer/shop" },
            { label: product.name },
          ]}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/customer/shop")}
          className="px-0 text-[#4B5563] hover:text-[#166534]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Marketplace</span>
        </Button>
      </div>

      {/* Contiguous Product Gallery + Purchase Module */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 overflow-hidden rounded-xl border border-[#E5E5DC] bg-[#F2F2EA]">
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            fallbackTitle={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <Card className="lg:col-span-5">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#6B7280]">
                {product.category} ·{" "}
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </p>
              <h1 className="font-display text-2xl font-bold text-[#1F2937] leading-snug">
                {product.name}
              </h1>
              <p className="font-mono text-2xl font-bold text-[#166534] tabular-nums">
                {formatETB(product.priceETB)}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-[#4B5563]">
              {product.description}
            </p>

            {/* Managed Seller Info (Strict Rule: Zero direct seller contact) */}
            <div className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#166534]">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Verified Maker · Managed by Herbiz</span>
              </div>
              <p className="text-sm font-medium text-[#1F2937]">
                {product.sellerWorkshopLabel}
              </p>
              <p className="text-xs text-[#6B7280]">
                All quality checks, order preparation, and questions are handled directly by the Herbiz team.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInquiryOpen(true)}
                className="mt-1"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ask Herbiz About This Product</span>
              </Button>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 pt-2 border-t border-[#E5E5DC]">
              <div className="flex items-center justify-between">
                <Label>Quantity</Label>
                <div className="inline-flex items-center rounded-lg border border-[#E5E5DC] bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 flex items-center justify-center text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    className="h-9 w-9 flex items-center justify-center text-[#4B5563] hover:text-[#1F2937] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>
                  {product.stock > 0
                    ? `Add to Cart · ${formatETB(product.priceETB * quantity)}`
                    : "Currently Out of Stock"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Reviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">
              Customer Reviews ({productReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productReviews.length === 0 ? (
              <p className="text-sm text-[#6B7280]">
                No reviews yet. Be the first to review this handcrafted product.
              </p>
            ) : (
              productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border-b border-[#F2F2EA] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1F2937]">
                      {rev.customerName}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {formatShortDate(rev.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-[#4B5563]">{rev.comment}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className="p-1 cursor-pointer"
                      aria-label={`Rate ${num} stars`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          num <= reviewRating
                            ? "text-[#F59E0B] fill-current"
                            : "text-[#D1D5DB]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reviewComment">Your Experience</Label>
                <Textarea
                  id="reviewComment"
                  required
                  placeholder="Share product quality or delivery feedback..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" className="w-full">
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Ask Herbiz Dialog */}
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent onClose={() => setInquiryOpen(false)}>
          <DialogHeader>
            <DialogTitle>Ask Herbiz About This Product</DialogTitle>
            <DialogDescription>
              Your message goes directly to Herbiz support. Our coordinators check with the artisan workshop and reply to you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="inqSubject">Topic</Label>
              <Input
                id="inqSubject"
                required
                placeholder="e.g. Custom sizing, ingredients, or gift packaging"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inqMsg">Message</Label>
              <Textarea
                id="inqMsg"
                required
                placeholder="Write your question for our coordination team..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInquiryOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send to Herbiz</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
