'use client';

import React, { useState } from 'react';
import {
  Search,
  Barcode,
  ShoppingCart,
  User,
  Plus,
  Trash2,
  Receipt,
  PauseCircle,
  PlayCircle,
  Printer,
  CreditCard,
  QrCode,
  Banknote,
  Percent,
} from 'lucide-react';

export default function PosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Rice & Grains', 'Edible Oils', 'Dairy', 'Spices', 'Snacks', 'Beverages'];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* 2-Panel High-Velocity Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left 60% Panel (Cols 7/12): Barcode Search, Category Chips & Live Cart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col overflow-hidden">
          {/* Top Search & Barcode Bar */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Barcode className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="[F2] Scan barcode or search product by Name, SKU..."
                className="w-full pl-10 pr-24 py-2.5 bg-white border border-indigo-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs transition"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 pointer-events-none">
                <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[10px] font-mono text-indigo-700 font-bold rounded">
                  F2
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Scanner Ready</span>
              </div>
            </div>

            {/* Quick Category Filter Chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md font-semibold text-[11px] shrink-0 transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Items Container */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center items-center text-center bg-slate-50/30">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center mb-3 shadow-xs">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Billing Cart is Empty</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Scan a product barcode or use the search bar above to add items to this counter bill.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
              <span>Press <kbd className="px-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">F2</kbd> to focus barcode input</span>
            </div>
          </div>
        </div>

        {/* Right 40% Panel (Cols 5/12): Customer, Summary, Payment & Complete Sale */}
        <div className="lg:col-span-5 flex flex-col gap-3 min-h-0">
          {/* Customer Selection Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Customer Details
              </span>
              <button
                type="button"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Customer (Alt+C)</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Walk-in Customer</div>
                <div className="text-[10px] text-slate-400 font-mono">No credit balance • Standard Retail</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-full">
                Walk-In
              </span>
            </div>
          </div>

          {/* Billing Calculation Summary Card */}
          <div className="flex-1 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal (0 items)</span>
                <span className="font-semibold tabular-nums">₹0.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Percent className="w-3 h-3 text-slate-400" />
                  <span>Item & Order Discounts</span>
                </span>
                <span className="text-slate-500 tabular-nums">- ₹0.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>GST Tax (Included)</span>
                <span className="text-slate-500 tabular-nums">₹0.00</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Grand Total
                  </div>
                  <div className="text-[10px] text-slate-400">Total payable amount</div>
                </div>
                <div className="text-2xl font-bold text-indigo-700 tabular-nums font-sans">
                  ₹0.00
                </div>
              </div>

              {/* Payment Tender Modes */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Tender Payment Mode
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    className="p-2 rounded-lg border border-indigo-600 bg-indigo-50/80 text-indigo-700 flex flex-col items-center gap-1 text-[11px] font-bold transition"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center gap-1 text-[11px] font-medium transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center gap-1 text-[11px] font-medium transition"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center gap-1 text-[11px] font-medium transition"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Credit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Dock */}
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-10 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <PauseCircle className="w-4 h-4 text-slate-500" />
                  <span>[F6] Hold Bill</span>
                </button>
                <button
                  type="button"
                  className="h-10 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Last Receipt</span>
                </button>
              </div>

              <button
                type="button"
                disabled
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>[F8] COMPLETE SALE & TENDER</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Shortcut Bar */}
      <div className="mt-3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">F2</kbd> Product Scan</span>
          <span><kbd className="px-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">F4</kbd> Customer Phone</span>
          <span><kbd className="px-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">F6</kbd> Hold Bill</span>
          <span><kbd className="px-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">F8</kbd> Tender / Checkout</span>
        </div>
        <span className="font-medium text-slate-400">Terminal #1 • Active</span>
      </div>
    </div>
  );
}
