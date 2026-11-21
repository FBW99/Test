import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Users } from "lucide-react";
import { SafeImage } from "@/src/components/common/SafeImage";
import { ProductCard } from "@/src/components/marketplace/ProductCard";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { HERO_IMAGE } from "@/src/data/seedData";

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Women Register & Submit Products",
    description:
      "Entrepreneurs share photos, pricing, and available stock in a guided studio portal.",
  },
  {
    step: "02",
    title: "Herbiz Reviews & Promotes",
    description:
      "Our team verifies quality, refines product listings, and markets them to active buyers.",
  },
  {
    step: "03",
    title: "Customers Discover & Order",
    description:
      "Shoppers browse curated Ethiopian goods and check out safely with delivery included.",
  },
  {
    step: "04",
    title: "Herbiz Coordinates Collection",
    description:
      "Admins confirm stock with the maker behind the scenes—zero customer messaging hassle.",
  },
  {
    step: "05",
    title: "Delivery Partners Deliver",
    description:
      "Assigned Herbiz couriers collect packed items and deliver straight to the customer's door.",
  },
  {
    step: "06",
    title: "Sellers Receive Earnings",
    description:
      "Once delivered, Herbiz deducts a transparent 10% commission and credits the maker's net payout.",
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    name: "Selamawit Bekele",
    role: "Founder, Selam Loom & Botanical Studio (Sample Testimonial)",
    outcome:
      "Before Herbiz, managing Instagram messages and unreliable couriers took half my day. Now I focus purely on weaving and skincare production while orders arrive ready to pack.",
  },
  {
    name: "Tigist Alemu",
    role: "Lead Artisan, Sidama Clay & Basketry (Sample Testimonial)",
    outcome:
      "Herbiz opened steady buyers in Addis Ababa for our Hawassa cooperative. Every payout statement clearly shows gross sales, commission, and net earnings.",
  },
  {
    name: "Hana Yohannes",
    role: "Verified Customer, Addis Ababa (Sample Testimonial)",
    outcome:
      "Shopping through Herbiz feels effortless. I get authentic handmade products with reliable delivery tracking and one responsive support team.",
  },
];

export function LandingPage() {
  const { approvedProducts } = useMarketplace();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace("#", ""));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  const featuredProducts = approvedProducts.slice(0, 6);

  const handleMarketplaceClick = () => {
    if (currentUser?.role === "customer") {
      navigate("/customer/shop");
    } else {
      navigate("/login?role=customer");
    }
  };

  return (
    <div id="top" className="bg-[#FAFAF5]">
      {/* Hero Section */}
      <section className="border-b border-[#E5E5DC] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6 space-y-6">
              <p className="text-sm font-semibold text-[#166534]">
                Women Create · Herbiz Connects · Customers Receive
              </p>
              <h1
                className="font-display font-bold tracking-tight text-[#1F2937] leading-[1.1]"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", textWrap: "balance" }}
              >
                Your Talent Deserves a Market.
              </h1>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#4B5563]">
                Herbiz empowers women entrepreneurs by connecting their products with customers through marketing, managed orders, and reliable delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button size="lg" onClick={handleMarketplaceClick}>
                  <span>Explore Marketplace</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/register?role=seller")}
                >
                  Become a Seller
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E5DC]">
                <div>
                  <p className="font-mono text-xl font-bold text-[#166534] tabular-nums">
                    100%
                  </p>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Managed order coordination
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-[#166534] tabular-nums">
                    10%
                  </p>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Transparent commission
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-[#166534] tabular-nums">
                    4 Portals
                  </p>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Buyer, Seller, Delivery Partner, Admin
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] overflow-hidden rounded-2xl border border-[#E5E5DC] bg-[#F2F2EA]">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Ethiopian woman entrepreneur preparing handcrafted textiles and botanical jars in her studio"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section id="about-herbiz" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">
              Why Women Makers Need a Managed Marketplace
            </h2>
            <p className="mt-3 text-base text-[#4B5563]">
              Self-serve e-commerce tools still leave artisans alone with marketing, buyer support, and logistics. Herbiz acts as the trusted operating partner in the middle.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#E5E5DC] bg-white p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-[#1F2937]">
                The Challenge Women Face Alone
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B45309] shrink-0" />
                  <span>Limited visibility beyond immediate local neighborhoods</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B45309] shrink-0" />
                  <span>No time or budget for digital marketing and storefront upkeep</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B45309] shrink-0" />
                  <span>Overwhelming customer chats and unverified cash-on-delivery risk</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B45309] shrink-0" />
                  <span>Fragmented, unreliable delivery coordination</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#166534]/25 bg-white p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-[#166534]">
                The Herbiz Managed Solution
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#1F2937]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] shrink-0" aria-hidden="true" />
                  <span>Curated storefront and active promotion handled by Herbiz</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] shrink-0" aria-hidden="true" />
                  <span>Centralized order handling: Customers ↔ Herbiz ↔ Sellers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] shrink-0" aria-hidden="true" />
                  <span>Zero direct buyer-seller messaging—protecting maker time and privacy</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] shrink-0" aria-hidden="true" />
                  <span>Assigned Herbiz delivery partners with doorstep tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How Herbiz Works */}
      <section id="how-it-works" className="border-y border-[#E5E5DC] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">
                How Herbiz Works
              </h2>
              <p className="mt-2 text-base text-[#4B5563]">
                Six clear steps from artisan workshop to customer doorstep—coordinated by Herbiz at every handoff.
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm font-semibold text-[#166534] hover:underline whitespace-nowrap"
            >
              Try all 4 role portals →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-[#E5E5DC] bg-[#FAFAF5] p-6"
              >
                <span className="font-mono text-xs font-semibold text-[#166534]">
                  {item.step}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold text-[#1F2937]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">
                Featured Artisan Products
              </h2>
              <p className="mt-2 text-base text-[#4B5563]">
                Reviewed and approved by Herbiz before reaching the marketplace.
              </p>
            </div>
            <Button variant="outline" onClick={handleMarketplaceClick}>
              Browse All Products
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                detailPath={
                  currentUser?.role === "customer"
                    ? `/customer/product/${product.id}`
                    : `/login?role=customer`
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Impact Stats */}
      <section className="border-t border-[#E5E5DC] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937]">
                Built to Grow Women-Owned Businesses
              </h2>
              <p className="text-base text-[#4B5563]">
                Sellers only focus on crafting quality goods. Herbiz handles customer trust, payment collection, and last-mile delivery.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">Protected Privacy & Time</p>
                    <p className="text-sm text-[#4B5563]">No sharing personal phone numbers with buyers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">Managed City Delivery</p>
                    <p className="text-sm text-[#4B5563]">Couriers pick up directly from workshops or hubs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">90% Net Maker Earnings</p>
                    <p className="text-sm text-[#4B5563]">Clear financial breakdowns on every settled order.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E5E5DC] bg-[#FAFAF5] p-6">
                <p className="text-xs font-medium text-[#4B5563]">Sample Impact Metric</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#166534] tabular-nums">
                  140+
                </p>
                <p className="mt-1 text-sm text-[#1F2937]">
                  Women artisans onboarded (demo projection)
                </p>
              </div>
              <div className="rounded-xl border border-[#E5E5DC] bg-[#FAFAF5] p-6">
                <p className="text-xs font-medium text-[#4B5563]">Order Fulfillment</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#166534] tabular-nums">
                  98.4%
                </p>
                <p className="mt-1 text-sm text-[#1F2937]">
                  On-time courier delivery rate (demo target)
                </p>
              </div>
              <div className="rounded-xl border border-[#E5E5DC] bg-[#FAFAF5] p-6">
                <p className="text-xs font-medium text-[#4B5563]">Maker Earnings Share</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#166534] tabular-nums">
                  90%
                </p>
                <p className="mt-1 text-sm text-[#1F2937]">
                  Paid directly to women producers per sale
                </p>
              </div>
              <div className="rounded-xl border border-[#E5E5DC] bg-[#FAFAF5] p-6">
                <p className="text-xs font-medium text-[#4B5563]">Delivery Margin</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#B45309] tabular-nums">
                  15 ETB
                </p>
                <p className="mt-1 text-sm text-[#1F2937]">
                  Sustainable platform logistics unit margin
                </p>
              </div>
            </div>
          </div>

          {/* Sample Testimonials */}
          <div className="mt-16 pt-12 border-t border-[#E5E5DC]">
            <h3 className="font-display text-xl font-semibold text-[#1F2937]">
              Community Voices (Sample Testimonials)
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {SAMPLE_TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.name}
                  className="flex flex-col justify-between rounded-xl border border-[#E5E5DC] bg-[#FAFAF5] p-6"
                >
                  <p className="text-sm text-[#1F2937] leading-relaxed">
                    “{t.outcome}”
                  </p>
                  <footer className="mt-4 pt-4 border-t border-[#E5E5DC]">
                    <p className="text-sm font-semibold text-[#1F2937]">{t.name}</p>
                    <p className="text-xs text-[#6B7280]">{t.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
