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
    title: "Makers Share Their Craft",
    description:
      "Women entrepreneurs submit product photos, prices, and available quantities from their home studios.",
  },
  {
    step: "02",
    title: "Herbiz Curates & Promotes",
    description:
      "Our team checks quality, polishes every listing, and promotes handmade pieces to shoppers across the city.",
  },
  {
    step: "03",
    title: "Customers Order with Confidence",
    description:
      "Buyers browse authentic Ethiopian textiles, crafts, foods, and botanicals and check out in minutes.",
  },
  {
    step: "04",
    title: "We Coordinate Everything Behind the Scenes",
    description:
      "Herbiz confirms stock with the maker and keeps every update clear—no endless direct messaging needed.",
  },
  {
    step: "05",
    title: "Trusted Doorstep Delivery",
    description:
      "Our delivery partners pick up wrapped orders directly from workshops and bring them safely to your door.",
  },
  {
    step: "06",
    title: "Fair, Transparent Earnings",
    description:
      "Once delivered, Herbiz takes a flat 10% service fee and sends 90% straight to the woman who made it.",
  },
];

const COMMUNITY_STORIES = [
  {
    name: "Selamawit Bekele",
    role: "Founder, Selam Home Loom & Botanicals · Addis Ababa",
    quote:
      "Managing buyer chats and unreliable couriers used to take half my day. With Herbiz, I simply focus on weaving and skincare while orders arrive ready to pack.",
  },
  {
    name: "Tigist Alemu",
    role: "Lead Artisan, Tigist Home Kitchen & Basketry · Hawassa",
    quote:
      "Herbiz opened steady buyers in Addis Ababa for our family workshop. Every payout statement clearly shows what we sold, the small fee, and what we earned.",
  },
  {
    name: "Hana Yohannes",
    role: "Customer · Kazanchis, Addis Ababa",
    quote:
      "Shopping on Herbiz feels personal and effortless. Everything arrives thoughtfully wrapped, on time, and backed by one helpful team.",
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
    <div id="top" className="bg-[#FAFAF5] dark:bg-[#0B110D] transition-colors">
      {/* Hero Section */}
      <section className="border-b border-[#E5E5DC] bg-white dark:border-[#243329] dark:bg-[#121A15]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6 space-y-6">
              <p className="text-sm font-semibold tracking-wide text-[#166534] dark:text-[#4ADE80]">
                Women Create · Herbiz Connects · Customers Receive
              </p>
              <h1
                className="font-display font-bold tracking-tight text-[#1F2937] dark:text-[#F1F5F2] leading-[1.08]"
                style={{ fontSize: "clamp(2.25rem, 4.2vw, 3.6rem)", textWrap: "balance" }}
              >
                Your Talent Deserves a Market.
              </h1>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#4B5563] dark:text-[#B4C2B9]">
                Herbiz connects Ethiopian women makers with everyday buyers—taking care of promotion, order coordination, and reliable doorstep delivery so creators can focus on what they craft best.
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

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E5E5DC] dark:border-[#243329]">
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                    100%
                  </p>
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B4C2B9] mt-1">
                    Managed order care
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                    90%
                  </p>
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B4C2B9] mt-1">
                    Goes straight to makers
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                    Same-Week
                  </p>
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#B4C2B9] mt-1">
                    Addis Ababa delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[300px] overflow-hidden rounded-2xl border border-[#E5E5DC] bg-[#F2F2EA] dark:border-[#243329] dark:bg-[#18231C]">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Ethiopian woman artisan arranging handwoven cotton textiles and natural botanical jars in her home studio"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section id="about-herbiz" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-[#F1F5F2]"
              style={{ textWrap: "balance" }}
            >
              A Marketplace Built Around Real Makers
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#4B5563] dark:text-[#B4C2B9]">
              Most online tools hand artisans a login and leave them on their own with marketing, buyer chats, and logistics. Herbiz steps in as a dedicated partner between maker and customer.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E5DC] bg-white p-6 sm:p-8 dark:border-[#243329] dark:bg-[#121A15]">
              <h3 className="font-display text-lg font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                When Makers Sell Alone
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-[#4B5563] dark:text-[#B4C2B9]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B45309] dark:bg-[#FBBF24] shrink-0" />
                  <span>Hard to reach customers outside immediate neighborhoods</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B45309] dark:bg-[#FBBF24] shrink-0" />
                  <span>No extra hours for social marketing or storefront updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B45309] dark:bg-[#FBBF24] shrink-0" />
                  <span>Exhausting DMs, missed messages, and uncertain payments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B45309] dark:bg-[#FBBF24] shrink-0" />
                  <span>Unpredictable riders and delivery delays</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#166534]/25 bg-white p-6 sm:p-8 dark:border-[#4ADE80]/25 dark:bg-[#121A15]">
              <h3 className="font-display text-lg font-semibold text-[#166534] dark:text-[#4ADE80]">
                When Makers Partner With Herbiz
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-[#1F2937] dark:text-[#F1F5F2]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] dark:text-[#4ADE80] shrink-0" aria-hidden="true" />
                  <span>Curated product photography, storytelling, and active promotion</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] dark:text-[#4ADE80] shrink-0" aria-hidden="true" />
                  <span>All orders coordinated smoothly by Herbiz from start to finish</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] dark:text-[#4ADE80] shrink-0" aria-hidden="true" />
                  <span>Personal privacy protected—buyers never receive private phone numbers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#166534] dark:text-[#4ADE80] shrink-0" aria-hidden="true" />
                  <span>Scheduled pickup from your home studio and tracked doorstep delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How Herbiz Works */}
      <section id="how-it-works" className="border-y border-[#E5E5DC] bg-white py-16 sm:py-24 dark:border-[#243329] dark:bg-[#121A15]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-[#F1F5F2]">
                How Herbiz Works
              </h2>
              <p className="mt-2 text-base text-[#4B5563] dark:text-[#B4C2B9]">
                From a woman's home workshop to your table—guided step by step with care.
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm font-semibold text-[#166534] dark:text-[#4ADE80] hover:underline whitespace-nowrap"
            >
              Sign in to explore the portals →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-[#E5E5DC] bg-[#FAFAF5] p-6 sm:p-7 dark:border-[#243329] dark:bg-[#0F1612]"
              >
                <span className="font-mono text-xs font-semibold text-[#166534] dark:text-[#4ADE80]">
                  {item.step}
                </span>
                <h3 className="mt-2.5 font-display text-base font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#4B5563] dark:text-[#B4C2B9] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-[#F1F5F2]">
                Featured Artisan Goods
              </h2>
              <p className="mt-2 text-base text-[#4B5563] dark:text-[#B4C2B9]">
                Handcrafted in small home batches and quality-checked before dispatch.
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

      {/* Benefits, Impact & Community Stories */}
      <section className="border-t border-[#E5E5DC] bg-white py-16 sm:py-24 dark:border-[#243329] dark:bg-[#121A15]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-[#F1F5F2]"
                style={{ textWrap: "balance" }}
              >
                Built for Lasting Growth
              </h2>
              <p className="text-base leading-relaxed text-[#4B5563] dark:text-[#B4C2B9]">
                Women makers keep full pride in their craft while Herbiz handles trust, payment settlement, and reliable city logistics.
              </p>
              <div className="space-y-4 pt-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#166534] dark:text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2]">Protected Privacy & Time</p>
                    <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">Every customer inquiry goes through Herbiz—never your personal phone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-[#166534] dark:text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2]">Coordinated Doorstep Delivery</p>
                    <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">Dedicated delivery partners collect from home workshops and hubs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-[#166534] dark:text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2]">90% Maker Payout</p>
                    <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">Clear, itemized earnings on every completed delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#E5E5DC] bg-[#FAFAF5] p-6 dark:border-[#243329] dark:bg-[#0F1612]">
                <p className="text-xs font-medium text-[#4B5563] dark:text-[#B4C2B9]">Community Reach</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  140+
                </p>
                <p className="mt-1 text-sm text-[#1F2937] dark:text-[#E2EAE5]">
                  Women-owned studios across Ethiopia
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E5DC] bg-[#FAFAF5] p-6 dark:border-[#243329] dark:bg-[#0F1612]">
                <p className="text-xs font-medium text-[#4B5563] dark:text-[#B4C2B9]">Order Fulfillment</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  98.4%
                </p>
                <p className="mt-1 text-sm text-[#1F2937] dark:text-[#E2EAE5]">
                  On-time courier delivery across Addis
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E5DC] bg-[#FAFAF5] p-6 dark:border-[#243329] dark:bg-[#0F1612]">
                <p className="text-xs font-medium text-[#4B5563] dark:text-[#B4C2B9]">Maker Earnings Share</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  90%
                </p>
                <p className="mt-1 text-sm text-[#1F2937] dark:text-[#E2EAE5]">
                  Paid directly to women producers per sale
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E5DC] bg-[#FAFAF5] p-6 dark:border-[#243329] dark:bg-[#0F1612]">
                <p className="text-xs font-medium text-[#4B5563] dark:text-[#B4C2B9]">Delivery Margin</p>
                <p className="mt-2 font-mono text-3xl font-bold text-[#B45309] dark:text-[#FBBF24] tabular-nums">
                  15%
                </p>
                <p className="mt-1 text-sm text-[#1F2937] dark:text-[#E2EAE5]">
                  Sustainable logistics margin per delivery
                </p>
              </div>
            </div>
          </div>

          {/* Community Stories */}
          <div className="mt-16 pt-12 border-t border-[#E5E5DC] dark:border-[#243329]">
            <h3 className="font-display text-xl font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
              Stories from Our Community
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {COMMUNITY_STORIES.map((story) => (
                <blockquote
                  key={story.name}
                  className="flex flex-col justify-between rounded-2xl border border-[#E5E5DC] bg-[#FAFAF5] p-6 dark:border-[#243329] dark:bg-[#0F1612]"
                >
                  <p className="text-sm text-[#1F2937] dark:text-[#E2EAE5] leading-relaxed">
                    “{story.quote}”
                  </p>
                  <footer className="mt-5 pt-4 border-t border-[#E5E5DC] dark:border-[#243329]">
                    <p className="text-sm font-semibold text-[#1F2937] dark:text-[#F1F5F2]">{story.name}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#8A9990] mt-0.5">{story.role}</p>
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
