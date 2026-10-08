import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            🛒
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-800 leading-none block">বাজার দর</span>
            <span className="text-[10px] text-slate-400 font-medium">মঙ্গলবার, ৬ অক্টোবর, ২০২৬</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-full"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
              👤
            </div>
            <span>Rezwan</span>
          </Link>
        </div>
      </div>
    </header>
  );
}