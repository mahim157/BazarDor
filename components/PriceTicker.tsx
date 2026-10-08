import React from 'react';
import { Product } from '@/components/ProductCard';

export default function PriceTicker({ items }: { items: Product[] }) {
  const toBengali = (num: number | string) =>
    num.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);

  return (
    <div className="bg-white border-b border-slate-200/60 overflow-hidden py-2 text-xs font-semibold">
      <div className="flex whitespace-nowrap animate-marquee space-x-8 items-center">
        {items.map((item) => {
          const isUp = item.change?.dir === 'up';
          const isDown = item.change?.dir === 'down';
          const pct = item.change?.pct ?? 0;

          return (
            <div key={item.id} className="inline-flex items-center space-x-2 px-3">
              <span>{item.categoryIcon || item.image || '🛒'}</span>
              <span className="text-slate-700">{item.nameBn}</span>
              <span className="text-slate-900 font-bold">
                {toBengali(item.today)} টাকা/{item.unit === 'kg' ? 'কেজি' : item.unit}
              </span>
              <span
                className={`text-[11px] font-bold ${
                  isUp ? 'text-rose-600' : isDown ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {isUp ? '▲' : isDown ? '▼' : '—'} {toBengali(Math.abs(pct))}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}