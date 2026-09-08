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
      <div className="bg-white rounded-[24px] border border-border shadow-card p-8 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-coral-500 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
            Store &amp; Organization Master Data
          </h3>
          <p className="text-xs text-[#5F636B] mt-1">
            Manage your store identity, tax compliance, and multi-warehouse capabilities.
          </p>
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
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-center gap-3 text-danger-800 text-xs font-semibold animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Business Identity */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-coral-500" />
          <span>Business Identity &amp; Classification</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Business / Store Name *
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Industry Category
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
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
              <option value="OTHER">Other / Custom</option>
            </select>
          </div>

          {businessType === 'OTHER' && (
            <div className="sm:col-span-2 animate-fadeIn">
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Custom Industry Name
              </label>
              <input
                type="text"
                value={customBusinessType}
                onChange={(e) => setCustomBusinessType(e.target.value)}
                placeholder="e.g. Optical Store"
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Owner / Manager Name
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              WhatsApp Billing Number
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Store Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Address & Location */}
      <div className="space-y-4 pt-4 border-t border-[#EAE5E0]">
        <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-coral-500" />
          <span>Location &amp; Address</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
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
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
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
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
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
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Tax & Operational Capabilities */}
      <div className="space-y-4 pt-4 border-t border-[#EAE5E0]">
        <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-coral-500" />
          <span>Tax &amp; Multi-Warehouse Configuration</span>
        </h4>

        {/* GST Toggle */}
        <div
          onClick={() => setIsGstRegistered(!isGstRegistered)}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            isGstRegistered ? 'border-coral-500 bg-coral-50/40' : 'border-border bg-[#FAF7F4]'
          }`}
        >
          <div>
            <h5 className="text-xs font-bold text-navy-950">GST / Tax Registered Entity</h5>
            <p className="text-[11px] text-navy-500">Enable to print GSTIN and compute tax rates on bills</p>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isGstRegistered ? 'bg-coral-500' : 'bg-surface-muted'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isGstRegistered ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>

        {isGstRegistered && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                GSTIN Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs font-mono uppercase text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Tax Registration / PAN
              </label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value.toUpperCase())}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs font-mono uppercase text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition"
              />
            </div>
          </div>
        )}

        {/* Currency Selector */}
        <div>
          <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
            Default Operating Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { code: 'INR', symbol: '₹', label: 'INR (₹)' },
              { code: 'USD', symbol: '$', label: 'USD ($)' },
              { code: 'EUR', symbol: '€', label: 'EUR (€)' },
              { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ)' },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCurrencyChange(c.code)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  currency === c.code
                    ? 'border-coral-500 bg-coral-50 text-coral-700 ring-1 ring-coral-500'
                    : 'border-border bg-white text-navy-700 hover:border-coral-200'
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[10px] text-navy-400 font-mono">{c.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Warehouse Toggle */}
        <div
          onClick={() => setIsMultiWarehouse(!isMultiWarehouse)}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            isMultiWarehouse ? 'border-coral-500 bg-coral-50/40' : 'border-border bg-[#FAF7F4]'
          }`}
        >
          <div>
            <h5 className="text-xs font-bold text-navy-950">Multi-Location &amp; Warehouse Mode</h5>
            <p className="text-[11px] text-navy-500">Enable stock transfers and separate tracking across multiple warehouses</p>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isMultiWarehouse ? 'bg-coral-500' : 'bg-surface-muted'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isMultiWarehouse ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-[#EAE5E0] flex justify-end">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-coral-500/25 transition disabled:opacity-50 cursor-pointer"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
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


