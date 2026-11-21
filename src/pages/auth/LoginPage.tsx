import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Shield, ShoppingBag, Store, Truck } from "lucide-react";
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
import { getDashboardPathForRole, useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import type { UserRole } from "@/src/types";

interface PortalMeta {
  role: UserRole;
  title: string;
  shortLabel: string;
  subtitle: string;
  username: string;
  email: string;
  password: string;
  icon: typeof ShoppingBag;
}

const PORTALS: PortalMeta[] = [
  {
    role: "customer",
    title: "Customer Portal",
    shortLabel: "Customer",
    subtitle: "Browse curated Ethiopian artisan products and track your deliveries.",
    username: "hana_customer",
    email: "customer@herbiz.com",
    password: "Customer123!",
    icon: ShoppingBag,
  },
  {
    role: "seller",
    title: "Seller Studio",
    shortLabel: "Woman Seller",
    subtitle: "Submit products, prepare confirmed orders, and track your net earnings.",
    username: "selam_crafts",
    email: "seller@herbiz.com",
    password: "Seller123!",
    icon: Store,
  },
  {
    role: "delivery",
    title: "Delivery Partner Portal",
    shortLabel: "Delivery Partner",
    subtitle: "View assigned pickups, delivery addresses, and update delivery status.",
    username: "dawit_delivery",
    email: "delivery@herbiz.com",
    password: "Delivery123!",
    icon: Truck,
  },
  {
    role: "admin",
    title: "Admin Hub",
    shortLabel: "Admin",
    subtitle: "Approve sellers & products, coordinate orders, assign delivery partners & view finance.",
    username: "admin_herbiz",
    email: "admin@herbiz.com",
    password: "Admin123!",
    icon: Shield,
  },
];

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get("role") as UserRole | null;
  const validInitialRole: UserRole =
    initialRoleParam && PORTALS.some((p) => p.role === initialRoleParam)
      ? initialRoleParam
      : "customer";

  const [selectedRole, setSelectedRole] = useState<UserRole>(validInitialRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const activePortal =
    PORTALS.find((p) => p.role === selectedRole) ?? PORTALS[0];

  useEffect(() => {
    setError("");
  }, [selectedRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password) {
      setError("Please enter both your username or email and password.");
      return;
    }

    const res = login(identifier, password, rememberMe, selectedRole);
    if (!res.success || !res.user) {
      setError(res.message || "Sign in failed.");
      return;
    }

    toast.success(`Welcome back, ${res.user.fullName}`);
    navigate(getDashboardPathForRole(res.user.role), { replace: true });
  };

  const handleQuickDemo = (role: UserRole) => {
    const res = quickDemoLogin(role);
    if (res.success && res.user) {
      toast.success(`Signed into ${activePortal.title} as ${res.user.fullName}`);
      navigate(getDashboardPathForRole(res.user.role), { replace: true });
    }
  };

  const handlePrefill = () => {
    setIdentifier(activePortal.username);
    setPassword(activePortal.password);
    setError("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937]">
          Sign In to Herbiz
        </h1>
        <p className="mt-2 text-sm text-[#4B5563]">
          Choose your role portal below and enter your assigned username or email and password.
        </p>
      </div>

      {/* Distinct Role Portal Selector */}
      <div
        role="tablist"
        aria-label="Role Portals"
        className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-xl border border-[#E5E5DC] bg-white"
      >
        {PORTALS.map((portal) => {
          const Icon = portal.icon;
          const isSelected = portal.role === selectedRole;
          return (
            <button
              key={portal.role}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedRole(portal.role)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap",
                isSelected
                  ? "bg-[#166534] text-white"
                  : "text-[#4B5563] hover:bg-[#FAFAF5] hover:text-[#1F2937]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{portal.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Login Form */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>{activePortal.title}</CardTitle>
            <CardDescription>{activePortal.subtitle}</CardDescription>
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
                <Label htmlFor="identifier">Username or Email</Label>
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder={`${activePortal.username} or ${activePortal.email}`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#166534] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E5E5DC] text-[#166534] focus:ring-[#166534]"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In to {activePortal.shortLabel} Portal
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#4B5563]">
              New to Herbiz?{" "}
              <Link
                to={`/register?role=${selectedRole === "admin" ? "customer" : selectedRole}`}
                className="font-semibold text-[#166534] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo Credentials Card */}
        <Card className="lg:col-span-5 bg-[#FAFAF5]">
          <CardHeader>
            <CardTitle className="text-base">
              Demo Account · {activePortal.shortLabel}
            </CardTitle>
            <CardDescription>
              Simulated hackathon authentication stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-[#E5E5DC] bg-white p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6B7280]">Username</span>
                <span className="font-mono font-semibold text-[#1F2937]">
                  {activePortal.username}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6B7280]">Email</span>
                <span className="font-mono text-xs font-medium text-[#1F2937]">
                  {activePortal.email}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6B7280]">Password</span>
                <span className="font-mono font-semibold text-[#166534]">
                  {activePortal.password}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrefill}
                className="w-full"
              >
                Fill Credentials into Form
              </Button>
              <Button
                type="button"
                variant="amber"
                onClick={() => handleQuickDemo(activePortal.role)}
                className="w-full"
              >
                Instant Demo Sign In ({activePortal.shortLabel})
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
