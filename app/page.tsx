"use client";

import React, { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard, { Product } from "@/components/ProductCard";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const [todayDate, setTodayDate] = useState<string>("");

  // =========================
  // Dynamic Bangladesh Date
  // =========================

  useEffect(() => {
    const updateDate = () => {
      const formattedDate = new Intl.DateTimeFormat("bn-BD", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());

      setTodayDate(formattedDate);
    };

    updateDate();

    const interval = setInterval(updateDate, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // Fetch Products
  // =========================

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const url =
          selectedCategory && selectedCategory !== "all"
            ? `${API_URL}?category=${selectedCategory}`
            : API_URL;

        console.log("Fetching:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
          );
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

        if (!list.length) {
          throw new Error("API returned no products");
        }

        if (!cancelled) {
          setProducts(list);
        }
      } catch (error) {
        console.error("Product Fetch Error:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  // =========================
  // Price Increased Products
  // =========================

  const priceUpProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) -
        (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  // =========================
  // Price Decreased Products
  // =========================

  const priceDownProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) -
        (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  // =========================
  // Render
  // =========================

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 font-sans flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Price Ticker */}
      <PriceTicker items={products} />

      <main className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 space-y-10">

        {/* =========================
            Hero Section
        ========================== */}

        <section className="bg-[#EBF3E8] rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Hero Content */}

            <div className="w-full md:max-w-2xl space-y-4">

              {/* Current Date */}

              <span className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full inline-block">
                {todayDate || "আজকের তারিখ"}
              </span>

              {/* Heading */}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                আজকের বাজারের দর এক নজরে
              </h1>

              {/* Description */}

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                প্রতিদিনের সব তাজা পণ্যের সঠিক দাম এবং দর
                পরিবর্তনের তথ্য এক নজরে দেখুন। বাজারের
                নিত্যপ্রয়োজনীয় পণ্যের দরদাম পান সহজে।
              </p>

              {/* CTA */}

              <div className="pt-2">
                <a
                  href="#সব-পণ্য"
                  className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-all shadow-sm"
                >
                  সব পণ্য দেখুন
                </a>
              </div>
            </div>

            {/* Hero Image */}

            <div className="shrink-0 flex items-center justify-center">
              <img
                src="/images/bazar-hero.png"
                alt="বাজারের ঝুড়ি"
                className="w-28 sm:w-36 md:w-40 lg:w-48 h-auto object-contain"
              />
            </div>

          </div>
        </section>

        {/* =========================
            Loading State
        ========================== */}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
            ))}

          </div>
        ) : (
          <>

            {/* =========================
                Price Increased
            ========================== */}

            {priceUpProducts.length > 0 && (
              <section className="space-y-4">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    দাম বেড়েছে ▲

                    <span className="text-slate-400 text-sm ml-1">
                      ({priceUpProducts.length})
                    </span>
                  </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                  {priceUpProducts.map((product, index) => (
                    <ProductCard
                      key={product.id || index}
                      product={product}
                    />
                  ))}

                </div>

              </section>
            )}

            {/* =========================
                Price Decreased
            ========================== */}

            {priceDownProducts.length > 0 && (
              <section className="space-y-4">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />

                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    দাম কমেছে ▼

                    <span className="text-slate-400 text-sm ml-1">
                      ({priceDownProducts.length})
                    </span>
                  </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                  {priceDownProducts.map((product, index) => (
                    <ProductCard
                      key={product.id || index}
                      product={product}
                    />
                  ))}

                </div>

              </section>
            )}

            {/* =========================
                All Products
            ========================== */}

            <section
              id="সব-পণ্য"
              className="space-y-4 scroll-mt-24"
            >

              <div>

                <h2 className="text-base sm:text-lg font-bold text-slate-800">

                  {selectedCategory &&
                  selectedCategory !== "all"
                    ? "ক্যাটাগরির পণ্য"
                    : "সব পণ্য"}

                  <span className="text-slate-400 text-sm ml-1">
                    ({products.length})
                  </span>

                </h2>

                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর দেখুন।
                </p>

              </div>

              {/* Empty State */}

              {products.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center border border-slate-100">

                  <div className="text-4xl mb-3">
                    📦
                  </div>

                  <p className="font-semibold text-slate-700">
                    কোনো পণ্য পাওয়া যায়নি।
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    API থেকে পণ্যের তথ্য পাওয়া যাচ্ছে না।
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategory(null)
                    }
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    আবার চেষ্টা করুন
                  </button>

                </div>
              ) : (

                /* Product Grid */

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id || index}
                      product={product}
                    />
                  ))}

                </div>
              )}

            </section>

          </>
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