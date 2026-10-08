'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PriceTicker from '@/components/PriceTicker';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard, { Product } from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('https://api.api-store.workers.dev/api/bazardor/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products by active category
  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.category === selectedCategory ||
          p.categoryNameBn === selectedCategory ||
          p.slug === selectedCategory
      )
    : products;

  // Top 6 Risers and Top 6 Fallers for Section A and Section B
  const risers = products.filter((p) => p.change?.dir === 'up').slice(0, 6);
  const fallers = products.filter((p) => p.change?.dir === 'down').slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 font-sans pb-16">
      {/* 1. Header & Navbar */}
      <Navbar />

      {/* 2. Price Ticker (Infinite Scrolling Bar) */}
      {products.length > 0 && <PriceTicker items={products} />}

      <main className="max-w-5xl mx-auto px-4 pt-4 space-y-8">
        {/* 3. Category Nav / Filter Row */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* 4. Hero / Banner Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
          <div className="space-y-3 max-w-lg z-10">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
              বৃহস্পতিবার, ৮ অক্টোবর, ২০২৬
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <a
              href="#সব-পণ্য"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="text-8xl select-none py-2">
            🧺🥦🍎
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-medium">
            বাজার দর আপডেট হচ্ছে...
          </div>
        ) : (
          <>
            {/* 5. Section A — আজ দাম বেড়েছে (Top 6) */}
            {!selectedCategory && risers.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-rose-600 font-black text-lg">▲</span>
                  <h2 className="text-lg font-bold text-slate-900">আজ দাম বেড়েছে</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {risers.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id}>
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Section B — আজ দাম কমেছে (Top 6) */}
            {!selectedCategory && fallers.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-lg">▼</span>
                  <h2 className="text-lg font-bold text-slate-900">আজ দাম কমেছে</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fallers.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id}>
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Section C — সব পণ্য (#সব-পণ্য) */}
            <section id="সব-পণ্য" className="space-y-4 pt-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedCategory ? 'ফিল্টারকৃত পণ্যসমূহ' : 'সব পণ্য'}
                </h2>
                <p className="text-xs text-slate-400">
                  মোট {filteredProducts.length}টি পণ্যের তালিকা দেখানো হচ্ছে
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}