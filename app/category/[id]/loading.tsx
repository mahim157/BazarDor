import React from "react";
import Navbar from "@/components/Navbar";

export default function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F6F3] font-sans">
      <Navbar />
      <div className="animate-pulse">
        <div className="bg-white border-b border-slate-200 py-3 px-4">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-20 bg-slate-200 rounded-full shrink-0" />
            ))}
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-200 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-slate-200 rounded-md w-32" />
              <div className="h-3 bg-slate-200 rounded-md w-48" />
            </div>
          </div>

          <div className="bg-white rounded-2xl px-6 py-4 border border-slate-100 flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded-md w-36" />
            <div className="h-8 bg-slate-200 rounded-lg w-28" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-200 rounded-md w-24" />
                    <div className="h-3 bg-slate-200 rounded-md w-14" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 rounded-md w-20" />
                  <div className="h-5 bg-slate-200 rounded-md w-12" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}