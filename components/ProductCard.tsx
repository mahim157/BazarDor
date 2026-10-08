import React from "react";
import Link from "next/link";

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit: string;
  image: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;

  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };

  markets?: Market[];
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const direction = product?.change?.dir ?? "flat";
  const percentage = product?.change?.pct ?? 0;

  const toBengali = (num?: number | string) => {
    if (num === undefined || num === null) return "০";

    return num
      .toString()
      .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  const getUnit = (unit: string) => {
    if (!unit) return "একক";

    if (unit.startsWith("প্রতি")) {
      return unit;
    }

    return `প্রতি ${unit}`;
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block h-full"
    >
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        
        {/* Product Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-50 text-2xl rounded-2xl flex items-center justify-center shrink-0">
            {product.image || product.categoryIcon || "📦"}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm truncate">
              {product.nameBn}
            </h3>

            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {getUnit(product.unit)}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-end pt-4 border-t border-slate-50 mt-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              আজকের দাম
            </span>

            <span className="text-lg font-black text-slate-900">
              ৳{toBengali(product.today)}
            </span>
          </div>

          {/* Change */}
          <div
            className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
              direction === "up"
                ? "bg-emerald-50 text-emerald-600"
                : direction === "down"
                ? "bg-rose-50 text-rose-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {direction === "up" && <span>▲</span>}
            {direction === "down" && <span>▼</span>}
            {direction === "flat" && <span>—</span>}

            <span>
              {toBengali(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}