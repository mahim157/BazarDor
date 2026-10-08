'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success('অ্যাাকাউন্ট তৈরি সফল হয়েছে!');
          window.location.href = '/';
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'নিবন্ধন ব্যর্থ হয়েছে');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F6F3] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-100 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">অ্যাাকাউন্ট তৈরি করুন</h1>
          <p className="text-xs text-slate-500">নতুন অ্যাকাউন্ট দিয়ে যুক্ত হন</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600"
              placeholder="আপনার নাম"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            সাইন আপ
          </button>
        </form>
      </div>
    </div>
  );
}