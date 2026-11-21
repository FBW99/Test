import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useOrders } from "@/src/context/OrderContext";
import { useTheme } from "@/src/context/ThemeContext";
import { PRODUCT_CATEGORIES } from "@/src/data/seedData";
import { summarizeOrdersFinancials } from "@/src/services/calculations";
import { formatETB } from "@/src/lib/utils";

const CHART_COLORS = [
  "#166534",
  "#22C55E",
  "#F59E0B",
  "#0F766E",
  "#4B5563",
  "#84CC16",
];

export function AdminAnalyticsPage() {
  const { users } = useAuth();
  const { products, financeSettings } = useMarketplace();
  const { orders } = useOrders();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartGridColor = isDark ? "#243329" : "#E5E5DC";
  const chartTickColor = isDark ? "#8A9990" : "#6B7280";
  const tooltipStyle = {
    backgroundColor: isDark ? "#121A15" : "#FFFFFF",
    border: `1px solid ${isDark ? "#243329" : "#E5E5DC"}`,
    borderRadius: "8px",
    color: isDark ? "#F1F5F2" : "#1F2937",
    fontSize: "12px",
  };

  const summary = summarizeOrdersFinancials(orders, financeSettings);

  // Build monthly data combining historical baseline with current month's real stored orders
  const currentMonthSales = summary.grossMerchandiseSalesETB;
  const currentMonthRev = summary.totalHerbizRevenueETB;

  const monthlyData = [
    { month: "Jul", sales: 4200, revenue: 510, orders: 4 },
    { month: "Aug", sales: 6850, revenue: 790, orders: 6 },
    { month: "Sep", sales: 9100, revenue: 1045, orders: 8 },
    { month: "Oct", sales: 11400, revenue: 1320, orders: 10 },
    {
      month: "Nov (Live)",
      sales: currentMonthSales,
      revenue: currentMonthRev,
      orders: summary.activeOrderCount,
    },
  ];

  // Category distribution from real products in store
  const categoryData = PRODUCT_CATEGORIES.map((cat) => ({
    name: cat,
    count: products.filter((p) => p.category === cat).length,
  })).filter((c) => c.count > 0);

  // Seller performance from real stored orders
  const sellers = users.filter((u) => u.role === "seller");
  const sellerPerformance = sellers.map((seller) => {
    const sellerItems = orders
      .filter((o) => o.status !== "Cancelled")
      .flatMap((o) => o.items.filter((i) => i.sellerId === seller.id));
    const sales = sellerItems.reduce((s, i) => s + i.subtotalETB, 0);
    return {
      name: seller.businessName || seller.fullName,
      itemsSold: sellerItems.reduce((s, i) => s + i.quantity, 0),
      salesETB: sales,
    };
  });

  // Delivery performance
  const drivers = users.filter((u) => u.role === "delivery");
  const deliveryPerformance = drivers.map((driver) => {
    const assigned = orders.filter((o) => o.deliveryPartnerId === driver.id);
    const completed = assigned.filter((o) => o.deliveryStatus === "Delivered");
    return {
      name: driver.fullName,
      assigned: assigned.length,
      delivered: completed.length,
    };
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Admin Hub", to: "/admin" },
            { label: "Business Analytics" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Marketplace Analytics
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
          Sales momentum, Herbiz revenue growth, category mix, seller output, and delivery throughput.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Monthly Sales & Revenue Chart */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">
              Monthly Gross Sales vs. Herbiz Revenue (ETB)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: chartTickColor }} stroke={chartGridColor} />
                  <YAxis tick={{ fontSize: 12, fill: chartTickColor }} stroke={chartGridColor} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: isDark ? "rgba(74, 222, 128, 0.08)" : "rgba(22, 101, 52, 0.06)" }}
                  />
                  <Bar
                    dataKey="sales"
                    name="Gross Sales (ETB)"
                    fill={isDark ? "#22C55E" : "#166534"}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Herbiz Revenue (ETB)"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">
              Catalog by Product Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: isDark ? "#F1F5F2" : "#1F2937" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {categoryData.map((c, idx) => (
                <div key={c.name} className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-xs shrink-0"
                    style={{
                      backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                    }}
                  />
                  <span className="truncate text-[#4B5563] dark:text-[#B4C2B9]">
                    {c.name} ({c.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seller & Delivery Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seller Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-[#F2F2EA] dark:divide-[#1D2A22]">
            {sellerPerformance.map((sp) => (
              <div
                key={sp.name}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-semibold text-[#1F2937] dark:text-[#F1F5F2]">{sp.name}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#8A9990] tabular-nums">
                    {sp.itemsSold} unit(s) ordered
                  </p>
                </div>
                <span className="font-mono font-semibold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  {formatETB(sp.salesETB)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Partner Performance</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-[#F2F2EA] dark:divide-[#1D2A22]">
            {deliveryPerformance.map((dp) => (
              <div
                key={dp.name}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-semibold text-[#1F2937] dark:text-[#F1F5F2]">{dp.name}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#8A9990] tabular-nums">
                    {dp.assigned} total assignments
                  </p>
                </div>
                <span className="font-mono font-semibold text-[#166534] dark:text-[#4ADE80] tabular-nums">
                  {dp.delivered} delivered
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
