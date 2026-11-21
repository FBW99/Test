import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuth } from "@/src/context/AuthContext";

export function DeliveryProfilePage() {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [vehicleType, setVehicleType] = useState(
    currentUser?.vehicleType || ""
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ fullName, phone, city, vehicleType });
    toast.success("Delivery partner profile saved");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Delivery Partner Portal", to: "/delivery" },
            { label: "Partner Profile" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Delivery Partner Profile
        </h1>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Delivery Partner & Vehicle Details</CardTitle>
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
              <Label htmlFor="drvName">Full Name</Label>
              <Input
                id="drvName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="drvPhone">Phone Number</Label>
                <Input
                  id="drvPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="drvCity">Operating City</Label>
                <Input
                  id="drvCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="drvVeh">Vehicle Type</Label>
              <Input
                id="drvVeh"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
