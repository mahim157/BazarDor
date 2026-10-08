import React from "react";
import Navbar from "@/components/Navbar";

export default function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F6F3] font-sans">
      <Navbar />

      <div className="animate-pulse">

        {/* Category Navigation Skeleton */}
        <div className="bg-white border-b border-slate-200 py-3 px-4">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-hidden">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-slate-200 rounded-full shrink-0"
              />
            ))}

          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">

          {/* Breadcrumb Skeleton */}
          <div className="h-3 bg-slate-200 rounded-md w-32" />

          {/* Category Header Skeleton */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0" />

              <div className="space-y-2">
                <div className="h-7 bg-slate-200 rounded-md w-28" />

                <div className="h-3 bg-slate-200 rounded-md w-64 max-w-full" />
              </div>

            </div>

            {/* Product Count */}
            <div className="bg-slate-200 rounded-2xl w-20 h-16 shrink-0" />

          </div>

          {/* Toolbar Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded-md w-32" />

              <div className="h-3 bg-slate-200 rounded-md w-48" />
            </div>

            <div className="h-9 bg-slate-200 rounded-lg w-36" />

          </div>

          {/* Product Card Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-100"
              >

                {/* Product top */}
                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />

                  <div className="space-y-2 flex-1">

                    <div className="h-4 bg-slate-200 rounded-md w-24" />

                    <div className="h-3 bg-slate-200 rounded-md w-16" />

                  </div>

                </div>

                {/* Product bottom */}
                <div className="border-t border-slate-100 mt-5 pt-4 flex justify-between items-end">

                  <div className="space-y-2">

                    <div className="h-2.5 bg-slate-200 rounded-md w-16" />

                    <div className="h-5 bg-slate-200 rounded-md w-20" />

                  </div>

                  <div className="h-7 bg-slate-200 rounded-lg w-16" />

                </div>

              </div>
            ))}

          </div>

        </main>
      </div>
    </div>
  );
}