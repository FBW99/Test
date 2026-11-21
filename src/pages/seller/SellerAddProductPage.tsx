import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/src/components/common/Breadcrumbs";
import { SafeImage } from "@/src/components/common/SafeImage";
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
import { Textarea } from "@/src/components/ui/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useMarketplace } from "@/src/context/MarketplaceContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { PRODUCT_CATEGORIES } from "@/src/data/seedData";
import { formatETB } from "@/src/lib/utils";
import type { ProductCategory } from "@/src/types";

const SAMPLE_STUDIO_PHOTOS = [
  {
    label: "Netela Shawl",
    url: "/src/assets/images/product_cotton_shawl_1795262391400.jpg",
  },
  {
    label: "Sefed Basket",
    url: "/src/assets/images/product_sefed_basket_1795266113249.jpg",
  },
  {
    label: "Jebena & Sini",
    url: "/src/assets/images/product_jebena_set_1795266113377.jpg",
  },
  {
    label: "Shiro & Kolo",
    url: "/src/assets/images/product_shiro_kolo_1795266113384.jpg",
  },
  {
    label: "Shiferaw Balm",
    url: "/src/assets/images/product_moringa_balm_1795262392152.jpg",
  },
  {
    label: "Berbere & Turmeric",
    url: "/src/assets/images/product_spice_collection_1795262392325.jpg",
  },
];

export function SellerAddProductPage() {
  const { currentUser } = useAuth();
  const { addProduct, financeSettings } = useMarketplace();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Handmade Crafts");
  const [price, setPrice] = useState("950");
  const [stock, setStock] = useState("10");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(SAMPLE_STUDIO_PHOTOS[1].url);

  const numericPrice = Math.max(0, Number(price) || 0);
  const commissionAmt = Math.round(numericPrice * financeSettings.commissionRate);
  const netPerItem = Math.max(0, numericPrice - commissionAmt);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim() || !description.trim() || numericPrice <= 0) {
      toast.error("Please fill in product name, price, and description.");
      return;
    }

    const workshopName =
      currentUser.businessName || `${currentUser.fullName} Workshop`;
    const created = addProduct({
      sellerId: currentUser.id,
      sellerWorkshopLabel: `${workshopName} · ${currentUser.city || "Ethiopia"}`,
      name: name.trim(),
      category,
      description: description.trim(),
      priceETB: numericPrice,
      stock: Math.max(1, Number(stock) || 1),
      imageUrl: imageUrl.trim() || SAMPLE_STUDIO_PHOTOS[0].url,
    });

    addNotification({
      recipientRole: "admin",
      title: "Product Submitted for Approval",
      message: `${currentUser.fullName} submitted "${created.name}" (${formatETB(created.priceETB)}).`,
    });

    toast.success("Product submitted for Herbiz Admin approval!");
    navigate("/seller/products");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Seller Studio", to: "/seller" },
            { label: "My Products", to: "/seller/products" },
            { label: "Add Product" },
          ]}
        />
        <h1 className="font-display text-2xl font-bold text-[#1F2937] dark:text-[#F1F5F2]">
          Submit a New Product
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-[#B4C2B9]">
          Herbiz reviews every submission for quality before making it live to shoppers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
      >
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Product Information</CardTitle>
            <CardDescription>
              Keep descriptions clear and helpful for shoppers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="prdName">Product Name</Label>
              <Input
                id="prdName"
                required
                placeholder="e.g. Handwoven Organic Cotton Table Runner"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="prdCat">Category</Label>
                <Select
                  id="prdCat"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prdPrice">Selling Price (ETB)</Label>
                <Input
                  id="prdPrice"
                  type="number"
                  min={1}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prdStock">Available Stock</Label>
                <Input
                  id="prdStock"
                  type="number"
                  min={1}
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prdDesc">Description & Materials</Label>
              <Textarea
                id="prdDesc"
                required
                placeholder="Describe materials, size, craftsmanship, and care instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label>Product Photo</Label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_STUDIO_PHOTOS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                      imageUrl === preset.url
                        ? "border-[#166534] bg-[#166534] text-white dark:border-[#22C55E] dark:bg-[#1E7A40]"
                        : "border-[#E5E5DC] dark:border-[#243329] bg-[#FAFAF5] dark:bg-[#0F1612] text-[#4B5563] dark:text-[#B4C2B9] hover:text-[#1F2937] dark:hover:text-[#F1F5F2]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-white dark:bg-[#121A15] px-3 py-2 text-xs font-medium text-[#1F2937] dark:text-[#F1F5F2] hover:bg-[#FAFAF5] dark:hover:bg-[#18231C] cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-[#166534] dark:text-[#4ADE80]" aria-hidden="true" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                <span className="text-xs text-[#6B7280] dark:text-[#8A9990]">
                  or select a sample studio photo above
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview & Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-[#F2F2EA] dark:bg-[#18231C]">
                <SafeImage
                  src={imageUrl}
                  alt={name || "Product preview"}
                  className="h-full w-full"
                />
              </div>

              <div className="rounded-lg border border-[#E5E5DC] dark:border-[#243329] bg-[#FAFAF5] dark:bg-[#0F1612] p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#4B5563] dark:text-[#B4C2B9]">
                  <span>Customer Price</span>
                  <span className="font-mono font-semibold text-[#1F2937] dark:text-[#F1F5F2] tabular-nums">
                    {formatETB(numericPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4B5563] dark:text-[#B4C2B9]">
                  <span>
                    Herbiz Fee ({Math.round(financeSettings.commissionRate * 100)}%)
                  </span>
                  <span className="font-mono tabular-nums">
                    -{formatETB(commissionAmt)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-[#166534] dark:text-[#4ADE80] pt-2 border-t border-[#E5E5DC] dark:border-[#243329]">
                  <span>Your Earnings Per Sale</span>
                  <span className="font-mono tabular-nums">
                    {formatETB(netPerItem)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/seller/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit for Approval
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
