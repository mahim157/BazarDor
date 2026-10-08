"use client";

import React from "react";
import { useRouter } from "next/navigation";

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

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory?: (slug: string | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    onSelectCategory?.(slug);
    router.push(`/category/${slug}`);
  };

  const handleAllCategoryClick = () => {
    onSelectCategory?.(null);
    router.push("/");
  };

  return (
    <div className="w-full border-b border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">

          {/* সব ক্যাটাগরি */}
          <button
            type="button"
            onClick={handleAllCategoryClick}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === null
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
            }`}
          >
            <span>🛒</span>
            <span>সব ক্যাটাগরি</span>
          </button>

          {/* Category buttons */}
          {categories.map((category) => {
            const isActive = selectedCategory === category.slug;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.slug)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.nameBn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}