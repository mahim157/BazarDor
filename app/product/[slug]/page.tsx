import Link from "next/link";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import ProductCard, { Product } from "@/components/ProductCard";

const API_BASE = "https://api.abcz.workers.dev/api/bazardor";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  } catch (error) {
    console.error("Products Fetch Error:", error);
    return [];
  }
}

function toBengali(num: number | string) {
  return String(num).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

function getUnit(unit?: string) {
  if (!unit) return "একক";
  if (unit.startsWith("প্রতি")) return unit;
  return `প্রতি ${unit}`;
}

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  // URL থেকে product slug নেওয়া
  const { slug } = await params;

  const products = await getProducts();

  // slug দিয়ে product খোঁজা
  const product = products.find(
    (item) =>
      String(item.slug).trim().toLowerCase() ===
      decodeURIComponent(slug).trim().toLowerCase()
  );

  // Product না পাওয়া গেলে
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F6F3] flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center text-3xl">
            🔍
          </div>

          <h1 className="text-xl font-bold text-slate-900 mt-5">
            পণ্যটি পাওয়া যায়নি
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            আপনার অনুরোধ করা পণ্যের তথ্য পাওয়া যাচ্ছে না।
          </p>

          <Link
            href="/"
            className="inline-block mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm"
          >
            হোম পেজে ফিরে যান
          </Link>
        </main>
      </div>
    );
  }

  const markets = product.markets ?? [];

  const direction = product.change?.dir ?? "flat";
  const percentage = Math.abs(product.change?.pct ?? 0);

  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : product.today;

  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : product.today;

  const averagePrice =
    markets.length > 0
      ? Math.round(
          markets.reduce(
            (total, market) =>
              total + (market.min + market.max) / 2,
            0
          ) / markets.length
        )
      : product.today;

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 flex flex-col">
      <div className="flex-1">
        <Navbar />

        <PriceTicker items={products} />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">

          {/* Breadcrumb */}
          <div className="text-xs text-slate-400">
            <Link
              href="/"
              className="hover:text-emerald-600"
            >
              হোম
            </Link>

            <span className="mx-2">›</span>

            <Link
              href={`/category/${product.category}`}
              className="hover:text-emerald-600"
            >
              {product.categoryNameBn}
            </Link>

            <span className="mx-2">›</span>

            <span className="text-slate-600">
              {product.nameBn}
            </span>
          </div>

          {/* Product Summary */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl">
                  {product.image ||
                    product.categoryIcon ||
                    "📦"}
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {product.nameBn}
                  </h1>

                  <p className="text-xs text-slate-400 mt-1">
                    {getUnit(product.unit)} ·{" "}
                    {product.categoryNameBn}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl px-6 py-4 text-center">
                <p className="text-[11px] text-slate-400">
                  আজকের দাম
                </p>

                <p className="text-3xl font-black text-slate-900">
                  ৳{toBengali(product.today)}
                </p>

                <div
                  className={`text-xs font-bold mt-1 ${
                    direction === "up"
                      ? "text-emerald-600"
                      : direction === "down"
                      ? "text-rose-600"
                      : "text-slate-500"
                  }`}
                >
                  {direction === "up" && "▲ "}
                  {direction === "down" && "▼ "}
                  {direction === "flat" && "— "}
                  {toBengali(percentage)}%
                </div>
              </div>

            </div>
          </section>

          {/* Price Summary */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

            <h2 className="text-base font-bold text-slate-900 mb-4">
              দামের সারসংক্ষেপ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] text-slate-500">
                  সর্বনিম্ন দাম
                </p>

                <p className="text-xl font-black text-emerald-600 mt-1">
                  ৳{toBengali(minPrice)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] text-slate-500">
                  সর্বোচ্চ দাম
                </p>

                <p className="text-xl font-black text-rose-600 mt-1">
                  ৳{toBengali(maxPrice)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] text-slate-500">
                  গড় দাম
                </p>

                <p className="text-xl font-black text-slate-800 mt-1">
                  ৳{toBengali(averagePrice)}
                </p>
              </div>

            </div>
          </section>

          {/* Market Prices */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

            <h2 className="text-base font-bold text-slate-900 mb-4">
              বাজারভিত্তিক আজকের দাম
            </h2>

            {markets.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                বাজারভিত্তিক তথ্য পাওয়া যায়নি।
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px] text-sm">

                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs">
                      <th className="text-left px-4 py-3">
                        বাজার
                      </th>

                      <th className="text-left px-4 py-3">
                        বিভাগ
                      </th>

                      <th className="text-right px-4 py-3">
                        সর্বনিম্ন
                      </th>

                      <th className="text-right px-4 py-3">
                        সর্বোচ্চ
                      </th>

                      <th className="text-right px-4 py-3">
                        গড়
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {markets.map((market, index) => {

                      const marketAverage = Math.round(
                        (market.min + market.max) / 2
                      );

                      return (
                        <tr
                          key={`${market.market}-${index}`}
                          className="border-b border-slate-100"
                        >
                          <td className="px-4 py-3 font-medium">
                            {market.market}
                          </td>

                          <td className="px-4 py-3 text-slate-500">
                            {market.division}
                          </td>

                          <td className="px-4 py-3 text-right">
                            ৳{toBengali(market.min)}
                          </td>

                          <td className="px-4 py-3 text-right">
                            ৳{toBengali(market.max)}
                          </td>

                          <td className="px-4 py-3 text-right font-bold">
                            ৳{toBengali(marketAverage)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>

              </div>
            )}

          </section>

          {/* Back */}
          <div className="flex justify-center pt-2">
            <Link
              href={`/category/${product.category}`}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:text-emerald-700"
            >
              ← {product.categoryNameBn} ক্যাটাগরিতে ফিরে যান
            </Link>
          </div>

        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </span>

          <span>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </span>
        </div>
      </footer>
    </div>
  );
}