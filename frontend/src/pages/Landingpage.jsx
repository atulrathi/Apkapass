import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import {
  Search, MapPin, Zap, ArrowRight, ShieldCheck, ChevronRight,
  Star, CheckCircle2, Award, Map, Users, Heart, Wrench, Droplets,
  Smartphone, PhoneCall, UserCircle, LayoutDashboard, PhoneIncoming,
  LogIn, Shield, FileText, Fingerprint, X, TrendingUp, Sparkles,
  Activity, Car, Scissors, Paintbrush, Wifi, Leaf, Baby,
  Building2, Truck, Camera, ChefHat, Dumbbell, Stethoscope,
  HardHat, Wind, Twitter, Facebook, Instagram, Linkedin, Youtube,
  Mail, Phone, MessageCircle, Globe, ChevronDown, Quote, Menu,
  Settings
} from "lucide-react";
import plumber from "../assets/plumber.jpg";
import elecrician from "../assets/elctrician.jpg";
import Logincomponent from "../components/login";
import Providerlogin from "../components/providerlogin";

// ─────────────────────────────────────────────
//  Splash Screen
// ─────────────────────────────────────────────
const PremiumSplashScreen = () => (
  <motion.div
    className="fixed inset-0 z-[10000] bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden"
    initial={{ y: 0 }}
    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
  >
    <div className="overflow-hidden py-2 px-4">
      <motion.div
        initial={{ y: "120%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
        className="flex items-center gap-4"
      >
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-slate-900">
          ApkaPass
        </h1>
      </motion.div>
    </div>
    <motion.div
      className="absolute bottom-12 w-[150px] h-[2px] bg-slate-200 overflow-hidden rounded-full"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
    >
      <motion.div
        className="h-full w-full bg-gradient-to-r from-indigo-600 to-violet-600"
        initial={{ x: "-100%" }} animate={{ x: "100%" }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────
//  Magnetic Tagline
// ─────────────────────────────────────────────
const GlobalMagneticTagline = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 0.8 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.03);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.03);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative inline-block">
      <motion.div
        className="absolute -inset-8 bg-gradient-to-r from-indigo-400/20 via-fuchsia-400/20 to-violet-400/20 rounded-full blur-[40px] -z-10"
        style={{ x: useSpring(useMotionValue((v) => v * -1.5), { stiffness: 40 }), y: useSpring(useMotionValue((v) => v * -1.5), { stiffness: 40 }) }}
      />
      <motion.div style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  Custom Cursor
// ─────────────────────────────────────────────
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const scale = useMotionValue(1);
  
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
  
  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const isHovering = !!e.target.closest("button, a, .hover-trigger, .cursor-pointer, input");
      scale.set(isHovering ? 1.5 : 1);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, scale]);

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 w-4 h-4 bg-indigo-600 rounded-full pointer-events-none z-[9999] hidden lg:block mix-blend-multiply"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-12 h-12 border border-indigo-400/50 rounded-full pointer-events-none z-[9998] hidden lg:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", scale }}
      />
    </>
  );
};

// ─────────────────────────────────────────────
//  Spotlight Card
// ─────────────────────────────────────────────
const SpotlightCard = ({ children, className = "", onClick }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)} onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm transition-shadow duration-500 hover:shadow-xl hover-trigger ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79,70,229,0.08), transparent 40%)` }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  Reveal
// ─────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
//  Modal Wrapper
// ─────────────────────────────────────────────
const ModalWrapper = ({ onClose, children }) => (
  <motion.div
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    transition={{ duration: 0.3 }}
    // Added overflow-y-auto so the modal scrolls on short screens (like mobile landscape)
    // Adjusted padding for smaller screens
    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto"
    onClick={onClose}
  >
    <button 
      onClick={onClose} 
      aria-label="Close modal" 
      // Changed absolute to fixed so it stays visible while scrolling. 
      // Added a subtle background and rounded shape to make it a better touch target on mobile.
      className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-95 z-50 hover-trigger"
    >
      <X size={24} strokeWidth={2} />
    </button>
    <motion.div
      initial={{ scale: 0.95, y: 20 }} 
      animate={{ scale: 1, y: 0 }} 
      exit={{ scale: 0.95, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      // Added my-auto so it stays centered vertically even if the user scrolls on a small phone
      className="w-full max-w-md relative my-auto cursor-auto hover-trigger"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────
//  Counter Animation
// ─────────────────────────────────────────────
const AnimatedCounter = ({ end, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ─────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────
export default function ApkaPassPremium() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showprovider, setshowprovider] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Location States
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(true); // Added precise loading state
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // Removed default arrays!
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    getUserLocation();
    const t = setTimeout(() => setIsAppLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    document.body.style.overflow = showLogin || showprovider || isAppLoading || isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showLogin, showprovider, isAppLoading, isMobileMenuOpen]);

  // Fetches localized neighborhoods using OpenStreetMap Overpass API
  const fetchNearbyPlaces = async (lat, lon) => {
    try {
      const query = `
        [out:json][timeout:10];
        (
          node["place"~"town|village|suburb|neighbourhood"](around:30000,${lat},${lon});
        );
        out tags 20;
      `;
      
      const encodedQuery = encodeURIComponent(query);
      
      // Array of free public Overpass servers
      const endpoints = [
        `https://overpass.kumi.systems/api/interpreter?data=${encodedQuery}`,
        `https://overpass-api.de/api/interpreter?data=${encodedQuery}`
      ];

      let data = null;

      // Try each endpoint until one works
      for (const url of endpoints) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            data = await response.json();
            break; // Success! Break out of the loop.
          }
        } catch (err) {
          console.warn(`Failed fetching from ${url}, trying next...`);
        }
      }

      if (!data) throw new Error("All Overpass API endpoints timed out or failed.");
      
      if (data.elements && data.elements.length > 0) {
        const places = data.elements
          .map(element => element.tags && element.tags.name)
          .filter(name => name && name.length < 22);
        
        const uniquePlaces = [...new Set(places)];
        
        if (uniquePlaces.length > 0) {
          setNearbyPlaces(uniquePlaces.slice(0, 8));
        } else {
          setNearbyPlaces([]); // strict no default
        }
      } else {
          setNearbyPlaces([]);
      }
    } catch (error) {
      console.error("Gracefully handling nearby places error:", error.message);
      setNearbyPlaces([]); // strict no default
    } finally {
      setIsLocationLoading(false); // End loading process
    }
  };

  const getUserLocation = () => {
    setIsLocationLoading(true);
    
    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by your browser. Please update your browser.");
      setNearbyPlaces([]);
      setIsLocationLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationError(""); // Clear any previous errors
        try {
          // PROD FIX: Actually use the user's coordinates!
          const { latitude, longitude } = position.coords;
          
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          setLocation(data.city || data.locality || data.principalSubdivision || "");

          // Now fetch dynamic places with real coords
          await fetchNearbyPlaces(latitude, longitude);

        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setIsLocationLoading(false); // Stop loader if geocoding fails
        }
      },
      (error) => {
        console.warn("Geolocation permission denied/failed:", error);
        // Explicit instruction for production
        setLocationError("Location permission denied. To discover professionals in your exact neighborhood, please allow location access in your device/browser settings and refresh the page.");
        setNearbyPlaces([]); 
        setIsLocationLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 } // Prod settings: timeout and cache
    );
  };

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
  };

  // ── Data ──────────────────────────────────
  const topServices = [
    { name: "Expert Plumbing", category: "Repairs", img: plumber, rating: 4.8 },
    { name: "Electrician", category: "Power", img: elecrician, rating: 4.9 },
    { name: "Massage Therapy", category: "Wellness", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800", rating: 4.9 },
    { name: "Auto Mechanic", category: "Automotive", img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800", rating: 4.7 },
  ];

  const allCategories = [
    { icon: <Wrench size={22} />, name: "Plumbing", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: <Zap size={22} />, name: "Electrician", color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
    { icon: <Car size={22} />, name: "Mechanic", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { icon: <Paintbrush size={22} />, name: "Painter", color: "bg-pink-50 text-pink-600 border-pink-100" },
    { icon: <Scissors size={22} />, name: "Saloon", color: "bg-rose-50 text-rose-600 border-rose-100" },
    { icon: <Stethoscope size={22} />, name: "Doctor", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: <HardHat size={22} />, name: "Carpenter", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: <Wind size={22} />, name: "AC Repair", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { icon: <Camera size={22} />, name: "Photographer", color: "bg-violet-50 text-violet-600 border-violet-100" },
    { icon: <ChefHat size={22} />, name: "Catering", color: "bg-lime-50 text-lime-600 border-lime-100" },
    { icon: <Dumbbell size={22} />, name: "Gym Trainer", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: <Baby size={22} />, name: "Babysitter", color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
    { icon: <Truck size={22} />, name: "Packers & Movers", color: "bg-teal-50 text-teal-600 border-teal-100" },
    { icon: <Wifi size={22} />, name: "IT Support", color: "bg-sky-50 text-sky-600 border-sky-100" },
    { icon: <Leaf size={22} />, name: "Gardener", color: "bg-green-50 text-green-600 border-green-100" },
    { icon: <Building2 size={22} />, name: "Interior Design", color: "bg-purple-50 text-purple-600 border-purple-100" },
  ];

  const stats = [
    { value: 100, suffix: "%", label: "Verified Professionals" },
    { value: 24, suffix: "/7", label: "Direct Access" },
    { value: 100, suffix: "%", label: "Local Focus" },
    { value: 0, suffix: "%", label: "Hidden Commission" },
  ];

  const features = [
    { title: "No Middlemen", desc: "Speak directly with the professional. We don't intercept your calls.", icon: <PhoneCall size={32} /> },
    { title: "Zero Commission", desc: "Providers keep 100% of their earnings. You get direct market rates.", icon: <Zap size={32} /> },
    { title: "Verified Network", desc: "Every provider undergoes strict verification for your absolute safety.", icon: <ShieldCheck size={32} /> },
    { title: "Instant Access", desc: "Don't wait hours for a quote. Call, agree on a price, and get it done.", icon: <Activity size={32} /> },
  ];

  const testimonials = [
    { name: "Priya Sharma", city: "Sector 14", role: "Homeowner", rating: 5, text: "Found a certified plumber within 10 minutes. Pricing was completely transparent.", avatar: "PS" },
    { name: "Rahul Verma", city: "Model Town", role: "Small Business Owner", rating: 5, text: "Joining ApkaPass scaled my local reach. I receive direct calls, no commission deducted.", avatar: "RV" },
    { name: "Anjali Mehta", city: "Omaxe City", role: "Working Professional", rating: 5, text: "Booked a massage therapist. Verified, professional, and affordable.", avatar: "AM" },
    { name: "Suresh Patel", city: "Kundli", role: "Service Provider", rating: 5, text: "Best platform for independent professionals. I set my own rates.", avatar: "SP" },
    { name: "Nisha Kapoor", city: "Sector 15", role: "Homeowner", rating: 5, text: "From AC repair to interior painting — quality is consistently premium.", avatar: "NK" },
    { name: "Vikram Singh", city: "Murthal", role: "Carpenter", rating: 5, text: "My profile gets direct visibility in top neighborhoods without losing money.", avatar: "VS" },
  ];

  const popularSearches = [
    "Plumber near me", "Electrician in Model Town", "AC repair Kundli", "Carpenter nearby",
    "Painter Sector 14", "Packers Movers", "Massage at home", "Car mechanic nearby",
  ];

  return (
    <>
      <AnimatePresence>
        {isAppLoading && <PremiumSplashScreen key="splash" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-indigo-600 selection:text-white font-sans overflow-x-hidden cursor-none lg:cursor-auto">
        <CustomCursor />
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 origin-left z-[200]" style={{ scaleX }} />

        {/* ════════════════════════════════════
            NAVBAR
        ════════════════════════════════════ */}
        <nav className={`fixed w-full z-[150] transition-all duration-500 ${isScrolled || isMobileMenuOpen ? "bg-white/90 backdrop-blur-2xl py-4 border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" : "bg-transparent py-6 lg:py-8"}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            
            <a href="#top" onClick={(e) => handleSmoothScroll(e, "top")} className="flex items-center gap-2 hover-trigger relative z-[160]">
              <span className="text-xl font-black tracking-tighter uppercase italic">ApkaPass</span>
            </a>
            
            <div className="hidden lg:flex items-center gap-10 bg-white/50 backdrop-blur-md px-8 py-3 rounded-full border border-slate-200 shadow-sm text-xs font-bold uppercase tracking-widest text-slate-500">
              {["Services", "How it Works", "Categories", "Join as Partner"].map((item) => {
                const id = item.toLowerCase().replace(/ /g, "");
                return (
                  <a key={item} href={`#${id}`} onClick={(e) => handleSmoothScroll(e, id)} className="hover:text-slate-900 transition-colors hover-trigger">{item}</a>
                );
              })}
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative z-[160]">
              <button onClick={() => setShowLogin(true)} className="bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 text-[10px] tracking-widest uppercase font-black hover-trigger flex items-center gap-2">
                <LogIn size={12} strokeWidth={2} /> <span className="hidden sm:inline">Login / Signup</span><span className="sm:hidden">Login</span>
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile Dropdown Menu ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[140] bg-white/95 backdrop-blur-3xl pt-28 px-6 pb-6 flex flex-col lg:hidden"
            >
              <div className="flex flex-col gap-8 items-center justify-center flex-1">
                {["Services", "How it Works", "Categories", "Join as Partner"].map((item, i) => {
                  const id = item.toLowerCase().replace(/ /g, "");
                  return (
                    <motion.a
                      key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                      href={`#${id}`} onClick={(e) => handleSmoothScroll(e, id)}
                      className="text-3xl font-black tracking-tighter text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {item}
                    </motion.a>
                  );
                })}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-auto flex flex-col items-center gap-4">
                <div className="h-px w-24 bg-slate-200 rounded-full" />
                <button onClick={() => { setIsMobileMenuOpen(false); setshowprovider(true); }} className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <UserCircle size={16} /> Provider Login
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════
            HERO
        ════════════════════════════════════ */}
        <header id="top" className="relative pt-40 pb-32 lg:pt-56 lg:pb-40 overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center w-full">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-8 shadow-sm cursor-default">
              <ShieldCheck size={12} className="text-indigo-600" strokeWidth={2} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">The Premium Home Service Network</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="relative z-10 text-6xl sm:text-7xl lg:text-[100px] font-[900] tracking-tighter leading-[0.85] text-slate-900 mb-8">
              <GlobalMagneticTagline>
                Har Sahuliyat,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic pr-2">Ab Aapke Paas.</span>
              </GlobalMagneticTagline>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-14 mt-4">
              Connect instantly with top-tier, background-verified professionals in your neighborhood. Get their number, negotiate directly, and get it done.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="w-full max-w-3xl relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2.5rem] blur opacity-20"></div>
              <div className="relative flex flex-col sm:flex-row bg-white/80 backdrop-blur-2xl rounded-[2rem] p-3 shadow-2xl border border-white/50">
                <div className="flex-1 flex items-center gap-3 px-6 py-4 border-b sm:border-b-0 sm:border-r border-slate-200/50 hover-trigger">
                  <MapPin size={16} className="text-slate-400" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Your Locality"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent outline-none font-bold text-base placeholder:text-slate-400 text-slate-900"
                  />                
                </div>
                <div className="flex-[1.5] flex items-center gap-3 px-6 py-4 hover-trigger">
                  <Search size={16} className="text-slate-400" strokeWidth={1.5} />
                  <input type="text" placeholder="Search plumbers, mechanics..." className="w-full bg-transparent outline-none font-medium text-base placeholder:text-slate-400 text-slate-900" />
                </div>
                <button onClick={() => setShowLogin(true)}
                  className="bg-slate-900 text-white px-8 py-4 sm:py-0 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.1em] hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 mt-2 sm:mt-0 hover-trigger">
                  Search <ArrowRight size={14} strokeWidth={2} />
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-2 mt-8 justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 self-center">Popular:</span>
              {popularSearches.map((s) => (
                <button key={s} onClick={() => setShowLogin(true)}
                  className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all hover-trigger">
                  {s}
                </button>
              ))}
            </motion.div>
          </div>
        </header>

        {/* ════════════════════════════════════
            TRUST STATS
        ════════════════════════════════════ */}
        <section className="py-16 bg-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.4)_0%,transparent_60%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center text-white">
                    <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-2">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-indigo-200 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            FEATURED SERVICES
        ════════════════════════════════════ */}
        <section id="services" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-4">Curated Services.</h2>
                  <p className="text-slate-500 font-medium text-lg">Browse our most requested premium solutions.</p>
                </div>
                <button onClick={() => setShowLogin(true)} className="text-sm font-bold flex items-center gap-2 text-indigo-600 hover-trigger group">
                  View All Categories <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topServices.map((service, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <SpotlightCard onClick={() => setShowLogin(true)} className="flex flex-col h-[350px] bg-white group cursor-pointer">
                    <div className="h-48 overflow-hidden relative p-2">
                      <img src={service.img} alt={`Featured ${service.name} service`} loading="lazy" className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black">{service.rating}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-end flex-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">{service.category}</span>
                      <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex justify-between items-center group-hover:text-indigo-600 transition-colors">
                        {service.name}
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <ArrowRight size={14} strokeWidth={1.5} />
                        </div>
                      </h3>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            ALL CATEGORIES
        ════════════════════════════════════ */}
        <section id="categories" className="py-24 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6">
                  <Sparkles size={12} strokeWidth={2} /> All Categories
                </div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-4">Every service. One platform.</h2>
                <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">From emergency repairs to lifestyle upgrades — all your local services, verified professionals only.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {allCategories.map((cat, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <button onClick={() => setShowLogin(true)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${cat.color} hover:shadow-lg transition-all hover:scale-105 active:scale-95 w-full hover-trigger`}>
                    <div className="text-current">{cat.icon}</div>
                    <span className="text-[11px] font-black text-center leading-tight">{cat.name}</span>
                  </button>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="text-center mt-10">
                <button onClick={() => setShowLogin(true)} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors hover-trigger">
                  Explore All Categories <ArrowRight size={14} strokeWidth={2} />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════ */}
        <section id="howitworks" className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-4">How ApkaPass Works.</h2>
                <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">One seamless web platform. Two dedicated dashboards. Direct connections.</p>
              </div>
            </Reveal>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              <Reveal delay={0.1}>
                <SpotlightCard className="p-8 lg:p-10 h-full border-indigo-100 bg-white">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-10 border border-indigo-100">
                    <Search size={12} strokeWidth={2} /> For Customers
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-8">Find help in minutes.</h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-indigo-100 before:to-transparent">
                    {[
                      { n: 1, icon: <Smartphone size={16} strokeWidth={1.5} className="text-indigo-600" />, title: "Login with Phone", desc: "Quick OTP access. Jump straight to your secure user dashboard." },
                      { n: 2, icon: <Map size={16} strokeWidth={1.5} className="text-indigo-600" />, title: "Search Nearby Services", desc: "Browse verified professionals available right now in your exact locality." },
                      { n: 3, icon: <PhoneCall size={16} strokeWidth={1.5} className="text-indigo-600" />, title: "Connect Directly", desc: "Get their phone number instantly. Call, negotiate, and hire them on the spot." },
                    ].map((step) => (
                      <div key={step.n} className="relative flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-indigo-200 z-10 shrink-0">{step.n}</div>
                        <div>
                          <h4 className="text-lg font-black tracking-tighter text-slate-900 flex items-center gap-2">{step.icon} {step.title}</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
              <Reveal delay={0.2}>
                <SpotlightCard className="p-8 lg:p-10 h-full border-slate-800 bg-slate-900 text-white">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-300 font-black text-[10px] uppercase tracking-widest mb-10 border border-slate-700">
                    <Users size={12} strokeWidth={2} /> For Service Providers
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-white mb-8">Grow your business.</h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-800 before:via-slate-800 before:to-transparent">
                    {[
                      { n: 1, icon: <UserCircle size={16} strokeWidth={1.5} className="text-indigo-400" />, title: "Create a Partner Profile", desc: "List your expertise, category, and area of service." },
                      { n: 2, icon: <LayoutDashboard size={16} strokeWidth={1.5} className="text-indigo-400" />, title: "Access Provider Dashboard", desc: "Manage your professional listing and track your local visibility." },
                      { n: 3, icon: <PhoneIncoming size={16} strokeWidth={1.5} className="text-indigo-400" />, title: "Receive Direct Calls", desc: "Customers call you directly. You deal with them and keep 100% of your earnings." },
                    ].map((step) => (
                      <div key={step.n} className="relative flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-black text-sm shadow-xl z-10 shrink-0">{step.n}</div>
                        <div>
                          <h4 className="text-lg font-black tracking-tighter text-white flex items-center gap-2">{step.icon} {step.title}</h4>
                          <p className="text-sm text-slate-400 font-medium mt-1">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            WHY APKAPASS (FEATURES)
        ════════════════════════════════════ */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-white font-black text-[10px] uppercase tracking-widest mb-6">
                  <Award size={12} strokeWidth={2} /> Why ApkaPass
                </div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-4">Built different. Built better.</h2>
                <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">We're not another booking platform with hidden cuts. We're a direct-connect local network.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <SpotlightCard className="p-8 bg-white h-full group">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-black tracking-tighter text-slate-900 mb-3">{f.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            PARTNER PROGRAM
        ════════════════════════════════════ */}
        <div className="w-full flex justify-center mt-[-10px]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6">
            <Award size={12} strokeWidth={2} /> Join the Network
          </div>
        </div>

        <section id="joinaspartner" className="bg-white relative overflow-hidden pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="relative rounded-[3rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative p-10 lg:p-16 flex flex-col xl:flex-row items-center justify-between gap-16">
                  <div className="flex-1 text-center xl:text-left">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-slate-900">
                      Turn your expertise into a <br className="hidden lg:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic pr-2">thriving local business.</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto xl:mx-0 mb-10 leading-relaxed">
                      Stop relying on middlemen. Showcase your skills on ApkaPass, receive direct phone calls from local customers, and scale your income on your own terms. We bring the visibility; you keep the profits.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-center xl:justify-start">
                      <button onClick={() => setshowprovider(true)}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2 hover-trigger">
                        Start Earning Today <ArrowRight size={14} strokeWidth={2} />
                      </button>
                      <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Free 2-minute setup
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: <Zap size={20} strokeWidth={2} />, color: "bg-emerald-50 text-emerald-500", title: "0% Commission", desc: "You do the hard work. You negotiate your rates and keep every single rupee." },
                      { icon: <PhoneIncoming size={20} strokeWidth={2} />, color: "bg-indigo-50 text-indigo-500", title: "Direct Leads", desc: "No hidden fees. Customers see your profile and call your number directly." },
                    ].map((card, i) => (
                      <div key={i} className="bg-[#FAFAFA] border border-slate-200 rounded-3xl p-6 hover:bg-white hover:shadow-lg transition-all hover-trigger group">
                        <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>{card.icon}</div>
                        <h4 className="text-xl font-black tracking-tight mb-2 text-slate-900">{card.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{card.desc}</p>
                      </div>
                    ))}
                    <div className="bg-[#FAFAFA] border border-slate-200 rounded-3xl p-6 hover:bg-white hover:shadow-lg transition-all hover-trigger md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 group">
                      <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-500 shrink-0 group-hover:scale-110 transition-transform">
                        <TrendingUp size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black tracking-tight mb-1 text-slate-900">Premium Trust Badge</h4>
                        <p className="text-sm text-slate-500 font-medium">Get verified and stand out in your locality. Customers trust the ApkaPass standard.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════ */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(79,70,229,0.25)_0%,transparent_60%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-6">
                  <Heart size={12} strokeWidth={2} /> Local Stories
                </div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">Trusted in your neighborhood.</h2>
                <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">Customers and providers both love the ApkaPass difference.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8 h-full flex flex-col hover:bg-slate-800 hover:border-indigo-500/30 transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                    <Quote size={24} className="text-indigo-500 mb-4" strokeWidth={1.5} />
                    <p className="text-slate-300 font-medium text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-black text-white text-sm">{t.name}</div>
                        <div className="text-slate-400 text-xs font-medium">{t.role} · {t.city}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {[...Array(t.rating)].map((_, j) => <Star key={j} size={10} className="text-amber-400 fill-amber-400" />)}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            CITIES/LOCALITIES (DYNAMIC)
        ════════════════════════════════════ */}
        <section className="py-24 bg-white min-h-[400px] flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Reveal>
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6">
                  <MapPin size={12} strokeWidth={2} /> Local Coverage
                </div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-4">
                  Serving {location ? `${location} & nearby` : "your neighborhood"}.
                </h2>
                <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">Expanding rapidly — bringing top-tier professionals directly to your doorstep.</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {/* 1. PROFESSIONAL LOADING STATE */}
              {isLocationLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-[3rem] border border-slate-100 max-w-2xl mx-auto">
                  <div className="relative w-16 h-16 mb-6">
                    <motion.div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                    <motion.div
                      className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin size={20} className="text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 mb-2">Locating Your Neighborhood</h3>
                  <p className="text-sm font-medium text-slate-500 animate-pulse text-center">Communicating with secure location services to find providers near you...</p>
                </div>

              // 2. EXPLICIT ERROR MESSAGE (Directs to Browser Settings)
              ) : locationError ? (
                <div className="max-w-2xl mx-auto text-center p-10 rounded-[3rem] bg-amber-50/50 border border-amber-100 flex flex-col items-center gap-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                    <Settings size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-amber-900 tracking-tight">Location Services Disabled</h3>
                  <p className="text-amber-700 font-medium text-base leading-relaxed max-w-md">
                    {locationError}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button onClick={getUserLocation} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-amber-600/20 active:scale-95 flex items-center gap-2">
                      <MapPin size={14} strokeWidth={2} /> Try Again
                    </button>
                  </div>
                </div>

              // 3. RENDER PURE API DATA (No Defaults)
              ) : nearbyPlaces.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                  {nearbyPlaces.map((city, i) => (
                    <button key={i} onClick={() => setShowLogin(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all hover:shadow-md hover:-translate-y-1 hover-trigger group">
                      <MapPin size={14} strokeWidth={2} className="text-indigo-400 group-hover:scale-110 transition-transform" /> {city}
                    </button>
                  ))}
                </div>

              // 4. FALLBACK IF API RETURNS EMPTY ARRAY (But No Errors)
              ) : (
                <div className="text-center p-8">
                  <p className="text-slate-500 font-medium">We couldn't detect specific neighborhood names around you right now, but you can still search manually above.</p>
                </div>
              )}
            </Reveal>

          </div>
        </section>
        
        <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12 pb-12 border-b border-slate-800">
              
              <div className="lg:max-w-sm">
                <a href="#top" onClick={(e) => handleSmoothScroll(e, "top")}
                  className="flex items-center gap-2 mb-4 hover-trigger">
                  <span className="text-2xl font-black tracking-tighter uppercase italic text-white">ApkaPass</span>
                </a>
                <p className="text-sm font-medium leading-relaxed mb-8 text-slate-500">
                  Your direct-connect platform for local home services and skilled professionals.
                </p>
                
                <div className="space-y-4">
                  <a href="mailto:support@apkapass.in" className="flex items-center gap-3 text-sm font-medium hover:text-indigo-400 transition-colors w-fit group">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                      <Mail size={14} className="text-indigo-500" />
                    </div>
                    support@apkapass.in
                  </a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-medium hover:text-indigo-400 transition-colors w-fit group">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-green-500/50 transition-colors">
                      <MessageCircle size={14} className="text-green-500" />
                    </div>
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-12 lg:gap-24">
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-5">Platform</h4>
                  <ul className="space-y-4">
                    <li>
                      <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                        <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-500" /> 
                        Customer Login
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setshowprovider(true)} className="text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                        <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-500" /> 
                        Partner Login
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-5">Legal</h4>
                  <ul className="space-y-4">
                    <li>
                      <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                        <Shield size={14} className="text-slate-700 group-hover:text-indigo-500 transition-colors" /> 
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                        <FileText size={14} className="text-slate-700 group-hover:text-indigo-500 transition-colors" /> 
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs font-medium text-slate-600">
                © {new Date().getFullYear()} ApkaPass. All rights reserved.
              </p>
              
              <div className="flex gap-3">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social Link" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:bg-indigo-600 hover:border-indigo-600 flex items-center justify-center transition-all hover-trigger">
                    <Icon size={14} strokeWidth={1.5} className="text-slate-400 hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </footer>

        {/* ── Customer Login Modal ── */}
        <AnimatePresence>
          {showLogin && (
            <ModalWrapper onClose={() => setShowLogin(false)}>
              <Logincomponent />
            </ModalWrapper>
          )}
        </AnimatePresence>

        {/* ── Provider Login Modal ── */}
        <AnimatePresence>
          {showprovider && (
            <ModalWrapper onClose={() => setshowprovider(false)}>
              <Providerlogin />
            </ModalWrapper>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}