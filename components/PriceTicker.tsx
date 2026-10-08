import React from "react";
import { Product } from "./ProductCard";

export default function PriceTicker({ items = [] }: { items?: Product[] }) {
  const toBengali = (num?: number | string) => {
    if (num === undefined || num === null) return "";
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-200/60 overflow-hidden py-2 text-xs font-semibold">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {items.map((item, index) => (
          <div key={item.id || index} className="inline-flex items-center gap-2">
            <span className="text-slate-700">{item.nameBn}</span>
            <span className="text-emerald-600 font-bold">
              ৳{toBengali(item.today)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}