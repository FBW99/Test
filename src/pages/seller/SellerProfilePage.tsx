import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { StatusText } from "@/src/components/common/StatusText";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";

export function SellerProfilePage() {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [businessName, setBusinessName] = useState(
    currentUser?.businessName || ""
  );
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [businessBio, setBusinessBio] = useState(currentUser?.businessBio || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      fullName,
      businessName,
      phone,
      city,
      address,
      businessBio,
    });
    toast.success("Workshop profile updated");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Seller Studio", to: "/seller" },
            { label: "Studio Profile" },
          ]}
        />
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
            Workshop Profile
          </h1>
          {currentUser && (
            <StatusText
              status={
                currentUser.status.charAt(0).toUpperCase() +
                currentUser.status.slice(1)
              }
            />
          )}
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">
            Entrepreneur & Pickup Information (Internal to Herbiz)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="selName">Your Name</Label>
                <Input
                  id="selName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="selBiz">Workshop / Brand Name</Label>
                <Input
                  id="selBiz"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="selPhone">Phone (for Herbiz Coordination Only)</Label>
                <Input
                  id="selPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="selCity">City</Label>
                <Input
                  id="selCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="selAddr">Courier Pickup Address</Label>
              <Input
                id="selAddr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="selBio">About Your Craft</Label>
              <Textarea
                id="selBio"
                value={businessBio}
                onChange={(e) => setBusinessBio(e.target.value)}
              />
            </div>

            <Button type="submit">Save Studio Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
