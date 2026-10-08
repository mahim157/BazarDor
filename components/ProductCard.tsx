import React from 'react';

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
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

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === 'up';
  const isDown = product.change.dir === 'down';

  const toBengali = (num: number | string) =>
    num.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex justify-between items-start group">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-50/60 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
            {product.categoryIcon || product.image || '🍚'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              {product.nameBn}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {product.categoryNameBn} • প্রতি {product.unit === 'kg' ? 'কেজি' : product.unit}
            </p>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">আজকের দাম</span>
          <span className="font-black text-slate-900 text-lg">
            {toBengali(product.today)} টাকা
          </span>
        </div>
      </div>

      <div className="self-end">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg ${
            isUp
              ? 'bg-rose-50 text-rose-600'
              : isDown
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isUp ? '▲' : isDown ? '▼' : '—'} {toBengali(Math.abs(product.change.pct).toFixed(1))}%
        </span>
      </div>
    </div>
  );
}