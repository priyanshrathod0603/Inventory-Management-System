'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, Loader2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Customer, useCreateCustomer } from '../../hooks/use-customers';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated?: (customer: Customer) => void;
}

export function CustomerFormModal({ isOpen, onClose, onCustomerCreated }: CustomerFormModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [creditLimit, setCreditLimit] = useState<string>('0');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomerMutation = useCreateCustomer();
  const isPending = createCustomerMutation.isPending;

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPending, onClose]);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setGstin('');
      setCreditLimit('0');
      setIsAdvancedOpen(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone / Mobile number is required.');
      return;
    }

    try {
      const newCustomer = await createCustomerMutation.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        gstin: gstin.trim() ? gstin.trim().toUpperCase() : undefined,
        creditLimit: Number(creditLimit) || 0,
      });

      if (onCustomerCreated && newCustomer) {
        onCustomerCreated(newCustomer);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create customer. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white border border-[#EAE5E0] rounded-[28px] w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(17,23,34,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#EAE5E0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111722] font-sans tracking-tight">
                New Customer Account
              </h3>
              <p className="text-xs text-[#5F636B] mt-0.5">
                Register customer for POS billing, invoices, and ledger records
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-full text-[#8C9097] hover:text-[#111722] hover:bg-[#FAF7F4] border border-transparent hover:border-[#EAE5E0] transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3.5 bg-danger-50 border border-danger-200 text-danger-700 rounded-2xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-danger-600" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Core Fast Fields */}
            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Customer / Business Name <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar or Sharma Enterprises"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111722] mb-1.5">
                  Mobile / Phone Number <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111722] mb-1.5">
                  Email Address <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition"
                />
              </div>
            </div>

            {/* Progressive Disclosure Section: Tax & Credit Details */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen((prev) => !prev)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF7F4] border border-[#EAE5E0] text-xs font-bold text-[#111722] flex items-center justify-between hover:bg-[#F2ECE6] transition cursor-pointer"
              >
                <span>Additional Information &amp; Credit Limits</span>
                {isAdvancedOpen ? <ChevronUp className="w-4 h-4 text-[#8C9097]" /> : <ChevronDown className="w-4 h-4 text-[#8C9097]" />}
              </button>

              {isAdvancedOpen && (
                <div className="mt-3 p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111722] mb-1.5">
                        GSTIN / Tax ID <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] font-mono uppercase transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111722] mb-1.5">
                        Credit Limit (₹) <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] tabular-nums font-mono transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111722] mb-1.5">
                      Billing / Delivery Address <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, city, pincode..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-white border-t border-[#EAE5E0] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 h-11 rounded-full border border-[#EAE5E0] bg-white hover:bg-[#FAF7F4] text-[#111722] text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="pill-btn-coral px-6 h-11 rounded-full text-white text-xs font-bold shadow-coral transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Saving Customer...</span>
                </>
              ) : (
                <span>Register Customer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
