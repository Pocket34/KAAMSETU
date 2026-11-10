'use client';

import React, { useState } from 'react';
import {
  Store,
  Plus,
  Send,
  MapPin,
  CheckCircle2,
  Package,
  MessageSquare,
  Share2,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface DigitalDukaan {
  id: string;
  businessName: string;
  category: string;
  location: string;
  serviceRadius: string;
  description: string;
  productsCount: number;
  featuredItems: { name: string; price: string }[];
  enquiriesReceived: number;
  contactConsent: boolean;
  publicContact?: string;
  verifiedOwner: boolean;
}

const INITIAL_DUKAANS: DigitalDukaan[] = [
  {
    id: 'duk-01',
    businessName: 'Noor Heritage Brass Handcrafts',
    category: 'Handicrafts & Architectural Hardware',
    location: 'Sarai Sultani, Aligarh, UP',
    serviceRadius: 'Pan-India Delivery via Speed Post / Delhivery',
    description: 'Direct artisan workshop crafting solid brass antique door knockers, handcrafted almirah handles, and vintage decorative locks without commercial retail showroom costs.',
    productsCount: 16,
    featuredItems: [
      { name: 'Lion-Head Solid Brass Knocker', price: '₹650' },
      { name: 'Hand-Engraved 6-Lever Brass Padlock', price: '₹480' },
      { name: 'Ornate Antique Curtain Brackets (Pair)', price: '₹350' },
    ],
    enquiriesReceived: 29,
    contactConsent: true,
    publicContact: 'Enquiries routed through Kaamsetu Storefront Inbox',
    verifiedOwner: true,
  },
  {
    id: 'duk-02',
    businessName: 'Ganga Maati Eco Clay & Pottery Works',
    category: 'Terracotta & Kitchenware Utensils',
    location: 'Khurja / Bulandshahr / Aligarh Border',
    serviceRadius: 'Western UP & Delhi NCR bulk dispatch',
    description: 'Natural clay water pots, terracotta curd bowls, and decorative earthen lamps crafted directly on potter’s wheel.',
    productsCount: 22,
    featuredItems: [
      { name: '10-Litre Terracotta Natural Cooling Matka', price: '₹320' },
      { name: 'Clay Handi Cookware Set (2 Pcs)', price: '₹550' },
    ],
    enquiriesReceived: 18,
    contactConsent: true,
    publicContact: 'Verified Potter Mobile Available on Order Confirmation',
    verifiedOwner: true,
  }
];

export const BusinessHub: React.FC = () => {
  const [dukaans, setDukaans] = useState<DigitalDukaan[]>(INITIAL_DUKAANS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDukaanForEnquiry, setSelectedDukaanForEnquiry] = useState<DigitalDukaan | null>(null);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySent, setEnquirySent] = useState(false);

  // New Dukaan State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreateDukaan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) return;

    soundEngine.playClick();
    const newDukaan: DigitalDukaan = {
      id: `duk-${Date.now()}`,
      businessName: name.trim(),
      category: category.trim(),
      location: location.trim() || 'Aligarh / UP',
      serviceRadius: radius.trim() || 'Local & Delivery on request',
      description: desc.trim(),
      productsCount: 1,
      featuredItems: [{ name: 'Custom Service / Order', price: 'Direct Quote' }],
      enquiriesReceived: 0,
      contactConsent: true,
      verifiedOwner: false,
    };

    setDukaans([newDukaan, ...dukaans]);
    setShowCreateModal(false);
    setName('');
    setCategory('');
    setDesc('');
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName.trim() || !enquiryPhone.trim() || !selectedDukaanForEnquiry) return;

    soundEngine.playClick();
    // Increment enquiry counter in real state
    setDukaans((prev) =>
      prev.map((d) =>
        d.id === selectedDukaanForEnquiry.id
          ? { ...d, enquiriesReceived: d.enquiriesReceived + 1 }
          : d
      )
    );

    setEnquirySent(true);
    setTimeout(() => {
      setEnquirySent(false);
      setSelectedDukaanForEnquiry(null);
      setEnquiryName('');
      setEnquiryPhone('');
      setEnquiryMessage('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30 uppercase tracking-wider">
              Zero-Rent Digital Dukaan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Business Hub & Digital Storefronts
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Start selling your products and services without paying expensive physical shop deposits. Connect with real domestic buyers, local retail distributors, and receive customer orders.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B00]/25 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Launch My Free Digital Dukaan</span>
        </button>
      </div>

      {/* Storefronts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dukaans.map((dukaan) => (
          <div
            key={dukaan.id}
            className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-5 flex flex-col justify-between hover:border-[#FF6B00]/40 transition-all"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#FF6B00]/15 text-[#FF8F3D]">
                      <Store className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{dukaan.businessName}</h3>
                      <p className="text-xs text-[#FFE066] font-medium">{dukaan.category}</p>
                    </div>
                  </div>
                </div>

                {dukaan.verifiedOwner ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Artisan</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Community Store
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 leading-relaxed">{dukaan.description}</p>

              {/* Location & Delivery Coverage */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Workshop: {dukaan.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">{dukaan.serviceRadius}</span>
                </div>
              </div>

              {/* Featured Products */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Featured Products & Pricing:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dukaan.featuredItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 truncate pr-2">{item.name}</span>
                      <span className="font-bold text-[#FFE066] shrink-0">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: Enquiry & Stats */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                <MessageSquare className="w-3.5 h-3.5 text-[#FF8F3D]" />
                <span>{dukaan.enquiriesReceived} Customer Enquiries Received</span>
              </span>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedDukaanForEnquiry(dukaan);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs uppercase tracking-wide transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Customer Enquiry</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Send Customer Enquiry */}
      {selectedDukaanForEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-white">
              Send Enquiry to {selectedDukaanForEnquiry.businessName}
            </h2>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Enquiries are delivered directly to the maker. You do not pay any middleman commission.
            </p>

            {enquirySent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 text-emerald-400">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold text-sm">Enquiry Dispatched!</h4>
                <p className="text-xs text-zinc-300">The artisan has received your enquiry notification.</p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Verma"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Your Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98XXXXXXXX"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Product Details or Custom Requirement</label>
                  <textarea
                    rows={3}
                    placeholder="Mention quantity, design specifications, or delivery timeline..."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedDukaanForEnquiry(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs"
                  >
                    Dispatch Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Launch Dukaan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-white">Create Digital Storefront</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Launch your shop in 2 minutes. No shop license or commercial rental agreement needed.
            </p>

            <form onSubmit={handleCreateDukaan} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Business / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aligarh Precision Lockworks"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Industry / Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Woodcraft, Metalwork"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Aligarh, UP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Delivery / Service Area</label>
                <input
                  type="text"
                  placeholder="e.g. Aligarh City, Delhi NCR, or Pan-India Post"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Business Description & Offerings</label>
                <textarea
                  rows={3}
                  placeholder="Describe your craft, turnaround time, and quality standards..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs"
                >
                  Publish Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
