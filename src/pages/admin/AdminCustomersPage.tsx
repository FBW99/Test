import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatETB, formatShortDate } from "@/src/lib/utils";
import type { SupportInquiry } from "@/src/types";

export function AdminCustomersPage() {
  const { users, adminUpdateUserStatus } = useAuth();
  const { orders } = useOrders();
  const { inquiries, replyToInquiry } = useNotifications();

  const [replying, setReplying] = useState<SupportInquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  const customers = users.filter((u) => u.role === "customer");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replying || !replyText.trim()) return;
    replyToInquiry(replying.id, replyText.trim());
    toast.success(`Reply sent to ${replying.customerName}`);
    setReplying(null);
    setReplyText("");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Customers & Support" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Customers & Herbiz Support Desk
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
          Manage customer accounts and answer inquiries—Herbiz handles all customer communication directly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registered Customers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const custOrders = orders.filter(
                  (o) => o.customerId === customer.id && o.status !== "Cancelled"
                );
                const totalSpend = custOrders.reduce((s, o) => s + o.totalETB, 0);
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <p className="font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                        {customer.fullName}
                      </p>
                      <p className="text-xs text-[#6B7280] dark:text-[#8A9990] font-mono">
                        @{customer.username} · {customer.phone}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{customer.city || "—"}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {custOrders.length}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold tabular-nums">
                      {formatETB(totalSpend)}
                    </TableCell>
                    <TableCell>
                      <StatusText
                        status={
                          customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.status === "active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            adminUpdateUserStatus(customer.id, "suspended");
                            toast.success(`Suspended ${customer.fullName}`);
                          }}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            adminUpdateUserStatus(customer.id, "active");
                            toast.success(`Reactivated ${customer.fullName}`);
                          }}
                        >
                          Activate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Support Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Customer Support Inquiries ({inquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inquiries.length === 0 ? (
            <p className="text-sm text-[#6B7280] dark:text-[#8A9990]">No customer inquiries yet.</p>
          ) : (
            inquiries.map((inq) => (
              <div
                key={inq.id}
                className="rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-[#FAFAF5] dark:bg-[#0F1612] p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-[#1F2937] dark:text-[#F1F5F2]">
                      {inq.subject}
                    </span>
                    <StatusText status={inq.status} />
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-[#8A9990]">
                    From {inq.customerName} · {formatShortDate(inq.createdAt)}
                    {inq.orderId ? ` · Order ${inq.orderId}` : ""}
                  </p>
                  <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9] pt-1">{inq.message}</p>
                  {inq.adminReply && (
                    <p className="text-xs text-[#166534] dark:text-[#4ADE80] pt-1">
                      Replied: {inq.adminReply}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplying(inq);
                    setReplyText(inq.adminReply || "");
                  }}
                >
                  {inq.adminReply ? "Update Reply" : "Reply"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(replying)}
        onOpenChange={(open) => !open && setReplying(null)}
      >
        <DialogContent onClose={() => setReplying(null)}>
          <DialogHeader>
            <DialogTitle>Reply to {replying?.customerName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <p className="text-xs text-[#4B5563] dark:text-[#B4C2B9] bg-[#FAFAF5] dark:bg-[#0F1612] p-3 rounded-lg border border-[#E5E5DC] dark:border-[#243329]">
              {replying?.message}
            </p>
            <Textarea
              required
              placeholder="Write Herbiz's official response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setReplying(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Send Reply</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
