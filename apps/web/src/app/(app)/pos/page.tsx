'use client';

import React, { useState, useEffect } from 'react';
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
import { useCategories } from '../../../hooks/use-categories';
import { useBusinessProfile } from '../../../hooks/use-business-profile';
import { CustomerFormModal } from '../../../components/customers/customer-form-modal';
import { Customer } from '../../../hooks/use-customers';

export default function PosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTender, setSelectedTender] = useState<'CASH' | 'UPI' | 'CARD' | 'CREDIT'>('CASH');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<{ name: string; phone?: string | null; isWalkIn: boolean }>({
    name: 'Walk-in Customer',
    isWalkIn: true,
  });

  const { data: profileData } = useBusinessProfile();
  const currencySymbol = profileData?.profile?.currencySymbol || '₹';

  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data || [];

  // Alt+C / F4 Keyboard shortcut handler for New Customer modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'c' || e.key === 'C')) || e.key === 'F4') {
        e.preventDefault();
        setIsCustomerModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-[calc(100vh-88px)] flex flex-col justify-between">
      {/* 2-Panel High-Velocity Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left 60% Panel (Cols 7/12): Barcode Search, Category Chips & Live Cart */}
        <div className="lg:col-span-7 bg-white border border-border rounded-[24px] shadow-card flex flex-col overflow-hidden">
          {/* Top Search & Barcode Bar */}
          <div className="p-3.5 border-b border-border bg-surface-subtle/50">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-muted">
                <Barcode className="w-5 h-5 text-coral-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="[F2] Scan barcode or search product by Name, SKU..."
                className="w-full pl-11 pr-28 py-2.5 bg-white border border-border rounded-full text-sm text-navy-950 placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2 pointer-events-none">
                <span className="px-2 py-0.5 bg-coral-50 border border-coral-200 text-[10px] font-mono text-coral-700 font-bold rounded-full">
                  F2
                </span>
                <span className="text-[11px] text-content-muted font-medium hidden sm:inline">Scanner Ready</span>
              </div>
            </div>

            {/* Quick Category Filter Chips */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3.5 py-1 rounded-full font-semibold text-[11px] shrink-0 transition cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-coral-500 text-white shadow-xs'
                    : 'bg-white border border-border text-content-secondary hover:text-navy-950 hover:bg-surface-subtle'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1 rounded-full font-semibold text-[11px] shrink-0 transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-coral-500 text-white shadow-xs'
                      : 'bg-white border border-border text-content-secondary hover:text-navy-950 hover:bg-surface-subtle'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Items Container */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center text-center bg-surface-subtle/30">
            <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 text-coral-500 flex items-center justify-center mb-3 shadow-xs">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Billing Cart is Empty</h3>
            <p className="text-xs text-content-secondary max-w-xs mb-4 leading-relaxed">
              Scan a product barcode or use the search bar above to add items to this counter bill.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-content-secondary bg-white border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <span>Press <kbd className="px-1.5 py-0.5 bg-surface-subtle border border-border rounded-full font-mono text-[10px] text-navy-950 font-bold">F2</kbd> to focus barcode input</span>
            </div>
          </div>
        </div>

        {/* Right 40% Panel (Cols 5/12): Customer, Summary, Payment & Complete Sale */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 min-h-0">
          {/* Customer Selection Card */}
          <div className="bg-white border border-border rounded-[20px] p-3.5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider">
                Customer Details
              </span>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(true)}
                className="text-xs text-coral-600 hover:text-coral-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Customer (Alt+C)</span>
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-surface-subtle text-content-secondary flex items-center justify-center shrink-0 border border-border">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-navy-950 truncate font-sans">
                  {activeCustomer.name}
                </div>
                <div className="text-[10px] text-content-muted font-mono truncate">
                  {activeCustomer.phone ? `Phone: ${activeCustomer.phone}` : 'No credit balance • Standard Retail'}
                </div>
              </div>
              {activeCustomer.isWalkIn ? (
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                  Walk-In
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveCustomer({ name: 'Walk-in Customer', isWalkIn: true })}
                  className="px-2 py-0.5 bg-surface-subtle text-content-secondary hover:text-danger-600 border border-border text-[10px] font-bold rounded-full cursor-pointer transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Billing Calculation Summary Card */}
          <div className="flex-1 bg-white border border-border rounded-[20px] p-4 sm:p-5 shadow-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-content-secondary font-medium">
                <span>Subtotal (0 items)</span>
                <span className="font-bold text-navy-950 tabular-nums">{currencySymbol}0.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-content-secondary font-medium">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-content-muted" />
                  <span>Item &amp; Order Discounts</span>
                </span>
                <span className="text-content-muted tabular-nums">- {currencySymbol}0.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-content-secondary font-medium">
                <span>GST Tax (Included)</span>
                <span className="text-content-muted tabular-nums">{currencySymbol}0.00</span>
              </div>

              <div className="pt-3 border-t border-border flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-extrabold text-navy-950 uppercase tracking-wider font-sans">
                    Grand Total
                  </div>
                  <div className="text-[10px] text-content-muted">Total payable amount</div>
                </div>
                <div className="text-3xl font-black text-coral-600 tabular-nums font-sans tracking-tight">
                  {currencySymbol}0.00
                </div>
              </div>

              {/* Payment Tender Modes */}
              <div className="pt-2">
                <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-2">
                  Tender Payment Mode
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTender('CASH')}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-[11px] font-bold transition cursor-pointer ${
                      selectedTender === 'CASH'
                        ? 'border-coral-500 bg-coral-50 text-coral-700 shadow-xs'
                        : 'border-border bg-white text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTender('UPI')}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-[11px] font-bold transition cursor-pointer ${
                      selectedTender === 'UPI'
                        ? 'border-coral-500 bg-coral-50 text-coral-700 shadow-xs'
                        : 'border-border bg-white text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTender('CARD')}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-[11px] font-bold transition cursor-pointer ${
                      selectedTender === 'CARD'
                        ? 'border-coral-500 bg-coral-50 text-coral-700 shadow-xs'
                        : 'border-border bg-white text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTender('CREDIT')}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-[11px] font-bold transition cursor-pointer ${
                      selectedTender === 'CREDIT'
                        ? 'border-coral-500 bg-coral-50 text-coral-700 shadow-xs'
                        : 'border-border bg-white text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Credit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Dock */}
            <div className="space-y-2 mt-4 pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-10 bg-white border border-border hover:bg-surface-subtle text-navy-950 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <PauseCircle className="w-4 h-4 text-content-muted" />
                  <span>[F6] Hold Bill</span>
                </button>
                <button
                  type="button"
                  className="h-10 bg-white border border-border hover:bg-surface-subtle text-navy-950 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-content-muted" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                type="button"
                disabled
                className="w-full h-12 bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm rounded-full shadow-coral flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>[F8] COMPLETE SALE &amp; TENDER</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Shortcut Bar */}
      <div className="mt-3 px-4 py-2 bg-white border border-border rounded-full flex items-center justify-between text-xs text-content-secondary shadow-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span><kbd className="px-1.5 py-0.5 bg-surface-subtle border border-border rounded-full font-mono text-[10px] text-navy-950 font-bold">F2</kbd> Product Scan</span>
          <span><kbd className="px-1.5 py-0.5 bg-surface-subtle border border-border rounded-full font-mono text-[10px] text-navy-950 font-bold">F4</kbd> Customer Phone</span>
          <span><kbd className="px-1.5 py-0.5 bg-surface-subtle border border-border rounded-full font-mono text-[10px] text-navy-950 font-bold">F6</kbd> Hold Bill</span>
          <span><kbd className="px-1.5 py-0.5 bg-surface-subtle border border-border rounded-full font-mono text-[10px] text-navy-950 font-bold">F8</kbd> Tender / Checkout</span>
        </div>
        <span className="font-semibold text-content-muted hidden sm:inline">Terminal #1 • Active</span>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerCreated={(newCust) => {
          setActiveCustomer({
            name: newCust.name,
            phone: newCust.phone,
            isWalkIn: false,
          });
        }}
      />
    </div>
  );
}
