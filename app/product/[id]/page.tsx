import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// Next.js 16 এ ডাইনামিক রেন্ডারিং এলাউ করার জন্য
export const instant = false;

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface SingleProduct {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
  markets: Market[];
}

async function getProductById(id: string): Promise<SingleProduct | null> {
  // ক্যাশ ব্যবহার করার নির্দেশনা
  'use cache';
  
  try {
    const res = await fetch(`https://api.api-store.workers.dev/api/bazardor/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F6F3] text-slate-800 font-sans">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">পণ্যটি পাওয়া যায়নি</h1>
          <Link href="/" className="inline-block bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const toBengali = (num: number | string) =>
    num.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);

  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 pb-12 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600">
          ← সব পণ্য
        </Link>

        {/* Product Overview Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl">
                {product.categoryIcon || product.image}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {product.categoryNameBn}
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-1">{product.nameBn}</h1>
                <p className="text-xs text-slate-400 font-medium">প্রতি {product.unit === 'kg' ? 'কেজি' : product.unit}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-xs text-slate-400 block">আজকের গড় দাম</span>
                <span className="text-3xl font-black text-slate-900">{toBengali(product.today)} টাকা</span>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                isUp ? 'bg-rose-50 text-rose-600' : isDown ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {isUp ? '▲' : isDown ? '▼' : '—'} {toBengali(Math.abs(product.change?.pct ?? 0))}%
              </span>
            </div>
          </div>

          {/* Price History Grid */}
          <div>
            <h2 className="text-sm font-bold text-slate-700 mb-3">মূল্য ইতিহাস</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">গতকাল</span>
                <span className="text-base font-bold text-slate-800">{toBengali(product.yesterday)} টাকা</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">গত সপ্তাহ</span>
                <span className="text-base font-bold text-slate-800">{toBengali(product.lastWeek)} টাকা</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">গত মাস</span>
                <span className="text-base font-bold text-slate-800">{toBengali(product.lastMonth)} টাকা</span>
              </div>
            </div>
          </div>
        </div>

        {/* Division & Market Wise Price Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            বাজারভিত্তিক মূল্যের তালিকা ({toBengali(product.markets?.length ?? 0)}টি বাজার)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.markets?.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{m.market}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{m.division} বিভাগ</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {toBengali(m.min)} - {toBengali(m.max)} টাকা
                  </span>
                  <span className="text-[10px] text-slate-400">সর্বনিম্ন - সর্বোচ্চ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}