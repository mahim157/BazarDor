"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

function getDateInfo() {
  const now = new Date();

  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const englishDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);

  const banglaTime = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  const englishTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  return {
    banglaDate,
    englishDate,
    banglaTime,
    englishTime,
  };
}

export default function Navbar() {
  const [dateInfo, setDateInfo] = useState({
    banglaDate: "",
    englishDate: "",
    banglaTime: "",
    englishTime: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      setDateInfo(getDateInfo());
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="min-h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0"
          >
            <img
              src="/images/logo-icon.png"
              alt="বাজার দর"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0"
            />

            <div className="min-w-0">
              <div className="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight">
                বাজার দর
              </div>

              <div className="hidden sm:block text-[10px] text-slate-400 mt-0.5">
                {dateInfo.banglaDate}
              </div>
            </div>
          </Link>

          {/* Date & Time - Desktop */}
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-slate-600">
              {dateInfo.englishDate}
            </span>

            <span className="text-[11px] text-slate-400">
              {dateInfo.englishTime}
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/signin"
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        {/* Mobile date */}
        <div className="md:hidden pb-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>{dateInfo.banglaDate}</span>
          <span>{dateInfo.banglaTime}</span>
        </div>
      </div>
    </header>
  );
}