"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard, { Product } from "@/components/ProductCard";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const categoryInfo: Record<
  string,
  { name: string; icon: string }
> = {
  chal: {
    name: "চাল",
    icon: "🍚",
  },
  dal: {
    name: "ডাল",
    icon: "🫘",
  },
  tel: {
    name: "তেল",
    icon: "🛢️",
  },
  sobji: {
    name: "সবজি",
    icon: "🥬",
  },
  mach: {
    name: "মাছ",
    icon: "🐟",
  },
  mangsho: {
    name: "মাংস",
    icon: "🍗",
  },
  "dim-dui": {
    name: "ডিম-দুধ",
    icon: "🥛",
  },
  mosla: {
    name: "মসলা",
    icon: "🌶️",
  },
};

function toBengaliNumber(value: number | string) {
  return value
    .toString()
    .replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();

  const slug = String(params?.slug || "");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  const category = categoryInfo[slug];

  useEffect(() => {
    let cancelled = false;

    async function fetchCategoryProducts() {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_URL}?category=${slug}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }

        const data = await response.json();

        let list: Product[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.products)) {
          list = data.products;
        } else if (Array.isArray(data?.data)) {
          list = data.data;
        } else if (Array.isArray(data?.items)) {
          list = data.items;
        }

        if (!cancelled) {
          setProducts(list);
        }
      } catch (error) {
        console.error("Category Fetch Error:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      fetchCategoryProducts();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low-high") {
      result.sort(
        (a, b) => (a.today ?? 0) - (b.today ?? 0)
      );
    }

    if (sort === "high-low") {
      result.sort(
        (a, b) => (b.today ?? 0) - (a.today ?? 0)
      );
    }

    return result;
  }, [products, sort]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#F4F6F3]">
        <Navbar />
        <CategoryFilter
          selectedCategory={null}
          onSelectCategory={() => {}}
        />

        <main className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">📦</div>

            <h1 className="text-xl font-bold text-slate-800">
              ক্যাটাগরি পাওয়া যায়নি
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি সঠিক নয়।
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              হোম পেজে ফিরে যান
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 flex flex-col">
      <Navbar />

      <CategoryFilter
        selectedCategory={slug}
        onSelectCategory={(newSlug) => {
          if (newSlug) {
            router.push(`/category/${newSlug}`);
          } else {
            router.push("/");
          }
        }}
      />

      <main className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8">

        {/* Breadcrumb */}
        <div className="text-xs text-slate-400 mb-5">
          <button
            onClick={() => router.push("/")}
            className="hover:text-emerald-600"
          >
            হোম
          </button>

          <span className="mx-2">›</span>

          <span className="text-slate-600">
            {category.name}
          </span>
        </div>

        {/* Category Header */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-7 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl">
                {category.icon}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {category.name}
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                  {category.name} বিভাগের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর।
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl px-5 py-3 text-center">
              <span className="block text-[10px] text-slate-400">
                মোট পণ্য
              </span>

              <span className="text-xl font-black text-emerald-700">
                {toBengaliNumber(products.length)}
              </span>
            </div>

          </div>
        </section>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">

          <div>
            <h2 className="font-bold text-slate-800">
              {category.name} এর পণ্য
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              বর্তমান বাজারদর অনুযায়ী পণ্যগুলো দেখুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              সাজান:
            </span>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="default">
                ডিফল্ট
              </option>

              <option value="low-high">
                কম দাম → বেশি দাম
              </option>

              <option value="high-low">
                বেশি দাম → কম দাম
              </option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                      <div className="h-3 bg-slate-200 rounded w-16" />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-5 pt-4 flex justify-between">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 rounded w-16" />
                      <div className="h-5 bg-slate-200 rounded w-20" />
                    </div>

                    <div className="h-7 w-16 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              )
            )}

          </div>
        ) : products.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-lg font-bold text-slate-700">
              কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              সব পণ্য দেখুন
            </button>

          </div>

        ) : (

          /* Products */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {sortedProducts.map((product, index) => (
              <ProductCard
                key={product.id || index}
                product={product}
              />
            ))}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center md:text-left">
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