'use client';

import React from 'react';

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const categories: Category[] = [
  { id: 'chal', slug: 'chal', nameBn: 'চাল', icon: '🍚' },
  { id: 'dal', slug: 'dal', nameBn: 'ডাল', icon: '🫘' },
  { id: 'tel', slug: 'tel', nameBn: 'তেল', icon: '🛢️' },
  { id: 'sobji', slug: 'sobji', nameBn: 'সবজি', icon: '🥬' },
  { id: 'mach', slug: 'mach', nameBn: 'মাছ', icon: '🐟' },
  { id: 'mangsho', slug: 'mangsho', nameBn: 'মাংস', icon: '🍗' },
  { id: 'dim-dui', slug: 'dim-dui', nameBn: 'ডিম-দুধ', icon: '🥛' },
  { id: 'mosla', slug: 'mosla', nameBn: 'মসলা', icon: '🌶️' },
];

interface Props {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
          selectedCategory === null
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
        }`}
      >
        <span>🛒</span>
        <span>সব ক্যাটাগরি</span>
      </button>

      {categories.map((cat) => {
        const isActive = selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isActive ? null : cat.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.nameBn}</span>
          </button>
        );
      })}
    </div>
  );
}