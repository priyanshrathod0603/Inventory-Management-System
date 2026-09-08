'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/auth-context';
import {
  useBusinessProfile,
  useCompleteOnboarding,
  useSaveOnboardingDraft,
  BusinessType,
} from '../../hooks/use-business-profile';
import {
  Store,
  ShoppingBag,
  Footprints,
  Shirt,
  Tv,
  Armchair,
  Wrench,
  Pill,
  Tag,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  Warehouse,
  Loader2,
  LogOut,
  Sparkles,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface BusinessTypeOption {
  type: BusinessType;
  label: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  {
    type: 'GENERAL_STORE',
    label: 'General Store',
    category: 'Departmental & Kirana',
    description: 'Multi-category retail, daily essentials, FMCG, and packaged goods.',
    icon: Store,
  },
  {
    type: 'GROCERY',
    label: 'Grocery & Supermarket',
    category: 'Food & Perishables',
    description: 'Fresh produce, dairy, staples, packaged foods, and expiry management.',
    icon: ShoppingBag,
  },
  {
    type: 'FOOTWEAR',
    label: 'Footwear & Shoes',
    category: 'Apparel & Footwear',
    description: 'Size, color, gender variants, pairs, boxes, and brand categorization.',
    icon: Footprints,
  },
  {
    type: 'CLOTHING',
    label: 'Clothing & Apparel',
    category: 'Fashion & Textiles',
    description: 'Garments, fabrics, seasonal styles, color-size matrix, and tags.',
    icon: Shirt,
  },
  {
    type: 'ELECTRONICS',
    label: 'Electronics & Gadgets',
    category: 'Tech & Appliances',
    description: 'Serial tracking, warranty tracking, models, and accessories.',
    icon: Tv,
  },
  {
    type: 'FURNITURE',
    label: 'Furniture & Decor',
    category: 'Home & Living',
    description: 'Dimensions, materials, assembly sets, heavy items, and custom orders.',
    icon: Armchair,
  },
  {
    type: 'HARDWARE',
    label: 'Hardware & Tools',
    category: 'Industrial & Construction',
    description: 'Tools, fasteners, metric units, weight/length measurements, and spares.',
    icon: Wrench,
  },
  {
    type: 'PHARMACY',
    label: 'Pharmacy & Health',
    category: 'Healthcare & Pharma',
    description: 'Medicines, strict batch numbers, expiry alerts, and prescription tracking.',
    icon: Pill,
  },
  {
    type: 'RETAIL',
    label: 'Specialty Retail',
    category: 'Lifestyle & Gifts',
    description: 'Jewelry, books, stationery, cosmetics, toys, and luxury goods.',
    icon: Tag,
  },
  {
    type: 'OTHER',
    label: 'Other / Custom Business',
    category: 'Custom Commerce',
    description: 'Tailor custom inventory attributes for your unique business needs.',
    icon: HelpCircle,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, logout, refreshProfile } = useAuth();
  const { data: profileData, isLoading: isProfileLoading } = useBusinessProfile();
  const completeMutation = useCompleteOnboarding();
  const draftMutation = useSaveOnboardingDraft();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(['GENERAL_STORE']);
  const [customBusinessType, setCustomBusinessType] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('India');
  const [postalCode, setPostalCode] = useState<string>('');
  const [isGstRegistered, setIsGstRegistered] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>('');
  const [currency, setCurrency] = useState<string>('INR');
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');
  const [isMultiWarehouse, setIsMultiWarehouse] = useState<boolean>(false);

  // Initialize from existing server state
  useEffect(() => {
    if (user?.isOnboardingCompleted || profileData?.isOnboardingCompleted) {
      router.replace('/dashboard');
      return;
    }

    if (profileData?.profile) {
      const p = profileData.profile;
      if (p.businessType) {
        const types = p.businessType
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean) as BusinessType[];
        if (types.length > 0) {
          setBusinessTypes(types);
        }
      }
      if (p.customBusinessType) setCustomBusinessType(p.customBusinessType);
      if (p.businessName && p.businessName !== 'My Business') setBusinessName(p.businessName);
      if (p.ownerName) setOwnerName(p.ownerName);
      if (p.phone) setPhone(p.phone);
      if (p.whatsapp) setWhatsapp(p.whatsapp);
      if (p.email) setEmail(p.email);
      if (p.website) setWebsite(p.website);
      if (p.address) setAddress(p.address);
      if (p.city) setCity(p.city);
      if (p.state) setState(p.state);
      if (p.country) setCountry(p.country);
      if (p.postalCode) setPostalCode(p.postalCode);
      if (p.isGstRegistered !== undefined) setIsGstRegistered(p.isGstRegistered);
      if (p.gstin) setGstin(p.gstin);
      if (p.currency) setCurrency(p.currency);
      if (p.currencySymbol) setCurrencySymbol(p.currencySymbol);
      if (p.isMultiWarehouse !== undefined) setIsMultiWarehouse(p.isMultiWarehouse);
      if (profileData.onboardingStep && profileData.onboardingStep >= 1 && profileData.onboardingStep <= 4) {
        setCurrentStep(profileData.onboardingStep);
      }
    } else if (user) {
      if (user.fullName && !ownerName) setOwnerName(user.fullName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [profileData, user, router]);

  const toggleBusinessType = (type: BusinessType) => {
    setErrorMessage(null);
    setBusinessTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Currency auto-sync
  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === 'INR') setCurrencySymbol('₹');
    else if (curr === 'USD') setCurrencySymbol('$');
    else if (curr === 'EUR') setCurrencySymbol('€');
    else if (curr === 'GBP') setCurrencySymbol('£');
    else if (curr === 'AED') setCurrencySymbol('د.إ');
    else setCurrencySymbol(curr);
  };

  const handleNext = async () => {
    setErrorMessage(null);

    // Validation per step
    if (currentStep === 1) {
      if (businessTypes.length === 0) {
        setErrorMessage('Please select a business category to continue.');
        return;
      }
      if (businessTypes.includes('OTHER') && !customBusinessType.trim()) {
        setErrorMessage('Please specify your custom business type.');
        return;
      }
    } else if (currentStep === 2) {
      if (!businessName.trim()) {
        setErrorMessage('Please enter your business or store name.');
        return;
      }
    } else if (currentStep === 3) {
      if (isGstRegistered && !gstin.trim()) {
        setErrorMessage('Please enter your GSTIN or tax registration number.');
        return;
      }
    }

    // Save draft progress to backend
    try {
      await draftMutation.mutateAsync({
        businessType: businessTypes.join(','),
        customBusinessType: businessTypes.includes('OTHER') ? customBusinessType : undefined,
        businessName: businessName || 'My Business',
        ownerName,
        phone,
        whatsapp,
        email,
        website,
        address,
        city,
        state,
        country,
        postalCode,
        isGstRegistered,
        gstin: isGstRegistered ? gstin : undefined,
        currency,
        currencySymbol,
        isMultiWarehouse,
        onboardingStep: Math.min(currentStep + 1, 4),
      });
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save progress. Please try again.');
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    setErrorMessage(null);

    if (!businessName.trim()) {
      setErrorMessage('Business name is required to complete onboarding.');
      setCurrentStep(2);
      return;
    }

    try {
      await completeMutation.mutateAsync({
        businessName: businessName.trim(),
        businessType: businessTypes.join(','),
        customBusinessType: businessTypes.includes('OTHER') ? customBusinessType.trim() : undefined,
        ownerName: ownerName.trim() || undefined,
        phone: phone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        country: country.trim() || 'India',
        postalCode: postalCode.trim() || undefined,
        isGstRegistered,
        gstin: isGstRegistered ? gstin.trim() : undefined,
        currency,
        currencySymbol,
        isMultiWarehouse,
      });

      await refreshProfile();
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to finish onboarding. Please try again.');
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#FCF9F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-coral-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F6] bg-subtle-grid flex flex-col font-sans text-navy-950 antialiased selection:bg-coral-500 selection:text-white">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-[#EAE5E0] h-16 sm:h-[70px] flex items-center shadow-subtle">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-coral-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base text-navy-900 tracking-tight">StockFlow</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-coral-50 text-coral-600 border border-coral-200">
                Setup Wizard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs font-medium text-navy-600 hidden sm:inline">
                Signed in as <strong className="text-navy-900">{user.email}</strong>
              </span>
            )}
            <button
              onClick={() => logout()}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-navy-700 hover:bg-surface-subtle hover:text-navy-900 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-navy-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {[
              { num: 1, title: 'Category', desc: 'Select Type' },
              { num: 2, title: 'Profile', desc: 'Store Info' },
              { num: 3, title: 'Tax & Currency', desc: 'Legal Config' },
              { num: 4, title: 'Review', desc: 'Ready to Launch' },
            ].map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                      isDone
                        ? 'bg-coral-500 text-white shadow-sm shadow-coral-500/30'
                        : isCurrent
                        ? 'bg-navy-900 text-white ring-4 ring-coral-100'
                        : 'bg-white text-navy-400 border border-border'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </div>
                  <span
                    className={`mt-2 text-xs font-bold transition-colors ${
                      isCurrent ? 'text-coral-600' : isDone ? 'text-navy-900' : 'text-navy-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] text-navy-500 hidden sm:block">{step.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#EAE5E0] rounded-[24px] p-6 sm:p-10 shadow-card">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-center gap-3 text-danger-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: BUSINESS CATEGORY SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-200 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 1 of 4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                  What type of business do you run?
                </h2>
                <p className="text-sm text-navy-600 mt-1">
                  We customize units of measurement, barcodes, and workflow presets specifically for your industry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {BUSINESS_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = businessTypes.includes(opt.type);
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => toggleBusinessType(opt.type)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 relative ${
                        isSelected
                          ? 'border-coral-500 bg-coral-50/50 ring-2 ring-coral-500/20 shadow-sm'
                          : 'border-border bg-white hover:border-coral-200 hover:bg-surface-subtle/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-coral-500 text-white' : 'bg-surface-subtle text-navy-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-navy-950">{opt.label}</h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-coral-500" />}
                        </div>
                        <p className="text-xs text-coral-700/80 font-medium">{opt.category}</p>
                        <p className="text-[11px] text-navy-500 mt-1 line-clamp-2 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {businessTypes.includes('OTHER') && (
                <div className="pt-2 animate-fadeIn">
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Specify Your Business Type *
                  </label>
                  <input
                    type="text"
                    value={customBusinessType}
                    onChange={(e) => setCustomBusinessType(e.target.value)}
                    placeholder="e.g., Optical Store, Sports Equipment, Pet Supplies"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROFILE & STORE INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-200 text-xs font-semibold mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Step 2 of 4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                  Tell us about your store
                </h2>
                <p className="text-sm text-navy-600 mt-1">
                  This information appears on your invoices, receipts, and headers across the system.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Business / Store Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Metro Supermarket, Royal Footwear"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Owner / Manager Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    WhatsApp (For Alerts / Bills)
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Store Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., contact@store.com"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-navy-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g., Shop No. 12, Main Market Road"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Mumbai, New Delhi"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g., Maharashtra, Delhi"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Postal / PIN Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g., 400001"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., India"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TAX & LEGAL CONFIGURATION */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-200 text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Step 3 of 4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                  Tax & Currency Preferences
                </h2>
                <p className="text-sm text-navy-600 mt-1">
                  Configure your tax compliance details and standard operating currency for POS billing.
                </p>
              </div>

              {/* GST Toggle Card */}
              <div
                onClick={() => setIsGstRegistered(!isGstRegistered)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isGstRegistered
                    ? 'border-coral-500 bg-coral-50/40 ring-1 ring-coral-500/20'
                    : 'border-border bg-white hover:border-coral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center text-navy-700">
                    <ShieldCheck className="w-5 h-5 text-coral-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-950">GST / Tax Registered</h4>
                    <p className="text-xs text-navy-500">Enable if your business generates GST tax invoices</p>
                  </div>
                </div>

                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    isGstRegistered ? 'bg-coral-500' : 'bg-surface-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isGstRegistered ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Conditional GSTIN Field */}
              {isGstRegistered && (
                <div className="p-4 rounded-2xl bg-surface-subtle/50 border border-border space-y-3 animate-fadeIn">
                  <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider">
                    GSTIN / Tax Registration Number *
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g., 27AAAAA0000A1Z5"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm font-mono uppercase text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                  <p className="text-[11px] text-navy-500">
                    Your 15-digit GSTIN will be printed on all POS receipts, tax invoices, and B2B bills.
                  </p>
                </div>
              )}

              {/* Currency Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider">
                  Operating Currency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
                    { code: 'USD', symbol: '$', label: 'US Dollar' },
                    { code: 'EUR', symbol: '€', label: 'Euro' },
                    { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
                  ].map((curr) => {
                    const isSelected = currency === curr.code;
                    return (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => handleCurrencyChange(curr.code)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-coral-500 bg-coral-50/50 ring-2 ring-coral-500/20 font-bold'
                            : 'border-border bg-white hover:border-coral-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base font-bold text-navy-950">{curr.symbol}</span>
                          <span className="text-xs font-mono text-coral-600">{curr.code}</span>
                        </div>
                        <p className="text-[11px] text-navy-500 truncate">{curr.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & MULTI-WAREHOUSE CAPABILITY */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-200 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 4 of 4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                  Review & Launch Store
                </h2>
                <p className="text-sm text-navy-600 mt-1">
                  Confirm your store configuration. You can edit any of these details later under Store Settings.
                </p>
              </div>

              {/* Multi-Warehouse Capability Toggle */}
              <div
                onClick={() => setIsMultiWarehouse(!isMultiWarehouse)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isMultiWarehouse
                    ? 'border-coral-500 bg-coral-50/40 ring-1 ring-coral-500/20'
                    : 'border-border bg-white hover:border-coral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center text-navy-700">
                    <Warehouse className="w-5 h-5 text-coral-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-950">Multi-Location & Warehouse Mode</h4>
                    <p className="text-xs text-navy-500">
                      Enable if you operate multiple branches, stock rooms, or fulfillment centers
                    </p>
                  </div>
                </div>

                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    isMultiWarehouse ? 'bg-coral-500' : 'bg-surface-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isMultiWarehouse ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Summary Overview */}
              <div className="p-5 rounded-2xl bg-[#FCF9F6] border border-[#EAE5E0] space-y-4">
                <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                  Store Profile Summary
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-navy-500 block">Business Name</span>
                    <strong className="text-navy-950 font-bold text-sm">{businessName || 'My Business'}</strong>
                  </div>

                  <div>
                    <span className="text-navy-500 block">Category</span>
                    <strong className="text-navy-950 font-bold">
                      {businessTypes
                        .map((t) => {
                          if (t === 'OTHER') return customBusinessType.trim() || 'Custom';
                          const opt = BUSINESS_TYPE_OPTIONS.find((b) => b.type === t);
                          return opt ? opt.label : t;
                        })
                        .join(', ') || 'None'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-navy-500 block">Currency</span>
                    <strong className="text-navy-950 font-bold font-mono">
                      {currency} ({currencySymbol})
                    </strong>
                  </div>

                  <div>
                    <span className="text-navy-500 block">Owner / Contact</span>
                    <span className="text-navy-800 font-medium">
                      {ownerName || phone || user?.fullName || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-navy-500 block">Tax / GST Status</span>
                    <span className="text-navy-800 font-medium">
                      {isGstRegistered ? `GST Registered (${gstin || 'Pending'})` : 'Unregistered / Retail'}
                    </span>
                  </div>

                  <div>
                    <span className="text-navy-500 block">Warehouse Model</span>
                    <span className="text-navy-800 font-medium">
                      {isMultiWarehouse ? 'Multi-Warehouse' : 'Single Main Store (Default)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#EAE5E0] flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={draftMutation.isPending || completeMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-navy-700 hover:bg-surface-subtle hover:text-navy-900 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={draftMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-coral-500/25 transition-all disabled:opacity-50"
                >
                  {draftMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={completeMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 active:scale-[0.98] text-white text-xs font-bold shadow-lg shadow-coral-500/30 transition-all disabled:opacity-50"
                >
                  {completeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Launching Your Store...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Launch Store & Go to Dashboard</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
