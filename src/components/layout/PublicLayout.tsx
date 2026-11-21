import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/src/components/common/Logo";
import { Button } from "@/src/components/ui/button";
import { getDashboardPathForRole, useAuth } from "@/src/context/AuthContext";

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionLink = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate(`/${hash}`);
      return;
    }
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF5] text-[#1F2937]">
      <header className="sticky top-0 z-40 border-b border-[#E5E5DC] bg-[#FAFAF5]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <Logo to="/" />

          {/* Zone 2: Concise Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5563]"
          >
            <button
              type="button"
              onClick={() => handleSectionLink("#top")}
              className="hover:text-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleSectionLink("#featured-products")}
              className="hover:text-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Explore Products
            </button>
            <button
              type="button"
              onClick={() => handleSectionLink("#how-it-works")}
              className="hover:text-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleSectionLink("#about-herbiz")}
              className="hover:text-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About Us
            </button>
            <Link
              to="/register?role=seller"
              className="hover:text-[#166534] transition-colors whitespace-nowrap shrink-0"
            >
              Become a Seller
            </Link>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {currentUser ? (
              <Button
                type="button"
                size="sm"
                onClick={() => navigate(getDashboardPathForRole(currentUser.role))}
              >
                Open Dashboard
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#1F2937] hover:text-[#166534] transition-colors whitespace-nowrap shrink-0"
                >
                  Login
                </Link>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5DC] bg-white text-[#1F2937] cursor-pointer"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#E5E5DC] bg-white px-4 py-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#1F2937]">
              <button
                type="button"
                onClick={() => handleSectionLink("#top")}
                className="py-2 text-left hover:text-[#166534] cursor-pointer"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => handleSectionLink("#featured-products")}
                className="py-2 text-left hover:text-[#166534] cursor-pointer"
              >
                Explore Products
              </button>
              <button
                type="button"
                onClick={() => handleSectionLink("#how-it-works")}
                className="py-2 text-left hover:text-[#166534] cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleSectionLink("#about-herbiz")}
                className="py-2 text-left hover:text-[#166534] cursor-pointer"
              >
                About Us
              </button>
              <Link
                to="/register?role=seller"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-[#166534]"
              >
                Become a Seller
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[#E5E5DC]">
              {currentUser ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(getDashboardPathForRole(currentUser.role));
                  }}
                >
                  Open Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register");
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#E5E5DC] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2 space-y-3">
              <Logo to="/" />
              <p className="text-sm font-medium text-[#166534]">
                Women Create. Herbiz Connects. Customers Receive.
              </p>
              <p className="max-w-md text-sm text-[#4B5563]">
                A managed marketplace connecting women entrepreneurs with customers through curated product promotion, order coordination, and reliable doorstep delivery.
              </p>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold text-[#1F2937]">
                Platform Portals
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#4B5563]">
                <li>
                  <Link to="/login?role=customer" className="hover:text-[#166534]">
                    Customer Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/login?role=seller" className="hover:text-[#166534]">
                    Woman Seller Studio
                  </Link>
                </li>
                <li>
                  <Link to="/login?role=delivery" className="hover:text-[#166534]">
                    Delivery Partner Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login?role=admin" className="hover:text-[#166534]">
                    Herbiz Administration
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold text-[#1F2937]">
                Contact Herbiz
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#4B5563]">
                <li>Bole Medhanialem, Addis Ababa</li>
                <li>support@herbiz.com</li>
                <li className="font-mono text-xs">+251 11 667 4500</li>
                <li>Mon–Sat · 8:30 AM – 6:30 PM</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[#E5E5DC] pt-6 text-xs text-[#6B7280] sm:flex-row sm:items-center">
            <p>© 2026 Herbiz Marketplace. Hackathon Prototype Demonstration.</p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-[#166534]">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-[#166534]">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
