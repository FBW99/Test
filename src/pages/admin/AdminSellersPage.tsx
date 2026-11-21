import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { formatETB, formatShortDate } from "@/src/lib/utils";
import type { User } from "@/src/types";

export function AdminSellersPage() {
  const { users, adminUpdateUserStatus } = useAuth();
  const { products } = useMarketplace();
  const { addNotification } = useNotifications();

  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);

  const sellers = users.filter((u) => u.role === "seller");

  const handleStatusChange = (
    seller: User,
    nextStatus: "active" | "rejected" | "suspended"
  ) => {
    adminUpdateUserStatus(seller.id, nextStatus);
    addNotification({
      recipientRole: "seller",
      recipientUserId: seller.id,
      title: `Seller Account ${nextStatus === "active" ? "Approved" : nextStatus}`,
      message:
        nextStatus === "active"
          ? "Your Herbiz seller studio is now active! Submitted products can be approved for the marketplace."
          : `Your seller account status was updated to ${nextStatus} by Herbiz Admin.`,
    });
    toast.success(`${seller.fullName} marked as ${nextStatus}`);
  };

  const sellerProducts = selectedSeller
    ? products.filter((p) => p.sellerId === selectedSeller.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Seller Management" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Women Entrepreneurs & Workshops
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
          Approve new seller registrations, inspect product catalogs, or manage workshop status.
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entrepreneur</TableHead>
              <TableHead>Workshop</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => {
              const count = products.filter(
                (p) => p.sellerId === seller.id
              ).length;
              return (
                <TableRow key={seller.id}>
                  <TableCell>
                    <p className="font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                      {seller.fullName}
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-[#8A9990] font-mono">
                      @{seller.username} · {seller.phone}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {seller.businessName || "—"}
                  </TableCell>
                  <TableCell className="text-sm">{seller.city || "—"}</TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">
                    {count}
                  </TableCell>
                  <TableCell className="text-xs text-[#6B7280] dark:text-[#8A9990]">
                    {formatShortDate(seller.joinedAt)}
                  </TableCell>
                  <TableCell>
                    <StatusText
                      status={
                        seller.status.charAt(0).toUpperCase() +
                        seller.status.slice(1)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSeller(seller)}
                      >
                        View
                      </Button>
                      {seller.status !== "active" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(seller, "active")}
                        >
                          Approve
                        </Button>
                      )}
                      {seller.status === "pending" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(seller, "rejected")}
                        >
                          Reject
                        </Button>
                      )}
                      {seller.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#B91C1C] dark:text-[#F87171]"
                          onClick={() =>
                            handleStatusChange(seller, "suspended")
                          }
                        >
                          Suspend
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={Boolean(selectedSeller)}
        onOpenChange={(open) => !open && setSelectedSeller(null)}
      >
        <DialogContent
          className="max-w-xl"
          onClose={() => setSelectedSeller(null)}
        >
          {selectedSeller && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedSeller.businessName || selectedSeller.fullName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-[#FAFAF5] dark:bg-[#0F1612] p-4 space-y-1.5">
                  <p>
                    <span className="text-[#6B7280] dark:text-[#8A9990]">Owner:</span>{" "}
                    <span className="font-medium text-[#1F2937] dark:text-[#F1F5F2]">{selectedSeller.fullName}</span>
                  </p>
                  <p>
                    <span className="text-[#6B7280] dark:text-[#8A9990]">Contact:</span>{" "}
                    {selectedSeller.phone} · {selectedSeller.email}
                  </p>
                  <p>
                    <span className="text-[#6B7280] dark:text-[#8A9990]">Location:</span>{" "}
                    {selectedSeller.address || "—"}, {selectedSeller.city}
                  </p>
                  {selectedSeller.businessBio && (
                    <p className="pt-1 text-[#4B5563] dark:text-[#B4C2B9]">
                      {selectedSeller.businessBio}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-display font-semibold text-[#1F2937] dark:text-[#F1F5F2] mb-2">
                    Submitted Products ({sellerProducts.length})
                  </h4>
                  {sellerProducts.length === 0 ? (
                    <p className="text-xs text-[#6B7280] dark:text-[#8A9990]">
                      No products submitted yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#F2F2EA] dark:divide-[#1D2A22] border border-[#E5E5DC] dark:border-[#243329] rounded-lg">
                      {sellerProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 flex items-center justify-between gap-2"
                        >
                          <span className="font-medium truncate">{p.name}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-xs tabular-nums">
                              {formatETB(p.priceETB)}
                            </span>
                            <StatusText
                              status={
                                p.status.charAt(0).toUpperCase() +
                                p.status.slice(1)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
