import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MessageSquare, Truck } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { SafeImage } from "@/src/components/common/SafeImage";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { useOrders } from "@/src/context/OrderContext";
import { formatDateTime, formatETB } from "@/src/lib/utils";

export function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const { createSupportInquiry } = useNotifications();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const order = orders.find(
    (o) => o.id === id && o.customerId === currentUser?.id
  );

  if (!order) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/customer/orders")}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to My Orders</span>
        </Button>
        <Card>
          <CardContent className="p-8 text-center text-sm text-[#4B5563]">
            Order not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !subject.trim() || !message.trim()) return;
    createSupportInquiry({
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      orderId: order.id,
      subject: subject.trim(),
      message: message.trim(),
    });
    setSubject("");
    setMessage("");
    toast.success("Message sent to Herbiz Customer Support.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "My Orders", to: "/customer/orders" },
            { label: order.id },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-[#1F2937] font-mono">
              {order.id}
            </h1>
            <StatusText status={order.status} />
          </div>
          <p className="text-xs text-[#6B7280]">
            Placed {formatDateTime(order.createdAt)} · {order.paymentMethod}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[#F2F2EA]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center gap-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F2F2EA]">
                    <SafeImage
                      src={item.productImage}
                      alt={item.productName}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1F2937] truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {item.sellerWorkshopLabel} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#1F2937] tabular-nums">
                    {formatETB(item.subtotalETB)}
                  </span>
                </div>
              ))}

              <div className="pt-4 mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#4B5563]">
                  <span>Items Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {formatETB(order.subtotalETB)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4B5563]">
                  <span>Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {formatETB(order.deliveryFeeETB)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1F2937] pt-2 border-t border-[#E5E5DC]">
                  <span>Total</span>
                  <span className="font-mono text-[#166534] tabular-nums">
                    {formatETB(order.totalETB)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Herbiz Order Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.timeline.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-4 w-4 text-[#166534] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {event.label}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {event.actor} · {formatDateTime(event.timestamp)}
                    </p>
                    {event.note && (
                      <p className="mt-1 text-xs text-[#4B5563]">{event.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-[#6B7280]">Recipient</p>
                <p className="font-medium text-[#1F2937]">{order.customerName}</p>
                <p className="text-xs font-mono text-[#4B5563]">
                  {order.customerPhone}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Address</p>
                <p className="text-[#1F2937]">
                  {order.deliveryAddress}, {order.city}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E5E5DC] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <Truck className="h-4 w-4 text-[#166534]" aria-hidden="true" />
                  <span>
                    {order.deliveryPartnerName
                      ? `Courier: ${order.deliveryPartnerName}`
                      : "Awaiting courier assignment"}
                  </span>
                </div>
                <StatusText status={order.deliveryStatus} />
              </div>
            </CardContent>
          </Card>

          {/* Customer <-> Herbiz Only Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#166534]" aria-hidden="true" />
                <span>Need Help? Contact Herbiz</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInquiry} className="space-y-3">
                <p className="text-xs text-[#4B5563]">
                  Herbiz manages all seller coordination and delivery inquiries on your behalf.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="ordInqSub">Subject</Label>
                  <Input
                    id="ordInqSub"
                    required
                    placeholder="e.g. Delivery time request"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ordInqMsg">Message</Label>
                  <Textarea
                    id="ordInqMsg"
                    required
                    placeholder="Write to Herbiz support..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full">
                  Send Message to Herbiz
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
