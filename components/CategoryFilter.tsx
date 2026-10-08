"use client";

import React from "react";

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const categories: Category[] = [
  {
    id: "chal",
    slug: "chal",
    nameBn: "চাল",
    icon: "🍚",
  },
  {
    id: "dal",
    slug: "dal",
    nameBn: "ডাল",
    icon: "🫘",
  },
  {
    id: "tel",
    slug: "tel",
    nameBn: "তেল",
    icon: "🛢️",
  },
  {
    id: "sobji",
    slug: "sobji",
    nameBn: "সবজি",
    icon: "🥬",
  },
  {
    id: "mach",
    slug: "mach",
    nameBn: "মাছ",
    icon: "🐟",
  },
  {
    id: "mangsho",
    slug: "mangsho",
    nameBn: "মাংস",
    icon: "🍗",
  },
  {
    id: "dim-dui",
    slug: "dim-dui",
    nameBn: "ডিম-দুধ",
    icon: "🥛",
  },
  {
    id: "mosla",
    slug: "mosla",
    nameBn: "মসলা",
    icon: "🌶️",
  },
];

interface Props {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <div className="w-full bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          
          {/* All Categories */}
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === null
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
            }`}
          >
            <span>🛒</span>
            <span>সব ক্যাটাগরি</span>
          </button>

          {/* Categories */}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onSelectCategory(isActive ? null : cat.slug)
                }
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}