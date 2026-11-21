import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuth } from "@/src/context/AuthContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { formatShortDate } from "@/src/lib/utils";

export function CustomerProfilePage() {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const { inquiries } = useNotifications();

  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [address, setAddress] = useState(currentUser?.address || "");

  const myInquiries = inquiries.filter(
    (inq) => inq.customerId === currentUser?.id
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ fullName, phone, city, address });
    toast.success("Profile details saved");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Customer Portal", to: "/customer" },
            { label: "Profile" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937]">
          My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base">Account & Delivery Defaults</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Username</Label>
                  <Input value={currentUser?.username || ""} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={currentUser?.email || ""} disabled />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custName">Full Name</Label>
                <Input
                  id="custName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="custPhone">Phone Number</Label>
                  <Input
                    id="custPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="custCity">City</Label>
                  <Input
                    id="custCity"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custAddr">Default Delivery Address</Label>
                <Input
                  id="custAddr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base">
              Herbiz Support Inquiries ({myInquiries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myInquiries.length === 0 ? (
              <p className="text-sm text-[#6B7280]">
                Questions you send from product or order pages appear here along with Herbiz team replies.
              </p>
            ) : (
              myInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-lg border border-[#E5E5DC] bg-[#FAFAF5] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1F2937]">
                      {inq.subject}
                    </span>
                    <StatusText status={inq.status} />
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {formatShortDate(inq.createdAt)}
                    {inq.orderId ? ` · Order ${inq.orderId}` : ""}
                  </p>
                  <p className="text-sm text-[#4B5563]">{inq.message}</p>
                  {inq.adminReply && (
                    <div className="mt-2 rounded-md border border-[#166534]/20 bg-white p-3">
                      <p className="text-xs font-semibold text-[#166534]">
                        Herbiz Team Reply:
                      </p>
                      <p className="mt-0.5 text-sm text-[#1F2937]">
                        {inq.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
