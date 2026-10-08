"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard, { Product } from "@/components/ProductCard";
import CategorySkeleton from "./loading";

interface CategoryData {
  category: {
    id: string;
    nameBn: string;
    icon: string;
  };
  products: Product[];
  allProducts: Product[];
}

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`https://api.api-store.workers.dev/api/bazardor/categories/${categoryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid category");
        return res.json();
      })
      .then((resData) => {
        if (isMounted) {
          if (!resData || !resData.category) {
            setError(true);
          } else {
            setData(resData);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const toBengali = (num: number | string) =>
    num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

  if (loading) {
    return <CategorySkeleton />;
  }

  // 404 / Empty Category State
  if (error || !data || !data.category || data.products.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F6F3] text-slate-800 font-sans flex flex-col justify-between">
        <div>
          <Navbar />
          <CategoryFilter activeCategory={categoryId} />
          <main className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-200/80 rounded-full flex items-center justify-center text-3xl mx-auto">
              🔍
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {data?.category ? "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি" : "ক্যাটাগরি টি পাওয়া যায়নি"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              আপনার অনুরোধকৃত ক্যাটাগরি বা পণ্যের তথ্য এই মুহূর্তে উপলব্ধ নেই।
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { category, products, allProducts } = data;

  // Sorting Handler
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-low") return a.today - b.today;
    if (sortOption === "price-high") return b.today - a.today;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 font-sans flex flex-col justify-between">
      <div>
        <Navbar />
        <CategoryFilter activeCategory={category.id} />
        <PriceTicker items={allProducts || []} />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100/80 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-3xl shrink-0">
              {category.icon || "🛒"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{category.nameBn}</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                প্রতি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>

          {/* Sort Controls & Count */}
          <div className="bg-white rounded-2xl px-6 py-3.5 border border-slate-100/80 shadow-xs flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              মোট {toBengali(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">সাজান:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200/80 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
              >
                <option value="default">ডিফল্ট</option>
                <option value="price-low">দাম: কম থেকে বেশি</option>
                <option value="price-high">দাম: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Product Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200/60 bg-white/50 mt-10 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
          <span>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</span>
        </div>
      </footer>
    </div>
  );
}