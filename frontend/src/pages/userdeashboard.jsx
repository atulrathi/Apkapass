import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  BadgeCheck,
  AlertTriangle,
  Wifi,
  ShieldCheck,
  Clock,
  Zap,
  Briefcase,
  Snowflake,
  Droplets,
  SprayCan,
  Flower2,
  Wrench,
  MapPinOff,
  Hammer,
  Paintbrush,
  Tv,
  Bug,
  Scissors,
  Truck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sofa,
  Car,
  Bike,
  Camera,
  Tent,
  BookOpen,
  Drill,
  Package,
  PhoneCall,
  HeartPulse,
  Dumbbell,
  GraduationCap,
  X,
} from "lucide-react";
import axiosInstance from "../services/axiosinstance";
import Providerdetailsmodel from "../components/providerdetailsmodel";
import { useNavigate } from "react-router-dom";
import Userprofil from "../components/userprofile";

// ─────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  { id: "ac", label: "AC Repair", icon: Snowflake, accent: "#3B82F6" },
  { id: "plumbing", label: "Plumber", icon: Droplets, accent: "#06B6D4" },
  { id: "electrician", label: "Electrician", icon: Zap, accent: "#F59E0B" },
  { id: "cleaning", label: "Cleaning", icon: SprayCan, accent: "#8B5CF6" },
  { id: "carpenter", label: "Carpenter", icon: Hammer, accent: "#F97316" },
  { id: "painter", label: "Painter", icon: Paintbrush, accent: "#EC4899" },
  { id: "appliance", label: "Appliances", icon: Tv, accent: "#6366F1" },
  { id: "pest", label: "Pest Control", icon: Bug, accent: "#84CC16" },
  { id: "salon", label: "Salon & Spa", icon: Scissors, accent: "#F43F5E" },
  { id: "movers", label: "Movers", icon: Truck, accent: "#10B981" },
  { id: "massage", label: "Wellness", icon: Flower2, accent: "#14B8A6" },
  { id: "mechanic", label: "Mechanic", icon: Wrench, accent: "#64748B" },
  { id: "physio", label: "Physiotherapy", icon: HeartPulse, accent: "#EF4444" },
  { id: "tutor", label: "Tutors", icon: GraduationCap, accent: "#7C3AED" },
  { id: "trainer", label: "Fitness", icon: Dumbbell, accent: "#059669" },
];

const RENTAL_CATEGORIES = [
  { id: "furniture", label: "Furniture", icon: Sofa, accent: "#92400E" },
  { id: "car", label: "Cars", icon: Car, accent: "#1D4ED8" },
  { id: "bike", label: "Bikes & Scooters", icon: Bike, accent: "#0F766E" },
  { id: "camera", label: "Cameras", icon: Camera, accent: "#B45309" },
  { id: "tools", label: "Power Tools", icon: Drill, accent: "#7C3AED" },
  { id: "tent", label: "Event & Tent", icon: Tent, accent: "#15803D" },
  { id: "books", label: "Books", icon: BookOpen, accent: "#B91C1C" },
  { id: "appliance_rent", label: "Appliances", icon: Package, accent: "#0369A1" },
];

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1400&auto=format&fit=crop",
    eyebrow: "Home Services",
    title: "Trusted Hands,\nAt Your Door.",
    subtitle: "Verified local professionals ready within the hour.",
    cta: "Find a Pro",
    ctaCategory: "all",
    accent: "#4F46E5",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1400&auto=format&fit=crop",
    eyebrow: "AC & Electricals",
    title: "Beat the Heat,\nNot the Budget.",
    subtitle: "Expert AC technicians — same-day service guaranteed.",
    cta: "Book AC Repair",
    ctaCategory: "ac",
    accent: "#3B82F6",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop",
    eyebrow: "Rental Services",
    title: "Rent What You\nNeed, When You Need.",
    subtitle: "Furniture, vehicles, tools — all available nearby.",
    cta: "Browse Rentals",
    ctaCategory: "furniture",
    accent: "#F59E0B",
  },
];

const TRUST_STATS = [
  { icon: BadgeCheck, label: "Verified Providers", value: "2,400+", color: "#4F46E5" },
  { icon: ShieldCheck, label: "Secure Payments", value: "100%", color: "#10B981" },
  { icon: Clock, label: "Avg. Response", value: "< 15 min", color: "#F59E0B" },
  { icon: Star, label: "Avg. Rating", value: "4.8 ★", color: "#EF4444" },
];

// ─────────────────────────────────────────────────
// HERO SLIDER
// ─────────────────────────────────────────────────

const HeroSlider = ({ onCategorySelect }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[current];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div className="relative w-full h-[360px] md:h-[460px] rounded-3xl overflow-hidden mb-10 shadow-2xl">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Layered gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block text-xs font-bold tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded-full w-fit"
              style={{
                background: slide.accent + "25",
                color: slide.accent,
                border: `1px solid ${slide.accent}50`,
              }}
            >
              {slide.eyebrow}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight leading-[1.05] whitespace-pre-line"
            >
              {slide.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-base md:text-lg mb-7 max-w-md font-medium"
            >
              {slide.subtitle}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              onClick={() => onCategorySelect(slide.ctaCategory)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95 w-fit shadow-xl"
              style={{ background: slide.accent }}
            >
              {slide.cta}
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={() => go((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-2.5 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button
        onClick={() => go((current + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-2.5 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={18} className="text-white" />
      </button>

      {/* Dot nav */}
      <div className="absolute bottom-5 right-8 z-20 flex gap-2 items-center">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-500 ${i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────
// TRUST BAR
// ─────────────────────────────────────────────────

const TrustBar = () => (
  <div className="hidden md:grid grid-cols-4 gap-4 mb-12">
    {TRUST_STATS.map(({ icon: Icon, label, value, color }) => (
      <div
        key={label}
        className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + "15" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <p className="text-base font-black text-gray-900">{value}</p>
          <p className="text-xs font-semibold text-gray-400">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────
// SEARCH BAR
// ─────────────────────────────────────────────────

const SearchBar = ({ value, onChange, disabled }) => (
  <div className="mb-12">
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-3 px-5 py-3.5 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-300 transition-all">
      <Search size={20} className="text-indigo-400 shrink-0" strokeWidth={2.5} />
      <input
        type="text"
        placeholder='Search for "Plumber", "AC Repair", "Bike on Rent"…'
        className="flex-1 outline-none text-gray-800 placeholder-gray-400 font-medium text-base bg-transparent py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      )}
      <div className="hidden md:block w-px h-6 bg-gray-200 mx-1" />
      <button className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 shrink-0">
        Search
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────
// CATEGORY TABS (Services / Rentals switcher + grid)
// ─────────────────────────────────────────────────

const CategorySection = ({ activeCategory, onSelect }) => {
  const [tab, setTab] = useState("services");
  const categories = tab === "services" ? SERVICE_CATEGORIES : RENTAL_CATEGORIES;

  return (
    <section className="mb-14">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Browse by Category</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Services & rentals near you</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 self-start sm:self-auto">
          {["services", "rentals"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                onSelect("all");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                tab === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "services" ? "🔧 Services" : "📦 Rentals"}
            </button>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
        <AnimatePresence mode="wait">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.025 }}
                onClick={() => onSelect(isActive ? "all" : cat.id)}
                className={`flex flex-col items-center gap-2.5 p-3 rounded-2xl border transition-all duration-200 group focus:outline-none ${
                  isActive
                    ? "shadow-lg scale-[1.03]"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
                }`}
                style={
                  isActive
                    ? {
                        background: cat.accent + "12",
                        borderColor: cat.accent + "50",
                        boxShadow: `0 4px 20px ${cat.accent}25`,
                      }
                    : {}
                }
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                  style={
                    isActive
                      ? { background: cat.accent, boxShadow: `0 4px 12px ${cat.accent}40` }
                      : { background: cat.accent + "15" }
                  }
                >
                  <Icon
                    size={22}
                    style={{ color: isActive ? "#fff" : cat.accent }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className="text-[11px] font-bold leading-tight text-center"
                  style={{ color: isActive ? cat.accent : "#6B7280" }}
                >
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {activeCategory !== "all" && (
        <div className="mt-4 flex items-center gap-2">
          <div className="text-xs font-bold text-gray-500">Filtering by:</div>
          <button
            onClick={() => onSelect("all")}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            {[...SERVICE_CATEGORIES, ...RENTAL_CATEGORIES].find((c) => c.id === activeCategory)?.label}
            <X size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

// ─────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="w-full h-44 bg-gray-100 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-3/5" />
        <div className="h-5 bg-amber-50 rounded-lg animate-pulse w-12" />
      </div>
      <div className="h-4 bg-gray-50 rounded-lg animate-pulse w-2/5" />
      <div className="h-4 bg-gray-50 rounded-lg animate-pulse w-1/3" />
      <div className="h-11 bg-gray-50 rounded-xl animate-pulse w-full mt-4" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────

const EmptyState = ({ locationName, searchQuery, onClear }) => {
  const isSearching = searchQuery.length > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-2/5 h-56 md:h-80 relative">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
          alt="Coming Soon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent md:hidden" />
      </div>
      <div className="w-full md:w-3/5 p-8 md:p-12 z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs tracking-widest uppercase mb-4">
          {isSearching ? "No Results" : "Coming Soon"}
        </span>
        <h3 className="text-2xl font-black text-gray-900 mb-3">
          {isSearching ? `No results for "${searchQuery}"` : `Expanding to ${locationName} soon`}
        </h3>
        <p className="text-gray-500 text-base mb-7 leading-relaxed">
          {isSearching
            ? "Try searching for something else, or browse all categories."
            : "Our network is growing. Top-rated professionals are heading your way."}
        </p>
        {isSearching && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            Clear Search <X size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────
// PROVIDER CARD
// ─────────────────────────────────────────────────

const ProviderCard = ({ provider, onReveal }) => {
  const scrollRef = useRef(null);
  const [activeImg, setActiveImg] = useState(0);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const newIdx = dir === "right"
      ? Math.min(activeImg + 1, provider.images.length - 1)
      : Math.max(activeImg - 1, 0);
    setActiveImg(newIdx);
    scrollRef.current.children[newIdx]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col group"
    >
      {/* Image Gallery */}
      <div className="relative h-44 bg-gray-100 overflow-hidden group/img">
        <div
          ref={scrollRef}
          className="flex h-full overflow-x-hidden"
        >
          {provider.images.map((img, idx) => (
            <div key={idx} className="relative w-full h-full shrink-0 transition-transform duration-500" style={{ transform: `translateX(-${activeImg * 100}%)` }}>
              <img
                src={img}
                alt={`${provider.name} ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />

        {/* Verified badge */}
        {provider.verified && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <BadgeCheck size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">Verified</span>
          </div>
        )}

        {/* Duty/Online badge */}
        {provider.duty && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Available</span>
          </div>
        )}

        {/* Slider controls */}
        {provider.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); scroll("left"); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity z-10 disabled:opacity-30"
              disabled={activeImg === 0}
            >
              <ChevronLeft size={16} className="text-gray-800" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); scroll("right"); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity z-10 disabled:opacity-30"
              disabled={activeImg === provider.images.length - 1}
            >
              <ChevronRight size={16} className="text-gray-800" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {provider.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  className={`rounded-full transition-all duration-300 ${i === activeImg ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-black text-gray-900 text-base leading-tight truncate">{provider.name}</h3>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-100 shrink-0">
            <Star size={11} className="fill-amber-500" /> {provider.rating}
          </div>
        </div>

        <p className="text-xs font-bold text-indigo-600 mb-3 truncate capitalize">{provider.service}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold bg-gray-50 px-2.5 py-1.5 rounded-lg w-fit border border-gray-100 mb-auto">
          <MapPin size={12} className="shrink-0" strokeWidth={2.5} />
          <span className="truncate">{provider.distance} away</span>
        </div>

        <button
          onClick={() => onReveal(provider)}
          className="mt-4 w-full bg-gray-50 hover:bg-indigo-600 border border-gray-100 hover:border-indigo-600 text-gray-700 hover:text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
        >
          <PhoneCall size={15} className="text-gray-400 group-hover/btn:text-white transition-colors" />
          View & Contact
          <ArrowRight size={14} className="text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────
// SECTION HEADER COMPONENT
// ─────────────────────────────────────────────────

const SectionHeader = ({ title, count }) => (
  <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2.5">
    <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
    {title}
    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100">
      {count}
    </span>
  </h3>
);

// ─────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────

export default function CustomerDashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState("your city");
  const [isLocationGranted, setIsLocationGranted] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(true);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const abortRef = useRef(null);

  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const fetchProviders = useCallback(async (lat, lng, category) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setIsLoadingProviders(true);
    setError(null);

    try {
      const res = await axiosInstance.get("/provider/getprovider", {
        params: { lat, lng, ...(category !== "all" && { category }) },
        signal: abortRef.current.signal,
        timeout: 10000,
      });

      if (res.data.success) {
        const formatted = res.data.data.map((p) => {
          const imageUrls =
            p.images?.length > 0
              ? p.images.map((img) => img.url)
              : [`https://ui-avatars.com/api/?name=${encodeURIComponent(p.providerName || "Provider")}&background=f1f5f9&color=0f172a&size=400`];

          return {
            userID: p.userId,
            id: p.providerId,
            name: p.providerName || "Unknown Provider",
            service: p.serviceName || "General Service",
            description: p.description || "",
            rating: p.rating || 0,
            distance: p.distanceKm !== undefined ? `${p.distanceKm.toFixed(1)} km` : "Nearby",
            images: imageUrls,
            image: imageUrls[0],
            verified: !!p.isVerified,
            duty: !!p.duty,
            category: p.serviceName?.toLowerCase() || "other",
          };
        });
        setProviders(formatted);
      } else {
        throw new Error(res.data.message || "Failed to fetch providers");
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      if (!navigator.onLine) setError("You're offline. Check your internet connection.");
      else if (err.code === "ECONNABORTED") setError("Connection timed out. Please try again.");
      else if (err.response) setError(err.response.data?.message || "Server error. Please try again.");
      else setProviders([]);
    } finally {
      setIsLoadingProviders(false);
    }
  }, []);

  const requestLocation = useCallback(() => {
    setIsRequestingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setIsRequestingLocation(false);
      setError("Your browser doesn't support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCoords({ latitude, longitude });
        try {
          const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const d = await r.json();
          setLocationName(d.city || d.locality || "your city");
        } catch {}
        setIsLocationGranted(true);
        setIsRequestingLocation(false);
        fetchProviders(latitude, longitude, activeCategory);
      },
      (err) => {
        setIsLocationGranted(false);
        setIsRequestingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied. We need your location to find nearby experts.");
        } else {
          fetchProviders(0, 0, activeCategory);
        }
      },
      { timeout: 15000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, [activeCategory, fetchProviders]);

  useEffect(() => {
    requestLocation();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [requestLocation]);

  useEffect(() => {
    if (isLocationGranted && coords && !isRequestingLocation) {
      fetchProviders(coords.latitude, coords.longitude, activeCategory);
    }
  }, [activeCategory, coords, isLocationGranted, fetchProviders, isRequestingLocation]);

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return providers;
    const q = searchQuery.toLowerCase();
    return providers.filter((p) => p.name.toLowerCase().includes(q) || p.service.toLowerCase().includes(q));
  }, [providers, searchQuery]);

  const groupedProviders = useMemo(() => {
    const groups = {};
    const allCats = [...SERVICE_CATEGORIES, ...RENTAL_CATEGORIES];
    filteredProviders.forEach((p) => {
      const match = allCats.find((c) => p.category.includes(c.id.toLowerCase())) || { label: "Specialty Experts" };
      if (!groups[match.label]) groups[match.label] = [];
      groups[match.label].push(p);
    });
    return groups;
  }, [filteredProviders]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-16 selection:bg-indigo-100">
      {/* Offline bar */}
      {isOffline && (
        <div className="bg-red-500 text-white text-sm py-2.5 px-4 flex justify-center items-center gap-2 font-bold z-50 relative">
          <Wifi size={16} /> You are offline — check your internet connection.
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo + Location */}
          <div className="flex items-center gap-6">
            <span className="text-2xl font-black tracking-tighter text-gray-900 select-none">
              Apka<span className="text-indigo-600">Pass</span>
            </span>

            <button
              onClick={requestLocation}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
            >
              <MapPin
                size={16}
                strokeWidth={2.5}
                className={isLocationGranted ? "text-indigo-500" : "text-gray-400"}
              />
              <span className="text-sm font-bold text-gray-700 truncate max-w-[140px]">
                {isRequestingLocation ? "Detecting…" : locationName}
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-4">
            <a
              href="/join-us"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl hover:bg-indigo-50"
            >
              <Briefcase size={16} strokeWidth={2.5} /> Join as a Pro
            </a>
            <div className="hidden md:block w-px h-5 bg-gray-200" />
            <button
              onClick={() => setIsProfileOpen(true)}
              className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 p-[2px] hover:scale-105 transition-transform shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <img
                src="https://ui-avatars.com/api/?name=User&background=fff&color=4f46e5"
                alt="Profile"
                className="rounded-full h-full w-full border-2 border-white"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-7 md:pt-10">
        <HeroSlider onCategorySelect={setActiveCategory} />

        <TrustBar />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={isLoadingProviders || isRequestingLocation}
        />

        <CategorySection activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* ── Results ── */}
        <section aria-live="polite">
          {isRequestingLocation ? (
            <div className="py-32 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                <MapPin size={36} className="mx-auto text-indigo-500 mb-5" strokeWidth={2.5} />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900">Locating you…</h2>
              <p className="text-gray-400 mt-2 font-medium">Finding the best local experts near you.</p>
            </div>
          ) : error && !isLocationGranted ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-red-100 shadow-sm px-6">
              <MapPinOff size={44} strokeWidth={1.5} className="mx-auto text-red-400 mb-4" />
              <h2 className="text-xl font-black text-gray-900 mb-2">Location Required</h2>
              <p className="text-gray-500 max-w-sm mx-auto font-medium text-sm">{error}</p>
              <button
                onClick={requestLocation}
                className="mt-7 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                Enable Location
              </button>
            </div>
          ) : error ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
              <AlertTriangle size={44} strokeWidth={1.5} className="mx-auto text-amber-400 mb-4" />
              <h2 className="text-xl font-black text-gray-900 mb-2">Connection Issue</h2>
              <p className="text-gray-500 max-w-md mx-auto font-medium text-sm">{error}</p>
              <button
                onClick={() => fetchProviders(coords?.latitude, coords?.longitude, activeCategory)}
                className="mt-7 bg-gray-900 hover:bg-gray-800 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Results heading */}
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">
                  {activeCategory !== "all"
                    ? `${[...SERVICE_CATEGORIES, ...RENTAL_CATEGORIES].find((c) => c.id === activeCategory)?.label} Near You`
                    : "Professionals Near You"}
                  {!isLoadingProviders && filteredProviders.length > 0 && (
                    <span className="ml-2 text-sm font-bold text-gray-400">— {filteredProviders.length} found</span>
                  )}
                </h2>
              </div>

              <div className="mb-20">
                {isLoadingProviders ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : filteredProviders.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {Object.entries(groupedProviders).map(([catLabel, group]) => (
                      <div key={catLabel} className="mb-12 last:mb-0">
                        <SectionHeader title={catLabel} count={group.length} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                          {group.map((p) => (
                            <ProviderCard key={p.id} provider={p} onReveal={setSelectedProvider} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <EmptyState
                    locationName={locationName}
                    searchQuery={searchQuery}
                    onClear={() => setSearchQuery("")}
                  />
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <Providerdetailsmodel
        provider={selectedProvider}
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
      <Userprofil isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}