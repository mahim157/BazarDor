"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard, { Product } from "@/components/ProductCard";
import CategorySkeleton from "./loading";

interface CategoryInfo {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

interface CategoryData {
  category: CategoryInfo;
  products: Product[];
  allProducts: Product[];
}

const API_BASE = "https://api.abcz.workers.dev/api/bazardor";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: categoryId } = use(params);

  const router = useRouter();

  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryData = async () => {
      setLoading(true);
      setError(false);

      try {
        const [categoryRes, productsRes, allProductsRes] =
          await Promise.all([
            fetch(`${API_BASE}/categories/${categoryId}`),
            fetch(`${API_BASE}/products?category=${categoryId}`),
            fetch(`${API_BASE}/products`),
          ]);

        if (
          !categoryRes.ok ||
          !productsRes.ok ||
          !allProductsRes.ok
        ) {
          throw new Error("Failed to fetch category data");
        }

        const categoryData = await categoryRes.json();
        const productsData = await productsRes.json();
        const allProductsData = await allProductsRes.json();

        if (!isMounted) return;

        // Category API returns one category object
        const category: CategoryInfo = categoryData;

        // Products API returns an array
        const products: Product[] = Array.isArray(productsData)
          ? productsData
          : [];

        // All products API returns an array
        const allProducts: Product[] = Array.isArray(allProductsData)
          ? allProductsData
          : [];

        if (!category || !category.id) {
          throw new Error("Invalid category data");
        }

        setData({
          category,
          products,
          allProducts,
        });

        setLoading(false);
      } catch (err) {
        console.error("Category Fetch Error:", err);

        if (isMounted) {
          setError(true);
          setData(null);
          setLoading(false);
        }
      }
    };

    fetchCategoryData();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  // Bengali number converter
  const toBengali = (num: number | string) => {
    return num
      .toString()
      .replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[parseInt(digit)]);
  };

  // Loading state
  if (loading) {
    return <CategorySkeleton />;
  }

  // Error / empty state
  if (
    error ||
    !data ||
    !data.category ||
    !data.products ||
    data.products.length === 0
  ) {
    return (
      <div className="min-h-screen bg-[#F4F6F3] text-slate-800 flex flex-col">
        <div className="flex-1">
          <Navbar />

          <CategoryFilter
            selectedCategory={categoryId}
            onSelectCategory={(newCategory) => {
              if (newCategory) {
                router.push(`/category/${newCategory}`);
              } else {
                router.push("/");
              }
            }}
          />

          <main className="max-w-md mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 bg-slate-200/80 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
              🔍
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              {data?.category
                ? "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"
                : "ক্যাটাগরিটি পাওয়া যায়নি"}
            </h1>

            <p className="text-sm text-slate-500 mt-3">
              এই ক্যাটাগরির পণ্যের তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না।
            </p>

            <Link
              href="/"
              className="inline-block mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              হোম পেজে ফিরে যান
            </Link>
          </main>
        </div>

        <footer className="border-t border-slate-200 bg-white py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center">
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

  const { category, products, allProducts } = data;

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-low") {
      return (a.today ?? 0) - (b.today ?? 0);
    }

    if (sortOption === "price-high") {
      return (b.today ?? 0) - (a.today ?? 0);
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 flex flex-col">
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Category Navigation */}
        <CategoryFilter
          selectedCategory={category.id}
          onSelectCategory={(newCategory) => {
            if (newCategory) {
              router.push(`/category/${newCategory}`);
            } else {
              router.push("/");
            }
          }}
        />

        {/* Price Ticker */}
        <PriceTicker items={allProducts} />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">

          {/* Breadcrumb */}
          <div className="text-xs text-slate-400">
            <Link
              href="/"
              className="hover:text-emerald-600 transition-colors"
            >
              হোম
            </Link>

            <span className="mx-2">›</span>

            <span className="text-slate-600">
              {category.nameBn}
            </span>
          </div>

          {/* Category Header */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              {category.icon || "🛒"}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {category.nameBn}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                এই ক্যাটাগরির পণ্যের আজকের বাজারদর
              </p>
            </div>
          </section>

          {/* Sort Toolbar */}
          <section className="bg-white rounded-2xl px-5 sm:px-6 py-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              মোট{" "}
              <span className="text-slate-800">
                {toBengali(sortedProducts.length)}
              </span>{" "}
              টি পণ্য দেখানো হচ্ছে
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">
                সাজান:
              </span>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                className="bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
              >
                <option value="default">
                  ডিফল্ট
                </option>

                <option value="price-low">
                  দাম: কম থেকে বেশি
                </option>

                <option value="price-high">
                  দাম: বেশি থেকে কম
                </option>
              </select>
            </div>
          </section>

          {/* Product Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id || index}
                  product={product}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 mt-10 py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center md:text-left">
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