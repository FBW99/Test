import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select } from "@/src/components/ui/select";
import { getDashboardPathForRole, useAuth } from "@/src/context/AuthContext";
import { useNotifications } from "@/src/context/NotificationContext";
import type { UserRole } from "@/src/types";

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) || "customer";

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>(
    ["customer", "seller", "delivery", "admin"].includes(initialRole)
      ? initialRole
      : "customer"
  );
  const [city, setCity] = useState("Addis Ababa");
  const [businessName, setBusinessName] = useState("");
  const [vehicleType, setVehicleType] = useState("City Motorbike");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { register } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !username.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "seller" && !businessName.trim()) {
      setError("Please enter your workshop or business name.");
      return;
    }

    const res = register({
      fullName,
      username,
      email,
      phone,
      password,
      role,
      city,
      businessName: role === "seller" ? businessName : undefined,
      vehicleType: role === "delivery" ? vehicleType : undefined,
    });

    if (!res.success || !res.user) {
      setError(res.message || "Registration failed.");
      return;
    }

    if (role === "seller") {
      addNotification({
        recipientRole: "admin",
        title: "New Seller Registration",
        message: `${fullName} (${businessName}) registered and awaits Herbiz approval.`,
      });
      toast.success("Account created! Your seller studio awaits Herbiz admin approval.");
    } else {
      toast.success(`Welcome to Herbiz, ${res.user.fullName}!`);
    }

    navigate(getDashboardPathForRole(res.user.role), { replace: true });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Herbiz Account</CardTitle>
          <CardDescription>
            Join as a customer, woman entrepreneur seller, or delivery partner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-3.5 py-2.5 text-sm text-[#B91C1C]"
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="role">Account Role</Label>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="customer">Customer — Browse and buy products</option>
                <option value="seller">Seller / Woman Entrepreneur — Supply products</option>
                <option value="delivery">Delivery Partner — Deliver orders</option>
                <option value="admin">Admin (Demo Testing)</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Meron Tadesse"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g. meron_studio"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+251 911 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              {role === "seller" && (
                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Workshop / Brand Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g. Meron Botanicals"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              )}
              {role === "delivery" && (
                <div className="space-y-1.5">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Input
                    id="vehicleType"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[#4B5563]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#166534] hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
