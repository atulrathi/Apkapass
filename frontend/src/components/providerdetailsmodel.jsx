import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  MapPin,
  BadgeCheck,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  ImageOff,
  Info,
  Wrench,
  UserCheck,
  Wifi,
  WifiOff,
  ExternalLink,
} from "lucide-react";
import axiosinstance from "../services/axiosinstance";

// ─────────────────────────────────────────────────────────────
// Tiny helpers
// ─────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = "sm" }) => {
  const dims = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rating >= n;
        const half = !filled && rating >= n - 0.5;
        return (
          <svg key={n} viewBox="0 0 20 20" className={dims}>
            {filled ? (
              <polygon
                points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
                fill="#F59E0B"
              />
            ) : half ? (
              <>
                <defs>
                  <linearGradient id={`hg-${n}`}>
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#E5E7EB" />
                  </linearGradient>
                </defs>
                <polygon
                  points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
                  fill={`url(#hg-${n})`}
                />
              </>
            ) : (
              <polygon
                points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
                fill="#E5E7EB"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
};

const Pill = ({ children, variant = "blue" }) => {
  const v = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    gray: "bg-gray-100 text-gray-500 border-gray-200",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border tracking-wide ${v[variant]}`}
    >
      {children}
    </span>
  );
};

const NoData = ({ icon: Icon, message, sub }) => (
  <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
      <Icon size={22} className="text-gray-300" strokeWidth={1.5} />
    </div>
    <p className="text-sm font-bold text-gray-500">{message}</p>
    {sub && (
      <p className="text-xs text-gray-400 mt-1 font-medium max-w-xs">{sub}</p>
    )}
  </div>
);

const TrustItem = ({ icon: Icon, label, active }) => (
  <div
    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all
    ${active ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-gray-50 border-gray-100 text-gray-400"}`}
  >
    <Icon size={14} strokeWidth={2.5} />
    {label}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Image Gallery
// ─────────────────────────────────────────────────────────────
const ImageGallery = ({ images, name }) => {
  // ... [Keep your exact ImageGallery code here] ...
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-52 md:h-64 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center border border-gray-100">
        <ImageOff size={32} className="text-gray-300 mb-2" strokeWidth={1.5} />
        <p className="text-xs font-semibold text-gray-400">
          No photos uploaded yet
        </p>
      </div>
    );
  }

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <>
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-gray-100 select-none"
        style={{ aspectRatio: "16/9" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${name} — photo ${active + 1}`}
            className="w-full h-full object-cover cursor-zoom-in"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(true)}
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EFF6FF&color=1D4ED8&size=800&bold=true`;
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg pointer-events-none">
          {active + 1} / {images.length}
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all active:scale-95 border border-white/60"
            >
              <ChevronLeft
                size={18}
                strokeWidth={2.5}
                className="text-gray-800"
              />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all active:scale-95 border border-white/60"
            >
              <ChevronRight
                size={18}
                strokeWidth={2.5}
                className="text-gray-800"
              />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === active ? "border-blue-500 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-90"}`}
            >
              <img
                src={src}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=Photo&background=EFF6FF&color=1D4ED8&size=128`;
                }}
              />
            </button>
          ))}
        </div>
      )}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[active]}
              alt={`${name} full view`}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "reviews", label: "Reviews" },
];

// ─────────────────────────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────────────────────────
export default function Providerdetailsmodel({ provider, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");

  // New States for API Call
  const [apiPhone, setApiPhone] = useState(null);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);

  // Background Fetch Effect
  useEffect(() => {
    if (isOpen && provider) {
      // 1. Instantly reset states for a fresh open
      setActiveTab("overview");
      setApiPhone(null);
      setIsLoadingPhone(true);

      // 2. Fetch the number silently in the background
      const fetchProviderNumber = async () => {
        try {
          // If you use an Axios interceptor setup, swap fetch for axios.post
          const response = await axiosinstance.get("/number/getno", {
            params: {
              userID: provider.userID,
            },
          });

          const data = await response.data;

          // Adjust this property based on what your API actually returns (e.g., data.phone, data.mobile, etc.)
          if (data && data.phone) {
            setApiPhone(data.phone);
          }
        } catch (error) {
          console.error("Error fetching provider number:", error);
        } finally {
          setIsLoadingPhone(false);
        }
      };

      fetchProviderNumber();
    }
  }, [isOpen, provider]);

  // Lock scroll & Escape key
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  if (!provider) return null;

  // ── Safe data extraction ─────────────────────────────────
  const {
    name,
    service,
    serviceName,
    description,
    rating,
    distance,
    verified,
    duty,
    images: rawImages = [],
    reviews: rawReviews = [],
    skills: rawSkills = [],
    experience,
    responseTime,
  } = provider;

  // Resolve final phone number (API fetched number overrides initial prop data)
  const finalPhone =
    apiPhone || provider.phoneNumber || provider.contact?.phone || null;
  const cleanPhone = finalPhone?.replace(/\D/g, "") || null;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}`
    : null;
  const callUrl = cleanPhone ? `tel:${cleanPhone}` : null;

  const images = rawImages
    .map((img) =>
      typeof img === "string" ? img : img?.url || img?.imageUrl || null,
    )
    .filter(Boolean);

  const SERVICE_NAME_MAP = {
    ac: "AC Repair & Service",
    plumbing: "Plumbing Services",
    electrician: "Electrical Work",
    cleaning: "Home Cleaning",
    carpenter: "Carpentry & Furniture",
    painter: "Painting Services",
    appliance: "Appliance Repair",
    pest: "Pest Control",
    salon: "Salon & Grooming",
    movers: "Packers & Movers",
    massage: "Wellness & Massage",
    mechanic: "Vehicle Mechanics",
  };

  const displayService =
    serviceName || SERVICE_NAME_MAP[service?.toLowerCase()] || service || null;
  const avatarSrc =
    images[0] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "P")}&background=DBEAFE&color=1D4ED8&size=300&bold=true`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.97 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative bg-white w-full md:max-w-2xl rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "95dvh", minHeight: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3.5 pb-1 md:hidden shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white transition-all active:scale-95"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* === HERO SECTION === */}
              <div className="px-5 pt-2 pb-4 md:px-7 md:pt-5">
                <ImageGallery images={images} name={name} />
                <div className="flex items-start gap-4 mt-5">
                  {images.length === 0 && (
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-md bg-blue-50">
                        <img
                          src={avatarSrc}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {verified && (
                        <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow border border-gray-100">
                          <BadgeCheck
                            size={20}
                            className="text-blue-500 fill-blue-50"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight truncate">
                          {name || "Unknown Provider"}
                        </h2>
                        {displayService ? (
                          <p className="text-sm font-bold text-blue-600 mt-0.5 flex items-center gap-1.5">
                            <Wrench size={13} strokeWidth={3} />
                            {displayService}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 font-medium mt-0.5 italic flex items-center gap-1.5">
                            <Info size={12} /> Service not specified
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 mt-3">
                      {rating > 0 ? (
                        <>
                          <StarRating rating={rating} />
                          <span className="text-base font-black text-gray-800">
                            {Number(rating).toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold italic">
                          No ratings yet
                        </span>
                      )}
                      {distance && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                          <MapPin
                            size={11}
                            strokeWidth={3}
                            className="text-gray-400"
                          />
                          {distance}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {verified && (
                        <Pill variant="blue">
                          <BadgeCheck size={12} /> Verified Pro
                        </Pill>
                      )}
                      {duty ? (
                        <Pill variant="green">
                          <Zap size={12} /> Available Now
                        </Pill>
                      ) : (
                        <Pill variant="gray">
                          <WifiOff size={11} /> Currently Unavailable
                        </Pill>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* === STATS ROW === */}
              {(rating > 0 || experience || responseTime) && (
                <div className="px-5 md:px-7 mb-4">
                  <div className="flex gap-3 bg-gray-50 rounded-2xl border border-gray-100 p-3">
                    {rating > 0 && (
                      <div className="flex-1 flex flex-col items-center gap-1 py-1">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                          <Star
                            size={16}
                            className="text-amber-500 fill-amber-400"
                            strokeWidth={2}
                          />
                        </div>
                        <span className="text-base font-black text-gray-900">
                          {Number(rating).toFixed(1)}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Rating
                        </span>
                      </div>
                    )}
                    {experience && (
                      <>
                        <div className="w-px bg-gray-200 self-stretch" />
                        <div className="flex-1 flex flex-col items-center gap-1 py-1">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <UserCheck
                              size={16}
                              className="text-blue-500"
                              strokeWidth={2}
                            />
                          </div>
                          <span className="text-base font-black text-gray-900">
                            {experience}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Experience
                          </span>
                        </div>
                      </>
                    )}
                    {responseTime && (
                      <>
                        <div className="w-px bg-gray-200 self-stretch" />
                        <div className="flex-1 flex flex-col items-center gap-1 py-1">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Clock
                              size={16}
                              className="text-emerald-500"
                              strokeWidth={2}
                            />
                          </div>
                          <span className="text-base font-black text-gray-900">
                            {responseTime}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Response
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* === TAB BAR === */}
              <div className="px-5 md:px-7 mb-0">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 text-sm font-extrabold py-2.5 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* === TAB CONTENT === */}
              <div className="px-5 md:px-7 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                  >
                    {/* ── OVERVIEW ── */}
                    {activeTab === "overview" && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            About
                          </h3>
                          {description ? (
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                              {description}
                            </p>
                          ) : (
                            <NoData
                              icon={Info}
                              message="No description provided"
                              sub="This provider hasn't added a bio yet."
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            Trust & Safety
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <TrustItem
                              icon={ShieldCheck}
                              label="Background Checked"
                              active={verified}
                            />
                            <TrustItem
                              icon={BadgeCheck}
                              label="ID Verified"
                              active={verified}
                            />
                            <TrustItem
                              icon={CheckCircle2}
                              label="Quality Assured"
                              active
                            />
                            <TrustItem
                              icon={Wifi}
                              label="Platform Registered"
                              active
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SERVICES ── */}
                    {activeTab === "services" && (
                      <div>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                          What's Offered
                        </h3>
                        {rawSkills.length > 0 ? (
                          <div className="space-y-2">
                            {rawSkills.map((skill, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-100 group transition-all cursor-default"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700 transition-colors">
                                    {skill}
                                  </span>
                                </div>
                                <ChevronRight
                                  size={15}
                                  className="text-gray-300 group-hover:text-blue-400 transition-colors"
                                />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <NoData
                            icon={Wrench}
                            message="No services listed"
                            sub="Reach out to discuss what they can help with."
                          />
                        )}
                      </div>
                    )}

                    {/* ── REVIEWS ── */}
                    {activeTab === "reviews" && (
                      <div>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                          Customer Reviews
                        </h3>
                        {rawReviews.length > 0 ? (
                          <div className="space-y-3">
                            {rawReviews.map((r, i) => {
                              const reviewerName =
                                r.customerName || r.name || "Anonymous";
                              const reviewText =
                                r.comment || r.text || r.review || "";
                              const reviewRating = r.rating || 0;
                              const reviewDate = r.createdAt
                                ? new Date(r.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : r.date || "";
                              const reviewAvatar =
                                r.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=EFF6FF&color=1D4ED8&size=64&bold=true`;

                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.06 }}
                                  className="bg-gray-50 rounded-2xl border border-gray-100 p-4"
                                >
                                  <div className="flex items-center gap-3 mb-2.5">
                                    <img
                                      src={reviewAvatar}
                                      alt={reviewerName}
                                      className="w-9 h-9 rounded-full border border-gray-200 shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=EFF6FF&color=1D4ED8&size=64`;
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-extrabold text-gray-800 truncate">
                                        {reviewerName}
                                      </p>
                                      {reviewDate && (
                                        <p className="text-[11px] text-gray-400 font-medium">
                                          {reviewDate}
                                        </p>
                                      )}
                                    </div>
                                    {reviewRating > 0 && (
                                      <StarRating rating={reviewRating} />
                                    )}
                                  </div>
                                  {reviewText ? (
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                      {reviewText}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic">
                                      No comment left.
                                    </p>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          <NoData
                            icon={Star}
                            message="No reviews yet"
                            sub="Be the first to hire this professional and leave a review."
                          />
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="h-2 shrink-0" />
            </div>

            {/* ═══════════════════════════════════════════════
                STICKY CTA FOOTER (WITH LOADING LOGIC)
            ════════════════════════════════════════════════ */}
            <div className="shrink-0 px-5 md:px-7 py-4 bg-white border-t border-gray-100">
              {isLoadingPhone ? (
                /* Sleek Loading Skeleton */
                <div className="flex gap-3 w-full">
                  <div className="flex-1 h-[48px] bg-gray-200 rounded-2xl animate-pulse" />
                  <div className="flex-1 h-[48px] bg-gray-200 rounded-2xl animate-pulse" />
                </div>
              ) : cleanPhone ? (
                /* Actual Action Buttons */
                <div className="flex gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-green-400/20 active:scale-[0.98]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-white shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={callUrl}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                  >
                    <Phone size={17} strokeWidth={2.5} />
                    Call Now
                  </a>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Phone
                      size={17}
                      className="text-amber-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-amber-800">
                      Contact not available
                    </p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                      This provider hasn't shared contact details yet. Try
                      messaging via the platform.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
