'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { useCurrentUser } from '../../../hooks/use-current-user';
import { useHealthLiveness, useHealthReadiness } from '../../../hooks/use-health';
import {
  useBusinessProfile,
  useUpdateBusinessProfile,
  BusinessType,
} from '../../../hooks/use-business-profile';
import {
  User,
  Shield,
  Activity,
  Building,
  Receipt,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Key,
  Building2,
  Phone,
  Globe,
  MapPin,
  Warehouse,
  ShieldCheck,
  Save,
  Loader2,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'health'>('profile');
  const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError, refetch: refetchUser } = useCurrentUser();
  const { data: liveness, isLoading: isLivenessLoading, refetch: refetchLiveness } = useHealthLiveness();
  const { data: readiness, isLoading: isReadinessLoading, refetch: refetchReadiness } = useHealthReadiness();

  // Universal Admin Access Model: fixed coral Admin badge for all users
  const adminBadgeColor = 'bg-coral-50 text-coral-700 border-coral-200';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings &amp; Account Profile"
        description="View authenticated user permissions, system health status, and store configuration."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Settings' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs Column */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs'
                : 'text-[#5F636B] hover:bg-[#F8F5F2] hover:text-[#111722]'
            }`}
          >
            <User className="w-4 h-4 text-coral-600" />
            <span>Profile &amp; Permissions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'company'
                ? 'bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs'
                : 'text-[#5F636B] hover:bg-[#F8F5F2] hover:text-[#111722]'
            }`}
          >
            <Building className="w-4 h-4 text-[#8C9097]" />
            <span>Store Master Data</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'health'
                ? 'bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs'
                : 'text-[#5F636B] hover:bg-[#F8F5F2] hover:text-[#111722]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#8C9097]" />
            <span>System Diagnostics</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3">
          {/* TAB 1: Profile & Permissions */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
                    User Account &amp; System Access
                  </h3>
                  <p className="text-xs text-[#5F636B] mt-1">
                    Authenticated session details and assigned operational privileges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => refetchUser()}
                  className="p-2 bg-[#FAF7F4] hover:bg-[#F2ECE6] border border-[#EAE5E0] rounded-full text-[#5F636B] transition shadow-xs cursor-pointer"
                  title="Refresh profile"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {isUserLoading && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-16 bg-[#FAF7F4] rounded-2xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-[#FAF7F4] rounded-xl" />
                    <div className="h-12 bg-[#FAF7F4] rounded-xl" />
                  </div>
                  <div className="h-28 bg-[#FAF7F4] rounded-2xl" />
                </div>
              )}

              {isUserError && (
                <div className="p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-start justify-between gap-3 text-danger-700 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
                    <span>Failed to load profile: {userError?.message || 'Unauthorized or server error'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => refetchUser()}
                    className="underline font-bold hover:text-danger-800"
                  >
                    Retry
                  </button>
                </div>
              )}

              {user && (
                <div className="space-y-6">
                  {/* User Profile Header Card */}
                  <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-coral-100 text-coral-700 font-extrabold text-base flex items-center justify-center border border-coral-200 shadow-2xs">
                        {user.fullName
                          ? user.fullName
                              .trim()
                              .split(/\s+/)
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()
                          : 'U'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#111722] font-sans leading-snug">
                          {user.fullName}
                        </h4>
                        <p className="text-xs text-[#5F636B] font-mono leading-none mt-1">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${adminBadgeColor}`}>
                        Admin
                      </span>
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#EAE5E0] rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                        Email Address
                      </span>
                      <p className="text-xs font-semibold text-[#111722] font-mono truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-[#EAE5E0] rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                        System User ID
                      </span>
                      <p className="text-xs font-semibold text-[#111722] font-mono truncate">
                        {user.id}
                      </p>
                    </div>
                  </div>

                  {/* System Permissions — Universal Access Catalog */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-coral-500" />
                        <span>All System Permissions ({user.permissions?.length || 0})</span>
                      </h4>
                      <span className="text-[11px] text-[#8C9097]">Enforced by NestJS backend</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-4 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl">
                      {user.permissions && user.permissions.length > 0 ? (
                        user.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2.5 py-1 bg-white border border-[#EAE5E0] text-[#111722] text-[11px] font-mono font-medium rounded-full shadow-2xs"
                          >
                            {perm}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-[#8C9097] py-2">Loading permissions catalog…</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Store Master Data */}
          {activeTab === 'company' && <StoreMasterDataTab />}

          {/* TAB 3: System Diagnostics */}
          {activeTab === 'health' && (
            <div className="bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
                    System Health &amp; Connectivity
                  </h3>
                  <p className="text-xs text-[#5F636B] mt-1">
                    Live telemetry for NestJS backend API and PostgreSQL database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    refetchLiveness();
                    refetchReadiness();
                  }}
                  className="p-2 bg-[#FAF7F4] hover:bg-[#F2ECE6] border border-[#EAE5E0] rounded-full text-[#5F636B] transition shadow-xs cursor-pointer"
                  title="Refresh telemetry"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Liveness Check */}
                <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                      Backend API Liveness
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                      {liveness?.status === 'ok' ? 'HEALTHY' : 'CONNECTING...'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-[#5F636B]">Service: <span className="font-semibold text-[#111722] font-mono">{liveness?.service || 'ims-api'}</span></p>
                    <p className="text-[#5F636B]">Environment: <span className="font-semibold text-[#111722] font-mono">{liveness?.environment || 'development'}</span></p>
                    <p className="text-[#5F636B]">Timestamp: <span className="font-mono text-[10px] text-[#8C9097]">{liveness?.timestamp || '—'}</span></p>
                  </div>
                </div>

                {/* Readiness Check */}
                <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                      Database Connection
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                      readiness?.database === 'connected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {readiness?.database ? readiness.database.toUpperCase() : 'CHECKING...'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-[#5F636B]">Database: <span className="font-semibold text-[#111722]">PostgreSQL (Prisma)</span></p>
                    <p className="text-[#5F636B]">Status: <span className="font-semibold text-[#111722]">{readiness?.status || 'ok'}</span></p>
                    <p className="text-[#5F636B]">Timestamp: <span className="font-mono text-[10px] text-[#8C9097]">{readiness?.timestamp || '—'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreMasterDataTab() {
  const { data: profileData, isLoading, refetch } = useBusinessProfile();
  const updateMutation = useUpdateBusinessProfile();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('GENERAL_STORE');
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');
  const [isGstRegistered, setIsGstRegistered] = useState(false);
  const [gstin, setGstin] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [isMultiWarehouse, setIsMultiWarehouse] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profileData?.profile) {
      const p = profileData.profile;
      setBusinessName(p.businessName || '');
      setBusinessType(p.businessType || 'GENERAL_STORE');
      setCustomBusinessType(p.customBusinessType || '');
      setOwnerName(p.ownerName || '');
      setPhone(p.phone || '');
      setWhatsapp(p.whatsapp || '');
      setEmail(p.email || '');
      setWebsite(p.website || '');
      setAddress(p.address || '');
      setCity(p.city || '');
      setState(p.state || '');
      setCountry(p.country || 'India');
      setPostalCode(p.postalCode || '');
      setIsGstRegistered(Boolean(p.isGstRegistered));
      setGstin(p.gstin || '');
      setTaxNumber(p.taxNumber || '');
      setCurrency(p.currency || 'INR');
      setCurrencySymbol(p.currencySymbol || '₹');
      setIsMultiWarehouse(Boolean(p.isMultiWarehouse));
    }
  }, [profileData]);

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === 'INR') setCurrencySymbol('₹');
    else if (curr === 'USD') setCurrencySymbol('$');
    else if (curr === 'EUR') setCurrencySymbol('€');
    else if (curr === 'GBP') setCurrencySymbol('£');
    else if (curr === 'AED') setCurrencySymbol('د.إ');
    else setCurrencySymbol(curr);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSavedSuccess(false);

    if (!businessName.trim()) {
      setErrorMessage('Business / Store Name is required.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        businessName: businessName.trim(),
        businessType,
        customBusinessType: businessType === 'OTHER' ? customBusinessType.trim() : null,
        ownerName: ownerName.trim() || null,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        email: email.trim() || null,
        website: website.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        country: country.trim() || 'India',
        postalCode: postalCode.trim() || null,
        isGstRegistered,
        gstin: isGstRegistered ? gstin.trim() : null,
        taxNumber: taxNumber.trim() || null,
        currency,
        currencySymbol,
        isMultiWarehouse,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update store master data.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[28px] border border-[#EAE5E0] shadow-card p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#FF6B4A] animate-spin" />
        <p className="text-xs text-[#5F636B] font-medium">Loading store master data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-[28px] border border-[#EAE5E0] shadow-card p-6 sm:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-5 border-b border-[#EAE5E0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0 shadow-xs">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
              Store &amp; Organization Master Data
            </h3>
            <p className="text-xs text-[#5F636B] mt-0.5">
              Manage your legal business entity, tax compliance, location, and warehouse capabilities.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="p-2 bg-[#FAF7F4] hover:bg-[#F2ECE6] border border-[#EAE5E0] rounded-full text-[#5F636B] transition shadow-xs cursor-pointer"
          title="Refresh store settings"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store master data saved successfully. Changes are live across the system.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Business Identity */}
      <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-4">
        <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span>1. Business Identity &amp; Classification</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Business / Store Name <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Metro Retail Store"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Industry Category <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-medium cursor-pointer"
            >
              <option value="GENERAL_STORE">General Store / Kirana / FMCG</option>
              <option value="GROCERY">Grocery &amp; Supermarket</option>
              <option value="FOOTWEAR">Footwear &amp; Shoes</option>
              <option value="CLOTHING">Clothing &amp; Apparel</option>
              <option value="ELECTRONICS">Electronics &amp; Appliances</option>
              <option value="FURNITURE">Furniture &amp; Home Decor</option>
              <option value="HARDWARE">Hardware &amp; Tools</option>
              <option value="PHARMACY">Pharmacy &amp; Health</option>
              <option value="RETAIL">Specialty Retail</option>
              <option value="OTHER">Other / Custom Industry</option>
            </select>
          </div>

          {businessType === 'OTHER' && (
            <div className="sm:col-span-2 animate-fadeIn">
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Custom Industry Name <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={customBusinessType}
                onChange={(e) => setCustomBusinessType(e.target.value)}
                placeholder="e.g. Optical Store, Luxury Boutique, Pet Shop"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Owner / Manager Name <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Contact Phone <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-[#8C9097] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              WhatsApp Billing Number <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210 (For WhatsApp invoices)"
                className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Store Email <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#8C9097] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@example.com"
                className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Website / Online Catalog <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-[#8C9097] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.yourstore.com"
                className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Address & Location */}
      <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-4">
        <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span>2. Physical Location &amp; Address</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Street Address <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop No., Complex, Road / Area"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              City <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Surat"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              State / Province <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Maharashtra, Gujarat"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Postal / PIN Code <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 400001"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111722] mb-1.5">
              Country <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Tax & Multi-Warehouse Configuration */}
      <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-4">
        <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span>3. Tax Compliance &amp; Warehouse Architecture</span>
        </h4>

        {/* GST Toggle Card */}
        <div
          onClick={() => setIsGstRegistered(!isGstRegistered)}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            isGstRegistered ? 'border-coral-500 bg-coral-50/50' : 'border-[#EAE5E0] bg-white'
          }`}
        >
          <div>
            <h5 className="text-xs font-bold text-[#111722]">GST / Tax Registered Entity</h5>
            <p className="text-[11px] text-[#5F636B] mt-0.5">Enable to print GSTIN and compute multi-slab tax rates on customer invoices</p>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isGstRegistered ? 'bg-[#FF6B4A]' : 'bg-[#EAE5E0]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${isGstRegistered ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>

        {isGstRegistered && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                GSTIN Number <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs font-mono uppercase text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Tax Registration / PAN <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
              </label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs font-mono uppercase text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition shadow-2xs font-bold"
              />
            </div>
          </div>
        )}

        {/* Currency Selector */}
        <div>
          <label className="block text-xs font-bold text-[#111722] mb-1.5">
            Default Operating Currency &amp; Symbol
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { code: 'INR', symbol: '₹', label: 'INR (₹ Indian Rupee)' },
              { code: 'USD', symbol: '$', label: 'USD ($ US Dollar)' },
              { code: 'EUR', symbol: '€', label: 'EUR (€ Euro)' },
              { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ Dirham)' },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCurrencyChange(c.code)}
                className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-start gap-1 cursor-pointer ${
                  currency === c.code
                    ? 'border-[#FF6B4A] bg-coral-50 text-[#FF6B4A] ring-2 ring-[#FF6B4A]/20 shadow-xs'
                    : 'border-[#EAE5E0] bg-white text-[#5F636B] hover:border-coral-200 hover:text-[#111722]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-sm">{c.symbol}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5">{c.code}</span>
                </div>
                <span className="text-[11px] font-medium opacity-80 truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Warehouse Toggle Card */}
        <div
          onClick={() => setIsMultiWarehouse(!isMultiWarehouse)}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            isMultiWarehouse ? 'border-coral-500 bg-coral-50/50' : 'border-[#EAE5E0] bg-white'
          }`}
        >
          <div>
            <h5 className="text-xs font-bold text-[#111722]">Multi-Location &amp; Warehouse Mode</h5>
            <p className="text-[11px] text-[#5F636B] mt-0.5">Enable inter-warehouse stock transfers, central godowns, and multiple retail branch tracking</p>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isMultiWarehouse ? 'bg-[#FF6B4A]' : 'bg-[#EAE5E0]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${isMultiWarehouse ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-[#EAE5E0] flex justify-end">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="pill-btn-coral px-6 h-11 rounded-full text-white font-bold text-xs shadow-coral flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Master Data...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Store Master Data</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}


