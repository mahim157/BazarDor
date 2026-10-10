
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserRound, LogOut, Loader2 } from "lucide-react";

function getDateInfo() {
  const now = new Date();
  const timeZone = "Asia/Dhaka";

  return {
    banglaDate: new Intl.DateTimeFormat("bn-BD", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),

    englishDate: new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now),

    banglaTime: new Intl.DateTimeFormat("bn-BD", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(now),

    englishTime: new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(now),
  };
}

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  const [dateInfo, setDateInfo] = useState({
    banglaDate: "",
    englishDate: "",
    banglaTime: "",
    englishTime: "",
  });

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      setDateInfo(getDateInfo());
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 60_000);

    return () => clearInterval(interval);
  }, []);

  async function handleSignOut() {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "লগআউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে লগআউট হয়েছে!");
      window.location.assign("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex min-h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src="/images/logo-icon.png"
              alt="বাজার দর"
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
            />

            <div className="min-w-0">
              <div className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">
                বাজার দর
              </div>

              <div className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                {dateInfo.banglaDate}
              </div>
            </div>
          </Link>

          {/* Desktop Date and Time */}
          <div className="hidden flex-col items-end text-right md:flex">
            <span className="text-xs font-semibold text-slate-600">
              {dateInfo.englishDate}
            </span>

            <span className="text-[11px] text-slate-400">
              {dateInfo.englishTime}
            </span>
          </div>

          {/* Authentication */}
          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <Loader2
                className="h-5 w-5 animate-spin text-emerald-600"
                aria-label="Loading account"
              />
            ) : session?.user ? (
              <>
                <Link
                  href="/profile"
                  title="আপনার প্রোফাইল"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-emerald-50 sm:px-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </div>

                  <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-700 sm:block">
                    {session.user.name || session.user.email}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 sm:text-sm"
                >
                  {loggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}

                  <span className="hidden sm:inline">লগআউট</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 sm:px-4 sm:text-sm"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4 sm:text-sm"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Date and Time */}
        <div className="flex items-center justify-between pb-2 text-[10px] text-slate-400 md:hidden">
          <span>{dateInfo.banglaDate}</span>
          <span>{dateInfo.banglaTime}</span>
        </div>
      </div>
    </header>
  );
}
