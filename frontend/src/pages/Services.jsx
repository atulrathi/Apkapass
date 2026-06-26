/**
 * ProviderServices.jsx — ApkaPass Provider Portal
 *
 * Changes from v1:
 *  • "Both" offer type removed — only Service or Rental
 *  • Service listings have NO price field (service = skill, negotiate via chat)
 *  • Rental listings require a daily price
 *  • Searchable category dropdowns (no plain <select>)
 *  • Leaner field sets — only what's necessary
 *  • Step flow simplified: Offer Type → Details → Photos → Review
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../services/axiosinstance";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   CATEGORIES — professional Indian hyperlocal market data
───────────────────────────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  // Home Services
  {
    group: "Home Services",
    items: [
      "Plumbing",
      "Electrical Work",
      "Carpentry & Woodwork",
      "House Painting",
      "False Ceiling / POP Work",
      "Waterproofing",
      "Floor & Tile Work",
      "Glass & Aluminium Work",
      "Sofa & Upholstery Repair",
      "Home Deep Cleaning",
      "Kitchen Chimney Cleaning",
      "Pest Control",
    ],
  },
  // AC & Appliances
  {
    group: "AC & Appliances",
    items: [
      "AC Installation & Repair",
      "Refrigerator Repair",
      "Washing Machine Repair",
      "Microwave Repair",
      "Water Purifier Service",
      "TV / LED Repair",
      "Inverter & Battery Service",
      "Geyser Repair",
    ],
  },
  // Vehicle Services
  {
    group: "Vehicle Services",
    items: [
      "Car Repair & Servicing",
      "Bike Repair & Servicing",
      "Tyre Puncture & Fitting",
      "Denting & Painting",
      "Car Wash & Detailing",
      "Car AC Repair",
    ],
  },
  // Beauty & Wellness
  {
    group: "Beauty & Wellness",
    items: [
      "Men's Haircut & Grooming",
      "Women's Haircut & Styling",
      "Bridal Makeup",
      "Mehndi / Henna Artist",
      "Eyebrow Threading & Waxing",
      "Spa & Massage (At Home)",
      "Yoga / Fitness Training",
      "Diet & Nutrition Coaching",
    ],
  },
  // Education & Tutoring
  {
    group: "Education & Tutoring",
    items: [
      "School Tuition (Primary)",
      "School Tuition (Secondary)",
      "Maths & Science Tutor",
      "English Speaking Coach",
      "Computer & Coding Classes",
      "Music Lessons",
      "Dance Classes",
      "Drawing & Art Classes",
      "UPSC / Competitive Exam Coaching",
    ],
  },
  // Events & Photography
  {
    group: "Events & Photography",
    items: [
      "Wedding Photography",
      "Event Photography",
      "Video Editing",
      "DJ Services",
      "Event Decoration",
      "Catering & Food Services",
      "Tent & Mandap Setup",
      "Band & Baaja",
    ],
  },
  // Professional Services
  {
    group: "Professional Services",
    items: [
      "CA / Tax Filing",
      "Legal Consultation",
      "Property Documentation",
      "Interior Design",
      "Architect / Civil Engineer",
      "Digital Marketing",
      "Logo & Graphic Design",
      "Website Development",
      "Data Entry Operator",
      "Tailoring & Stitching",
    ],
  },
  // Other
  { group: "Other", items: ["Other Service"] },
];

const RENTAL_CATEGORIES = [
  {
    group: "Vehicles",
    items: [
      "Car Rental",
      "Bike / Scooter Rental",
      "Auto Rickshaw Rental",
      "Tractor Rental",
      "Mini Truck / Tempo Rental",
      "Bus / Coach Rental",
    ],
  },
  {
    group: "Event Equipment",
    items: [
      "DJ System & Sound Setup",
      "Tent / Shamiana",
      "Tables & Chairs",
      "Generator / Power Backup",
      "Projector & Screen",
      "Stage & Lighting Setup",
      "Wedding Car Rental",
      "Canopy & Gazebo",
    ],
  },
  {
    group: "Camera & Electronics",
    items: [
      "DSLR Camera",
      "Mirrorless Camera",
      "Video Camera / Camcorder",
      "Drone / FPV",
      "Gimbal & Stabilizer",
      "Laptop Rental",
      "Projector Rental",
    ],
  },
  {
    group: "Tools & Machinery",
    items: [
      "Power Drill & Tools",
      "Angle Grinder",
      "Concrete Mixer",
      "Scaffolding",
      "Welding Machine",
      "Water Pump / Motor",
      "Generator Set",
      "Construction Equipment",
    ],
  },
  {
    group: "Sports & Recreation",
    items: [
      "Bicycle Rental",
      "Cricket Kit",
      "Badminton Rackets",
      "Camping Tent",
      "Trekking Gear",
      "Swimming Equipment",
      "Gym Equipment",
    ],
  },
  { group: "Other", items: ["Other Rental Item"] },
];

const FLAT_SERVICE_CATS = SERVICE_CATEGORIES.flatMap((g) => g.items);
const FLAT_RENTAL_CATS = RENTAL_CATEGORIES.flatMap((g) => g.items);

/* ─────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand:        #16A34A;
    --brand-dark:   #14532D;
    --brand-mid:    #15803D;
    --brand-light:  #DCFCE7;
    --brand-pale:   #F0FDF4;
    --rental:       #2563EB;
    --rental-light: #DBEAFE;
    --rental-pale:  #EFF6FF;
    --surface:      #FFFFFF;
    --bg:           #F5F7F9;
    --border:       #E8EAED;
    --border-soft:  #F0F2F5;
    --text-1:       #0D1117;
    --text-2:       #374151;
    --text-3:       #6B7280;
    --text-4:       #9CA3AF;
    --danger:       #EF4444;
    --danger-pale:  #FEF2F2;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --shadow-lg:    0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
    --radius-sm:    8px;
    --radius-md:    12px;
    --radius-lg:    16px;
    --radius-xl:    20px;
    --font:         'Plus Jakarta Sans', sans-serif;
    --font-display: 'Sora', sans-serif;
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text-1); }

  .ps-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 14px; color: var(--text-1); background: #fff;
    font-family: var(--font); outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    line-height: 1.5;
  }
  .ps-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
  .ps-input::placeholder { color: var(--text-4); }
  textarea.ps-input { resize: vertical; min-height: 110px; }

  /* ── searchable category dropdown ── */
  .cat-dropdown {
    position: relative;
  }
  .cat-trigger {
    width: 100%; padding: 11px 36px 11px 14px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 14px; color: var(--text-1); background: #fff;
    font-family: var(--font); outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    cursor: pointer; text-align: left; line-height: 1.5; display: flex; align-items: center; justify-content: space-between;
  }
  .cat-trigger.placeholder-state { color: var(--text-4); }
  .cat-trigger:focus, .cat-trigger.open { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
  .cat-panel {
    position: absolute; top: calc(100% + 5px); left: 0; right: 0; z-index: 999;
    background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg); max-height: 310px; overflow: hidden;
    display: flex; flex-direction: column;
    animation: catPanelIn 0.16s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes catPanelIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cat-search-wrap {
    padding: 10px 10px 8px; border-bottom: 1px solid var(--border-soft); flex-shrink: 0;
  }
  .cat-search {
    width: 100%; padding: 8px 12px; border: 1.5px solid var(--border);
    border-radius: 8px; font-size: 13px; font-family: var(--font);
    outline: none; background: var(--bg);
  }
  .cat-search:focus { border-color: var(--brand); }
  .cat-list { overflow-y: auto; flex: 1; padding: 6px 0; }
  .cat-group-label {
    padding: 8px 14px 4px; font-size: 10px; font-weight: 800;
    color: var(--text-4); text-transform: uppercase; letter-spacing: 1px;
    font-family: var(--font-display);
  }
  .cat-item {
    padding: 9px 14px; font-size: 13.5px; cursor: pointer;
    color: var(--text-2); font-family: var(--font); transition: background 0.1s;
    display: flex; align-items: center; gap: 8px;
  }
  .cat-item:hover { background: var(--brand-pale); color: var(--brand-mid); }
  .cat-item.selected { background: var(--brand-pale); color: var(--brand); font-weight: 700; }
  .cat-item .cat-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; opacity: 0.5; }
  .cat-empty { padding: 20px; text-align: center; font-size: 13px; color: var(--text-4); }

  /* ── upload zone ── */
  .upload-zone {
    border: 2px dashed var(--border); border-radius: var(--radius-md);
    padding: 30px 20px; text-align: center; cursor: pointer;
    position: relative; transition: all 0.18s; background: #FAFAFA;
  }
  .upload-zone:hover, .upload-zone.drag-active {
    border-color: var(--brand); background: var(--brand-pale);
  }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

  /* ── service card ── */
  .service-card {
    background: var(--surface); border-radius: var(--radius-lg);
    border: 1.5px solid var(--border-soft); overflow: hidden;
    display: flex; flex-direction: column; box-shadow: var(--shadow-sm);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.18s;
    will-change: transform;
  }
  .service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--brand-light); }

  .offer-card {
    border: 2px solid var(--border); border-radius: var(--radius-lg);
    padding: 22px 20px; cursor: pointer; transition: all 0.18s;
    background: #fff; text-align: center; position: relative; overflow: hidden;
  }
  .offer-card:hover { border-color: var(--brand); box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .offer-card.selected-service { border-color: var(--brand); background: var(--brand-pale); }
  .offer-card.selected-rental  { border-color: var(--rental); background: var(--rental-pale); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #F0F2F5 0%, #E4E6E9 40%, #F0F2F5 80%);
    background-size: 600px 100%; animation: shimmer 1.6s infinite linear;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes imgFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes stepFadeIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .img-loaded { animation: imgFadeIn 0.35s ease forwards; }
  .card-enter { animation: cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .step-body  { animation: stepFadeIn 0.3s cubic-bezier(0.16,1,0.3,1) both; }
`;

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
const ICONS = {
  home: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </>
  ),
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  pencil: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
  trash2: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  menu: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </>
  ),
  sparkles: (
    <>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </>
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  checkCircle: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  refreshCw: (
    <>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </>
  ),
  wifiOff: (
    <>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" />
    </>
  ),
  tool: (
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </>
  ),
  package: (
    <>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </>
  ),
  dollar: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  gridView: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  messageCircle: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </>
  ),
};

const Icon = ({ name, size = 18, color, style: ex }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, display: "block", ...ex }}
  >
    {ICONS[name]}
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   NAV & SIDEBAR
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: "home", label: "Dashboard", path: "/provider-profile" },
  { icon: "briefcase", label: "Services", path: "/provider-services" },
  { icon: "star", label: "Reviews", path: "/provider-reviews" },
  { icon: "settings", label: "Settings", path: "/provider-settings" },
];

const Sidebar = ({ visible, navigate, currentPath }) => (
  <aside
    style={{
      background: "#fff",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
      zIndex: 40,
      boxShadow: visible ? "4px 0 24px rgba(0,0,0,0.04)" : "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: 260,
      height: "100dvh",
      background: "#fff",
      transform: visible ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}
  >
    <div style={{ padding: "24px", borderBottom: "1px solid #F2F4F7" }}>
      <h2
        style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 900,
          color: "#101828",
          letterSpacing: "-0.5px",
        }}
      >
        Apka<span style={{ color: "#16A34A" }}>Pass</span>
      </h2>
    </div>
    <nav
      style={{
        padding: "14px 10px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {NAV_ITEMS.map(({ icon, label, path }) => {
        const active = currentPath === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              width: "100%",
              background: active
                ? "linear-gradient(135deg,#F0FDF4,#DCFCE7)"
                : "transparent",
              color: active ? "#15803D" : "#4B5563",
              fontWeight: active ? 700 : 500,
              fontSize: 13.5,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
              fontFamily: "var(--font)",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "#F9FAFB";
                e.currentTarget.style.color = "#111827";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#4B5563";
              }
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: active ? "#fff" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Icon
                name={icon}
                size={15}
                color={active ? "#16A34A" : undefined}
              />
            </div>
            {label}
          </button>
        );
      })}
    </nav>
  </aside>
);

/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */
const Toast = ({ toast }) => (
  <div
    style={{
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 9999,
      background:
        toast.type === "success"
          ? "linear-gradient(135deg,#14532D,#166534)"
          : "linear-gradient(135deg,#7F1D1D,#991B1B)",
      color: "#fff",
      padding: "13px 18px",
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 13.5,
      boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
      transform: toast.visible
        ? "translateY(0) scale(1)"
        : "translateY(-60px) scale(0.96)",
      opacity: toast.visible ? 1 : 0,
      transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      maxWidth: 360,
      pointerEvents: "none",
      fontFamily: "var(--font)",
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background:
          toast.type === "success"
            ? "rgba(74,222,128,0.2)"
            : "rgba(252,165,165,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon
        name={toast.type === "success" ? "checkCircle" : "alertCircle"}
        size={14}
        color={toast.type === "success" ? "#4ADE80" : "#FCA5A5"}
      />
    </div>
    {toast.message}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────────────────────── */
const StepIndicator = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={label}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              minWidth: 52,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                transition: "all 0.2s",
                background: done
                  ? "linear-gradient(135deg,#16A34A,#22C55E)"
                  : active
                    ? "#0D1117"
                    : "#F3F4F6",
                color: done || active ? "#fff" : "#9CA3AF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                boxShadow: active
                  ? "0 3px 10px rgba(0,0,0,0.15)"
                  : done
                    ? "0 3px 8px rgba(22,163,74,0.3)"
                    : "none",
              }}
            >
              {done ? <Icon name="check" size={13} color="#fff" /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 9.5,
                fontWeight: active ? 700 : 500,
                color: active ? "#0D1117" : done ? "#16A34A" : "#9CA3AF",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                margin: "0 4px",
                marginBottom: 20,
                borderRadius: 99,
                background: done
                  ? "linear-gradient(90deg,#16A34A,#22C55E)"
                  : "#F0F2F5",
                transition: "background 0.4s ease",
                minWidth: 8,
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   SEARCHABLE CATEGORY DROPDOWN
───────────────────────────────────────────────────────────── */
const CategoryDropdown = ({
  value,
  onChange,
  groups,
  placeholder = "Search or select a category…",
  accentColor = "service",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const isRental = accentColor === "rental";

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current)
      setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  const filtered = query.trim()
    ? groups
        .map((g) => ({
          ...g,
          items: g.items.filter((i) =>
            i.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
        .filter((g) => g.items.length > 0)
    : groups;

  const totalFiltered = filtered.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="cat-dropdown" ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className={`cat-trigger${!value ? " placeholder-state" : ""}${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        style={{
          border: `1.5px solid ${open ? (isRental ? "var(--rental)" : "var(--brand)") : "var(--border)"}`,
          boxShadow: open
            ? `0 0 0 3px ${isRental ? "rgba(37,99,235,0.12)" : "rgba(22,163,74,0.12)"}`
            : "none",
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || placeholder}
        </span>
        <Icon
          name="chevronDown"
          size={14}
          color="var(--text-3)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div className="cat-panel">
          <div className="cat-search-wrap">
            <div style={{ position: "relative" }}>
              <Icon
                name="search"
                size={13}
                color="var(--text-4)"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                ref={searchRef}
                className="cat-search"
                style={{ paddingLeft: 30 }}
                placeholder="Search categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="cat-list">
            {totalFiltered === 0 ? (
              <div className="cat-empty">No categories match "{query}"</div>
            ) : (
              filtered.map((group) => (
                <div key={group.group}>
                  <div className="cat-group-label">{group.group}</div>
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className={`cat-item${value === item ? " selected" : ""}`}
                      onClick={() => {
                        onChange(item);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <span className="cat-dot" />
                      {item}
                      {value === item && (
                        <Icon
                          name="check"
                          size={12}
                          color="var(--brand)"
                          style={{ marginLeft: "auto" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAZY IMAGE
───────────────────────────────────────────────────────────── */
const LazyImage = ({
  src,
  alt = "Service photo",
  style: extraStyle,
  eager = false,
}) => {
  const [status, setStatus] = useState("idle");
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const startLoad = useCallback(() => {
    if (status !== "idle") return;
    setStatus("loading");
    const img = new window.Image();
    img.src = src;
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
  }, [src, status]);

  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }
    if (eager) {
      startLoad();
      return;
    }
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoad();
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "80px" },
    );
    if (imgRef.current) observerRef.current.observe(imgRef.current);
    return () => observerRef.current?.disconnect();
  }, [src, eager, startLoad]);

  return (
    <div
      ref={imgRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...extraStyle,
      }}
    >
      {(status === "idle" || status === "loading") && (
        <div
          className="shimmer"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              opacity: 0.4,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#CBD5E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="image" size={14} color="#94A3B8" />
            </div>
            <span
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: "#94A3B8",
                letterSpacing: "2px",
                fontFamily: "var(--font-display)",
              }}
            >
              APKAPASS
            </span>
          </div>
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#F1F5F9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Icon name="image" size={16} color="#94A3B8" />
          <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>
            No Image
          </span>
        </div>
      )}
      {(status === "loading" || status === "loaded") && (
        <img
          src={src}
          alt={alt}
          className={status === "loaded" ? "img-loaded" : ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SERVICE COVER MOSAIC
───────────────────────────────────────────────────────────── */
const ServiceCover = ({ images = [] }) => {
  const valid = images.filter((img) => img?.url);
  const display = valid.slice(0, 4);
  const extra = valid.length > 4 ? valid.length - 4 : 0;
  const cellStyle = { width: "100%", height: "100%", overflow: "hidden" };

  if (!display.length)
    return (
      <div
        style={{
          height: 160,
          background: "linear-gradient(135deg,#F8FAFC,#F1F5F9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg,#E2E8F0,#CBD5E1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="image" size={18} color="#94A3B8" />
        </div>
        <p
          style={{
            fontSize: 11,
            color: "#94A3B8",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          No photos yet
        </p>
      </div>
    );
  if (display.length === 1)
    return (
      <div style={{ height: 160, overflow: "hidden" }}>
        <LazyImage src={display[0].url} eager style={cellStyle} />
      </div>
    );
  if (display.length === 2)
    return (
      <div
        style={{
          height: 160,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {display.map((img, i) => (
          <div key={img._id || i} style={{ overflow: "hidden" }}>
            <LazyImage src={img.url} eager={i === 0} style={cellStyle} />
          </div>
        ))}
      </div>
    );
  if (display.length === 3)
    return (
      <div
        style={{
          height: 160,
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 2,
        }}
      >
        <div style={{ gridRow: "1 / 3", overflow: "hidden" }}>
          <LazyImage src={display[0].url} eager style={cellStyle} />
        </div>
        {display.slice(1).map((img, i) => (
          <div key={img._id || i} style={{ overflow: "hidden" }}>
            <LazyImage src={img.url} eager={i === 0} style={cellStyle} />
          </div>
        ))}
      </div>
    );
  return (
    <div
      style={{
        height: 160,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 2,
      }}
    >
      {display.map((img, i) => (
        <div
          key={img._id || i}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <LazyImage src={img.url} eager={i === 0} style={cellStyle} />
          {i === 3 && extra > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.52)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                backdropFilter: "blur(2px)",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                +{extra}
              </span>
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                more
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────────────────────── */
const SkeletonCard = ({ delay = 0 }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      border: "1.5px solid var(--border-soft)",
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
      animation: `cardReveal 0.4s ${delay}ms ease both`,
    }}
  >
    <div
      className="shimmer"
      style={{
        height: 160,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.35,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "#CBD5E1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="gridView" size={16} color="#94A3B8" />
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: "#94A3B8",
            letterSpacing: "3px",
            fontFamily: "var(--font-display)",
          }}
        >
          APKAPASS
        </span>
      </div>
    </div>
    <div
      style={{
        padding: "16px 18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        className="shimmer"
        style={{ height: 16, borderRadius: 6, width: "55%" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          className="shimmer"
          style={{ height: 11, borderRadius: 5, width: "88%" }}
        />
        <div
          className="shimmer"
          style={{ height: 11, borderRadius: 5, width: "65%" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <div
          className="shimmer"
          style={{ flex: 1, height: 34, borderRadius: 9 }}
        />
        <div
          className="shimmer"
          style={{ width: 34, height: 34, borderRadius: 9 }}
        />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────────────────────── */
const ServiceCard = ({ service, onEdit, onDelete, index = 0 }) => {
  const images = Array.isArray(service.images) ? service.images : [];
  const isRental = service.type === "rental";

  return (
    <div
      className="service-card card-enter"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <ServiceCover images={images} />
      <div
        style={{
          padding: "14px 16px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: isRental ? "#EFF6FF" : "#F0FDF4",
              border: `1px solid ${isRental ? "#BFDBFE" : "#DCFCE7"}`,
              borderRadius: 99,
              padding: "3px 8px",
              fontSize: 10.5,
              color: isRental ? "#1D4ED8" : "#15803D",
              fontWeight: 700,
            }}
          >
            <Icon
              name={isRental ? "package" : "tool"}
              size={9}
              color={isRental ? "#1D4ED8" : "#15803D"}
            />
            {isRental ? "Rental" : "Service"}
          </span>
          {service.category && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 10.5,
                color: "#6B7280",
                fontWeight: 600,
              }}
            >
              {service.category}
            </span>
          )}
        </div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#0D1117",
            margin: "0 0 6px",
            lineHeight: 1.4,
            letterSpacing: "-0.1px",
            fontFamily: "var(--font-display)",
          }}
        >
          {service.name}
        </h3>
        <p
          style={{
            fontSize: 12.5,
            color: "#6B7280",
            margin: "0 0 12px",
            lineHeight: 1.65,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {service.description || "No description provided."}
        </p>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          {isRental && service.price && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#FFF7ED",
                border: "1px solid #FED7AA",
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 11,
                color: "#C2410C",
                fontWeight: 700,
              }}
            >
              <Icon name="dollar" size={9} color="#C2410C" />₹{service.price}
              /day
            </span>
          )}
          {!isRental && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#F0FDF4",
                border: "1px solid #DCFCE7",
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 11,
                color: "#15803D",
                fontWeight: 600,
              }}
            >
              <Icon name="messageCircle" size={9} color="#16A34A" />
              Price on request
            </span>
          )}
          {images.filter((i) => i?.url).length > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#F0FDF4",
                border: "1px solid #DCFCE7",
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 11,
                color: "#15803D",
                fontWeight: 600,
              }}
            >
              <Icon name="camera" size={9} color="#16A34A" />
              {images.filter((i) => i?.url).length} photo
              {images.filter((i) => i?.url).length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button
            onClick={() => onEdit(service)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#F9FAFB",
              color: "#374151",
              border: "1.5px solid #E5E7EB",
              borderRadius: 9,
              padding: "8px 0",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.14s",
              fontFamily: "var(--font)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F3F4F6";
              e.currentTarget.style.borderColor = "#D1D5DB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F9FAFB";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
          >
            <Icon name="pencil" size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(service.id || service._id)}
            style={{
              width: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFF5F5",
              color: "#EF4444",
              border: "1.5px solid #FEE2E2",
              borderRadius: 9,
              cursor: "pointer",
              transition: "all 0.14s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF5F5")}
          >
            <Icon name="trash2" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   UPLOAD PREVIEW GRID
───────────────────────────────────────────────────────────── */
const UploadPreviewGrid = ({ previews, onRemove }) => {
  if (!previews.length) return null;
  const count = previews.length;
  const items = previews.slice(0, 4);
  const extra = count > 4 ? count - 4 : 0;
  const gridStyle = {
    1: { gridTemplateColumns: "1fr", gridTemplateRows: "180px" },
    2: { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "180px" },
    3: { gridTemplateColumns: "2fr 1fr", gridTemplateRows: "90px 90px" },
    4: { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "90px 90px" },
  }[Math.min(count, 4)];

  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 12,
        overflow: "hidden",
        border: "1.5px solid #E5E7EB",
      }}
    >
      <div style={{ display: "grid", gap: 2, ...gridStyle }}>
        {items.map((src, idx) => {
          const spanStyle =
            count === 3 && idx === 0 ? { gridRow: "1 / 3" } : {};
          const isLast = extra > 0 && idx === 3;
          return (
            <div
              key={idx}
              style={{ position: "relative", overflow: "hidden", ...spanStyle }}
            >
              <img
                src={src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {isLast && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.55)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <span
                    style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}
                  >
                    +{extra}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 8,
                      letterSpacing: "1px",
                      fontWeight: 600,
                    }}
                  >
                    MORE PHOTOS
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background 0.14s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(220,38,38,0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
                }
              >
                <Icon name="x" size={10} color="#fff" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────────────────────────── */
const Field = ({ label, required, hint, children, counter }) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          display: "block",
        }}
      >
        {label}
        {required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
        {!required && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "#9CA3AF",
              marginLeft: 5,
            }}
          >
            Optional
          </span>
        )}
      </label>
      {counter && (
        <span
          style={{ fontSize: 11, color: counter.warn ? "#EF4444" : "#9CA3AF" }}
        >
          {counter.text}
        </span>
      )}
    </div>
    {children}
    {hint && (
      <p style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 5 }}>{hint}</p>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   OFFER TYPE SELECTOR — Step 0 (only Service or Rental)
───────────────────────────────────────────────────────────── */
const OfferTypeStep = ({ selected, onChange }) => {
  const options = [
    {
      id: "service",
      icon: "tool",
      iconColor: "#16A34A",
      bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
      border: "#BBF7D0",
      title: "Service",
      tagline: "I offer a skill",
      desc: "Plumbing, electrical, tutoring, cleaning, beauty, repairs, and more. Customers contact you to negotiate price.",
      accent: "#16A34A",
      examples: ["Plumber", "Electrician", "Tutor", "Cleaner"],
    },
    {
      id: "rental",
      icon: "package",
      iconColor: "#2563EB",
      bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
      border: "#BFDBFE",
      title: "Rental",
      tagline: "I rent out items",
      desc: "Cars, cameras, tools, DJ systems, event equipment, bikes, and more. You set a daily price.",
      accent: "#2563EB",
      examples: ["Car", "Camera", "DJ System", "Tools"],
    },
  ];

  return (
    <div className="step-body">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
            border: "2px solid #BBF7D0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 4px 14px rgba(22,163,74,0.15)",
          }}
        >
          <Icon name="sparkles" size={24} color="#16A34A" />
        </div>
        <h4
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#0D1117",
            margin: "0 0 6px",
            fontFamily: "var(--font-display)",
          }}
        >
          What do you want to offer?
        </h4>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          This determines the fields you need to fill in
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`offer-card${isSelected ? ` selected-${opt.id}` : ""}`}
              style={{
                cursor: "pointer",
                fontFamily: "var(--font)",
                textAlign: "left",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: isSelected ? opt.bg : "#F3F4F6",
                    border: isSelected
                      ? `1.5px solid ${opt.border}`
                      : "1.5px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.18s",
                    boxShadow: isSelected
                      ? `0 3px 10px ${opt.accent}22`
                      : "none",
                  }}
                >
                  <Icon
                    name={opt.icon}
                    size={20}
                    color={isSelected ? opt.iconColor : "#9CA3AF"}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: isSelected ? opt.accent : "#0D1117",
                        margin: 0,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {opt.title}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isSelected ? opt.accent : "#9CA3AF",
                        background: isSelected ? `${opt.accent}14` : "#F3F4F6",
                        borderRadius: 99,
                        padding: "2px 8px",
                      }}
                    >
                      {opt.tagline}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12.5,
                      color: isSelected ? opt.accent : "#6B7280",
                      margin: "0 0 8px",
                      lineHeight: 1.5,
                      opacity: isSelected ? 0.85 : 1,
                    }}
                  >
                    {opt.desc}
                  </p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {opt.examples.map((ex) => (
                      <span
                        key={ex}
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: isSelected ? opt.accent : "#9CA3AF",
                          background: isSelected
                            ? `${opt.accent}10`
                            : "#F9FAFB",
                          border: `1px solid ${isSelected ? `${opt.accent}28` : "#E5E7EB"}`,
                          borderRadius: 6,
                          padding: "2px 7px",
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    flexShrink: 0,
                    border: `2px solid ${isSelected ? opt.accent : "#D1D5DB"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    background: isSelected ? opt.accent : "transparent",
                    marginTop: 2,
                  }}
                >
                  {isSelected && <Icon name="check" size={11} color="#fff" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SERVICE DETAILS — Step 1 for "service" flow
   Fields: Category, Name, Experience, Description
   NO price field (negotiated via chat)
───────────────────────────────────────────────────────────── */
const ServiceDetailsStep = ({ data, onChange, isGenerating, onGenerate }) => (
  <div
    className="step-body"
    style={{ display: "flex", flexDirection: "column", gap: 20 }}
  >
    {/* Info banner: price on request */}
    <div
      style={{
        background: "#F0FDF4",
        border: "1px solid #DCFCE7",
        borderRadius: 10,
        padding: "11px 14px",
        display: "flex",
        gap: 9,
        alignItems: "center",
      }}
    >
      <Icon name="messageCircle" size={14} color="#16A34A" />
      <p
        style={{ fontSize: 12.5, color: "#166534", margin: 0, lineHeight: 1.5 }}
      >
        <strong>No price needed.</strong> Customers contact you directly to
        discuss rates. This keeps you flexible.
      </p>
    </div>

    <Field label="Service Category" required>
      <CategoryDropdown
        value={data.serviceCategory}
        onChange={(val) =>
          onChange({ target: { name: "serviceCategory", value: val } })
        }
        groups={SERVICE_CATEGORIES}
        placeholder="Search or select a category…"
        accentColor="service"
      />
    </Field>

    <Field
      label="Service Name"
      required
      counter={{
        text: `${data.serviceName?.length || 0}/80`,
        warn: (data.serviceName?.length || 0) > 72,
      }}
    >
      <input
        type="text"
        name="serviceName"
        value={data.serviceName}
        onChange={onChange}
        className="ps-input"
        placeholder="e.g. Residential Plumbing Repair"
        maxLength={80}
      />
    </Field>

    <Field
      label="Years of Experience"
      required
      hint="Providers with proven experience get more trust from customers."
    >
      <select
        name="serviceExp"
        value={data.serviceExp}
        onChange={onChange}
        className="ps-input"
        style={{
          cursor: "pointer",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 36,
          appearance: "none",
        }}
      >
        <option value="">Select experience…</option>
        {[
          "Less than 1 year",
          "1–2 years",
          "3–5 years",
          "5–10 years",
          "10+ years",
        ].map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
    </Field>

    <Field
      label="Description"
      required
      counter={{
        text: `${data.serviceDesc?.length || 0}/500`,
        warn: (data.serviceDesc?.length || 0) > 460,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}
      >
        <button
          type="button"
          onClick={() => onGenerate("service")}
          disabled={isGenerating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: isGenerating ? "#EDE9FE" : "#7C3AED",
            color: isGenerating ? "#7C3AED" : "#fff",
            border: "none",
            borderRadius: 7,
            padding: "5px 11px",
            fontSize: 12,
            fontWeight: 700,
            cursor: isGenerating ? "wait" : "pointer",
            transition: "all 0.15s",
            fontFamily: "var(--font)",
          }}
        >
          {isGenerating ? (
            <div
              style={{
                width: 11,
                height: 11,
                border: "2px solid #7C3AED",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <Icon name="sparkles" size={11} color="#fff" />
          )}
          {isGenerating ? "Writing…" : "AI Write"}
        </button>
      </div>
      <textarea
        name="serviceDesc"
        value={data.serviceDesc}
        onChange={onChange}
        className="ps-input"
        rows={4}
        placeholder="Describe your service — tools, techniques, certifications, what sets you apart…"
        maxLength={500}
      />
    </Field>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   RENTAL DETAILS — Step 1 for "rental" flow
   Fields: Category, Item Name, Daily Price, Description
───────────────────────────────────────────────────────────── */
const RentalDetailsStep = ({ data, onChange, isGenerating, onGenerate }) => (
  <div
    className="step-body"
    style={{ display: "flex", flexDirection: "column", gap: 20 }}
  >
    <Field label="Rental Category" required>
      <CategoryDropdown
        value={data.rentalCategory}
        onChange={(val) =>
          onChange({ target: { name: "rentalCategory", value: val } })
        }
        groups={RENTAL_CATEGORIES}
        placeholder="Search or select a category…"
        accentColor="rental"
      />
    </Field>

    <Field
      label="Item Name"
      required
      counter={{
        text: `${data.rentalName?.length || 0}/80`,
        warn: (data.rentalName?.length || 0) > 72,
      }}
    >
      <input
        type="text"
        name="rentalName"
        value={data.rentalName}
        onChange={onChange}
        className="ps-input"
        placeholder="e.g. Canon EOS 90D DSLR Camera"
        maxLength={80}
      />
    </Field>

    <Field
      label="Daily Rental Price (₹)"
      required
      hint="Set a base daily rate. You can negotiate final terms in chat."
    >
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: "#6B7280",
            fontWeight: 600,
          }}
        >
          ₹
        </span>
        <input
          type="number"
          name="rentalPrice"
          value={data.rentalPrice}
          onChange={onChange}
          className="ps-input"
          placeholder="500"
          min={0}
          style={{ paddingLeft: 28 }}
        />
      </div>
    </Field>

    <Field
      label="Item Description"
      required
      counter={{
        text: `${data.rentalDesc?.length || 0}/500`,
        warn: (data.rentalDesc?.length || 0) > 460,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}
      >
        <button
          type="button"
          onClick={() => onGenerate("rental")}
          disabled={isGenerating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: isGenerating ? "#DBEAFE" : "#2563EB",
            color: isGenerating ? "#2563EB" : "#fff",
            border: "none",
            borderRadius: 7,
            padding: "5px 11px",
            fontSize: 12,
            fontWeight: 700,
            cursor: isGenerating ? "wait" : "pointer",
            transition: "all 0.15s",
            fontFamily: "var(--font)",
          }}
        >
          {isGenerating ? (
            <div
              style={{
                width: 11,
                height: 11,
                border: "2px solid #2563EB",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <Icon name="sparkles" size={11} color="#fff" />
          )}
          {isGenerating ? "Writing…" : "AI Write"}
        </button>
      </div>
      <textarea
        name="rentalDesc"
        value={data.rentalDesc}
        onChange={onChange}
        className="ps-input"
        rows={4}
        placeholder="Describe the item — condition, included accessories, usage notes, availability…"
        maxLength={500}
      />
    </Field>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   PHOTOS STEP
───────────────────────────────────────────────────────────── */
const PhotosStep = ({
  previews,
  onAdd,
  onRemove,
  onClearAll,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}) => (
  <div
    className="step-body"
    style={{ display: "flex", flexDirection: "column", gap: 18 }}
  >
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
          Photos
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "#9CA3AF",
              marginLeft: 6,
            }}
          >
            Optional
          </span>
        </label>
        {previews.length > 0 && (
          <button
            onClick={onClearAll}
            style={{
              background: "none",
              border: "none",
              color: "#EF4444",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "var(--font)",
            }}
          >
            Clear all
          </button>
        )}
      </div>
      <div
        className={`upload-zone${dragOver ? " drag-active" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onAdd(e.target.files)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 9,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: dragOver ? "#DCFCE7" : "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.18s",
            }}
          >
            <Icon
              name="upload"
              size={21}
              color={dragOver ? "#16A34A" : "#9CA3AF"}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: dragOver ? "#16A34A" : "#374151",
                margin: "0 0 2px",
              }}
            >
              Drop photos here or{" "}
              <span style={{ color: "#16A34A", textDecoration: "underline" }}>
                browse
              </span>
            </p>
            <p style={{ fontSize: 11.5, color: "#9CA3AF", margin: 0 }}>
              PNG, JPG, WEBP — max 10 MB each
            </p>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <>
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              margin: "14px 0 4px",
              fontWeight: 600,
            }}
          >
            Card preview — how customers see your listing
          </p>
          <UploadPreviewGrid previews={previews} onRemove={onRemove} />
          <div
            style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}
          >
            {previews.map((src, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  borderRadius: 9,
                  overflow: "hidden",
                  border:
                    idx === 0 ? "2.5px solid #16A34A" : "1.5px solid #E5E7EB",
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {idx === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "#16A34A",
                      padding: "1.5px 0",
                      fontSize: 7,
                      fontWeight: 800,
                      color: "#fff",
                      textAlign: "center",
                      letterSpacing: "0.5px",
                    }}
                  >
                    COVER
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>

    <div
      style={{
        background: "var(--brand-pale)",
        border: "1px solid var(--brand-light)",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <Icon
        name="shieldCheck"
        size={16}
        color="#16A34A"
        style={{ marginTop: 1 }}
      />
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#166534",
            margin: "0 0 3px",
          }}
        >
          Listings with 3+ photos get 3× more leads
        </p>
        <p
          style={{
            fontSize: 12.5,
            color: "#15803D",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Real photos build trust faster than any description.
        </p>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   REVIEW STEP
───────────────────────────────────────────────────────────── */
const ReviewStep = ({ form, offerType, previews }) => {
  const isRental = offerType === "rental";
  const name = isRental ? form.rentalName : form.serviceName;
  const desc = isRental ? form.rentalDesc : form.serviceDesc;
  const price = isRental ? form.rentalPrice : null;

  return (
    <div
      className="step-body"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <p
        style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", margin: 0 }}
      >
        Preview your listing
      </p>
      <div
        style={{
          background: "#F9FAFB",
          borderRadius: 14,
          overflow: "hidden",
          border: "1.5px solid #F0F2F5",
        }}
      >
        {previews.length > 0 ? (
          <img
            src={previews[0]}
            alt=""
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              height: 80,
              background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="image" size={24} color="#86EFAC" />
          </div>
        )}
        <div style={{ padding: "14px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: isRental ? "#EFF6FF" : "#F0FDF4",
                border: `1px solid ${isRental ? "#BFDBFE" : "#DCFCE7"}`,
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 10,
                fontWeight: 700,
                color: isRental ? "#1D4ED8" : "#15803D",
              }}
            >
              <Icon
                name={isRental ? "package" : "tool"}
                size={9}
                color={isRental ? "#1D4ED8" : "#15803D"}
              />
              {isRental ? "Rental" : "Service"}
            </span>
            {price ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#C2410C",
                  background: "#FFF7ED",
                  border: "1px solid #FED7AA",
                  borderRadius: 99,
                  padding: "3px 8px",
                }}
              >
                ₹{price}/day
              </span>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#15803D",
                  background: "#F0FDF4",
                  border: "1px solid #DCFCE7",
                  borderRadius: 99,
                  padding: "3px 8px",
                }}
              >
                Price on request
              </span>
            )}
          </div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#0D1117",
              margin: "0 0 5px",
              fontFamily: "var(--font-display)",
            }}
          >
            {name || "Listing Name"}
          </h4>
          <p
            style={{
              fontSize: 12.5,
              color: "#6B7280",
              margin: "0 0 10px",
              lineHeight: 1.6,
            }}
          >
            {desc || "No description."}
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 10.5,
                color: "#374151",
                fontWeight: 600,
              }}
            >
              <Icon name="camera" size={9} color="#374151" />
              {previews.length} photo{previews.length !== 1 ? "s" : ""}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "var(--brand-pale)",
                border: "1px solid var(--brand-light)",
                borderRadius: 99,
                padding: "3px 8px",
                fontSize: 10.5,
                color: "#15803D",
                fontWeight: 600,
              }}
            >
              <Icon name="checkCircle" size={9} color="#16A34A" />
              Ready to publish
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 12,
          padding: "13px 16px",
          display: "flex",
          gap: 9,
          alignItems: "flex-start",
        }}
      >
        <Icon name="info" size={15} color="#3B82F6" style={{ marginTop: 1 }} />
        <p
          style={{
            fontSize: 12.5,
            color: "#1D4ED8",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Your listing goes live immediately after publishing. You can edit or
          remove it at any time.
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────── */
const EmptyState = ({ onAdd }) => (
  <div
    style={{
      background: "#fff",
      border: "2px dashed #E5E7EB",
      borderRadius: 22,
      padding: "64px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
        borderRadius: 20,
        border: "2px solid #BBF7D0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 22,
        boxShadow: "0 8px 20px rgba(22,163,74,0.12)",
      }}
    >
      <Icon name="briefcase" size={30} color="#22C55E" />
    </div>
    <h3
      style={{
        fontSize: 21,
        fontWeight: 800,
        color: "#0D1117",
        margin: "0 0 10px",
        letterSpacing: "-0.4px",
        fontFamily: "var(--font-display)",
      }}
    >
      No listings yet
    </h3>
    <p
      style={{
        fontSize: 14,
        color: "#6B7280",
        maxWidth: 400,
        lineHeight: 1.7,
        margin: "0 0 30px",
      }}
    >
      Customers can't find you on ApkaPass until you add a listing. It only
      takes 2 minutes to go live.
    </p>
    <button
      onClick={onAdd}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: "linear-gradient(135deg,#16A34A,#22C55E)",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: "13px 30px",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 6px 20px rgba(22,163,74,0.3)",
        transition: "all 0.18s",
        fontFamily: "var(--font)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(22,163,74,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.3)";
      }}
    >
      <Icon name="plus" size={17} color="#fff" />
      Add Your First Listing
    </button>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   CONSTANTS: Steps are now always 4 (same for service & rental)
   Offer Type → Details → Photos → Review
───────────────────────────────────────────────────────────── */
const MODAL_STEPS = ["Offer Type", "Details", "Photos", "Review"];
const EDIT_STEPS = ["Details", "Photos", "Review"];

/* ─────────────────────────────────────────────────────────────
   INITIAL FORM STATE
───────────────────────────────────────────────────────────── */
const INITIAL_FORM = {
  offerType: "",
  serviceCategory: "",
  serviceName: "",
  serviceExp: "",
  serviceDesc: "",
  rentalCategory: "",
  rentalName: "",
  rentalPrice: "",
  rentalDesc: "",
  imageFiles: [],
  imagePreviews: [],
};

/* ─────────────────────────────────────────────────────────────
   VALIDATION
───────────────────────────────────────────────────────────── */
const validateStep = (step, form, offerType, isEdit) => {
  if (!isEdit && step === 0) return !!form.offerType;

  const detailsStep = isEdit ? 0 : 1;
  if (step === detailsStep) {
    if (offerType === "service") {
      return !!(
        form.serviceCategory &&
        form.serviceName.trim() &&
        form.serviceExp &&
        form.serviceDesc.trim()
      );
    }
    if (offerType === "rental") {
      return !!(
        form.rentalCategory &&
        form.rentalName.trim() &&
        form.rentalPrice &&
        form.rentalDesc.trim()
      );
    }
  }
  return true;
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const ProviderServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  /* ── Inject CSS ── */
  useEffect(() => {
    const id = "ps-global-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  /* ── Responsive ── */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Toast ── */
  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  /* ── Fetch ── */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const res = await axiosInstance.get("/service/getservices");
      const d = res?.data;
      const list = Array.isArray(d)
        ? d
        : Array.isArray(d?.services)
          ? d.services
          : [];
      setServices(list);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403)
        setPageError("Your session has expired. Please log in again.");
      else if (status >= 500)
        setPageError(
          "Our servers are having issues. Please try again in a few minutes.",
        );
      else if (!navigator.onLine)
        setPageError(
          "No internet connection. Check your network and try again.",
        );
      else
        setPageError(
          err.response?.data?.message ||
            "Something went wrong while loading your listings.",
        );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /* ── Form change ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  /* ── AI description ── */
  const handleGenerateDesc = useCallback(
    (type) => {
      const nameKey = type === "rental" ? "rentalName" : "serviceName";
      const descKey = type === "rental" ? "rentalDesc" : "serviceDesc";
      if (!form[nameKey].trim()) {
        showToast("Enter a name first.", "error");
        return;
      }
      setIsGenerating(true);
      setTimeout(() => {
        setForm((p) => ({
          ...p,
          [descKey]:
            type === "rental"
              ? `Well-maintained ${p[nameKey].trim()} available for daily/weekly rental. Includes all accessories and a brief usage demo. Clean, fully functional, and ready to use from day one. Ideal for events, projects, or short-term needs.`
              : `Professional ${p[nameKey].trim()} services backed by years of hands-on experience. We use quality tools and proven techniques to deliver reliable, high-quality results every time. Customer satisfaction is our top priority.`,
        }));
        setIsGenerating(false);
        showToast("Description generated!");
      }, 1600);
    },
    [form, showToast],
  );

  /* ── Image management ── */
  const addFiles = useCallback(
    (files) => {
      const valid = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!valid.length) {
        showToast("Only image files are supported.", "error");
        return;
      }
      const oversized = valid.filter((f) => f.size > 10 * 1024 * 1024);
      if (oversized.length)
        showToast(
          `${oversized.length} file(s) over 10 MB were skipped.`,
          "error",
        );
      const ok = valid.filter((f) => f.size <= 10 * 1024 * 1024);
      const previews = ok.map((f) => URL.createObjectURL(f));
      setForm((p) => ({
        ...p,
        imageFiles: [...p.imageFiles, ...ok],
        imagePreviews: [...p.imagePreviews, ...previews],
      }));
    },
    [showToast],
  );

  const removeFile = useCallback((idx) => {
    setForm((p) => {
      const files = [...p.imageFiles];
      const prev = [...p.imagePreviews];
      URL.revokeObjectURL(prev[idx]);
      files.splice(idx, 1);
      prev.splice(idx, 1);
      return { ...p, imageFiles: files, imagePreviews: prev };
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    setForm((p) => {
      p.imagePreviews.forEach((u) => URL.revokeObjectURL(u));
      return { ...p, imageFiles: [], imagePreviews: [] };
    });
  }, []);

  /* ── Modal helpers ── */
  const resetForm = useCallback(() => {
    setForm((p) => {
      p.imagePreviews.forEach((u) => URL.revokeObjectURL(u));
      return { ...INITIAL_FORM };
    });
    setModalStep(0);
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = useCallback(
    (s) => {
      setEditingId(s.id || s._id);
      resetForm();
      const type = s.type || "service";
      setForm({
        ...INITIAL_FORM,
        offerType: type,
        serviceName: type === "service" ? s.name || "" : "",
        serviceDesc: type === "service" ? s.description || "" : "",
        serviceCategory: type === "service" ? s.category || "" : "",
        serviceExp: type === "service" ? s.experience || "" : "",
        rentalName: type === "rental" ? s.name || "" : "",
        rentalDesc: type === "rental" ? s.description || "" : "",
        rentalCategory: type === "rental" ? s.category || "" : "",
        rentalPrice: type === "rental" ? s.price || "" : "",
      });
      setIsModalOpen(true);
    },
    [resetForm],
  );

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setEditingId(null);
  };

  const currentSteps = editingId ? EDIT_STEPS : MODAL_STEPS;
  const offerType = form.offerType;
  const isEdit = !!editingId;

  /* ── Submit ── */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const p = new FormData();
      if (offerType === "service") {
        p.append("type", "service");
        p.append("name", form.serviceName.trim());
        p.append("description", form.serviceDesc.trim());
        p.append("category", form.serviceCategory);
        p.append("experience", form.serviceExp);
      } else {
        p.append("type", "rental");
        p.append("name", form.rentalName.trim());
        p.append("description", form.rentalDesc.trim());
        p.append("category", form.rentalCategory);
        p.append("price", form.rentalPrice);
      }
      form.imageFiles.forEach((f) => p.append("images", f));

      if (editingId) {
        await axiosInstance.put(`/service/updateservice/${editingId}`, p, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/service/addservice", p, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      showToast(
        editingId ? "Listing updated successfully." : "Listing is now live!",
      );
      closeModal();
      fetchServices();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400)
        showToast(err.response?.data?.message || "Check your inputs.", "error");
      else if (status === 401 || status === 403)
        showToast("Session expired. Log in again.", "error");
      else if (status >= 500)
        showToast("Server error. Try again shortly.", "error");
      else showToast("Could not save. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/service/deleteservice/${id}`);
      showToast("Listing deleted.");
      setServices((prev) => prev.filter((s) => (s.id || s._id) !== id));
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        showToast("Listing no longer exists.", "error");
        fetchServices();
      } else {
        showToast("Could not delete. Try again.", "error");
      }
    }
  };

  const canProceed = validateStep(modalStep, form, offerType, isEdit);
  const lastStep = currentSteps.length - 1;
  const isLastStep = modalStep === lastStep;
  const SIDEBAR_W = 228;

  /* ── Modal body ── */
  const renderModalBody = () => {
    // Edit mode: steps are Details / Photos / Review
    if (isEdit) {
      if (modalStep === 0) {
        return offerType === "service" ? (
          <ServiceDetailsStep
            data={form}
            onChange={handleChange}
            isGenerating={isGenerating}
            onGenerate={handleGenerateDesc}
          />
        ) : (
          <RentalDetailsStep
            data={form}
            onChange={handleChange}
            isGenerating={isGenerating}
            onGenerate={handleGenerateDesc}
          />
        );
      }
      if (modalStep === 1)
        return (
          <PhotosStep
            previews={form.imagePreviews}
            onAdd={addFiles}
            onRemove={removeFile}
            onClearAll={clearAllFiles}
            dragOver={dragOver}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
          />
        );
      if (modalStep === 2)
        return (
          <ReviewStep
            form={form}
            offerType={offerType}
            previews={form.imagePreviews}
          />
        );
    }

    // Add mode: steps are Offer Type / Details / Photos / Review
    if (modalStep === 0)
      return (
        <OfferTypeStep
          selected={form.offerType}
          onChange={(v) => setForm((p) => ({ ...p, offerType: v }))}
        />
      );
    if (modalStep === 1) {
      return offerType === "service" ? (
        <ServiceDetailsStep
          data={form}
          onChange={handleChange}
          isGenerating={isGenerating}
          onGenerate={handleGenerateDesc}
        />
      ) : (
        <RentalDetailsStep
          data={form}
          onChange={handleChange}
          isGenerating={isGenerating}
          onGenerate={handleGenerateDesc}
        />
      );
    }
    if (modalStep === 2)
      return (
        <PhotosStep
          previews={form.imagePreviews}
          onAdd={addFiles}
          onRemove={removeFile}
          onClearAll={clearAllFiles}
          dragOver={dragOver}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
        />
      );
    if (modalStep === 3)
      return (
        <ReviewStep
          form={form}
          offerType={offerType}
          previews={form.imagePreviews}
        />
      );
    return null;
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        fontFamily: "var(--font)",
      }}
    >
      <Toast toast={toast} />
      <Sidebar
        visible={sidebarOpen}
        navigate={navigate}
        currentPath={location.pathname || "/provider-services"}
      />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 35,
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          height: 62,
          zIndex: 20,
          background: "rgba(245,247,249,0.95)",
          backdropFilter: "blur(12px) saturate(180%)",
          borderBottom: "1px solid rgba(232,234,237,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: isMobile ? 16 : SIDEBAR_W + 36,
          paddingRight: 28,
          transition: "padding-left 0.28s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                cursor: "pointer",
                color: "#374151",
                display: "flex",
                padding: 8,
                borderRadius: 9,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Icon name={sidebarOpen ? "x" : "menu"} size={18} />
            </button>
          )}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#9CA3AF",
                marginBottom: 2,
              }}
            >
              <span>Provider</span>
              <Icon name="chevronRight" size={10} color="#9CA3AF" />
              <span style={{ color: "#374151", fontWeight: 600 }}>
                My Listings
              </span>
            </div>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#0D1117",
                margin: 0,
                letterSpacing: "-0.3px",
                fontFamily: "var(--font-display)",
              }}
            >
              My Listings
            </h1>
          </div>
        </div>
        {!loading && !pageError && services.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#374151",
              fontWeight: 600,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            {services.length} active
          </div>
        )}
      </header>

      {/* MAIN */}
      <main
        style={{
          paddingLeft: isMobile ? 18 : SIDEBAR_W + 36,
          paddingRight: isMobile ? 18 : 36,
          paddingTop: 32,
          paddingBottom: 80,
          transition: "padding-left 0.28s",
        }}
      >
        <div
          style={{
            marginBottom: 26,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: "#0D1117",
                margin: "0 0 5px",
                letterSpacing: "-0.5px",
                fontFamily: "var(--font-display)",
              }}
            >
              Manage Listings
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>
              {loading
                ? "Loading your listings…"
                : pageError
                  ? "Unable to load listings"
                  : `${services.length} active listing${services.length !== 1 ? "s" : ""} on your profile`}
            </p>
          </div>
          {!loading && !pageError && services.length > 0 && (
            <button
              onClick={handleOpenAdd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg,#16A34A,#22C55E)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.18s",
                boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                fontFamily: "var(--font)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(22,163,74,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(22,163,74,0.3)";
              }}
            >
              <Icon name="plus" size={15} color="#fff" />
              Add Listing
            </button>
          )}
        </div>

        {/* ERROR */}
        {pageError && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1.5px solid #FECACA",
              borderRadius: 18,
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "#FEE2E2",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Icon
                name={navigator.onLine ? "alertCircle" : "wifiOff"}
                size={24}
                color="#EF4444"
              />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#991B1B",
                margin: "0 0 8px",
                fontFamily: "var(--font-display)",
              }}
            >
              {navigator.onLine
                ? "Unable to Load Listings"
                : "No Internet Connection"}
            </h3>
            <p
              style={{
                fontSize: 13.5,
                color: "#B91C1C",
                margin: "0 0 24px",
                maxWidth: 380,
                lineHeight: 1.65,
              }}
            >
              {pageError}
            </p>
            <button
              onClick={fetchServices}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "#EF4444",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font)",
              }}
            >
              <Icon name="refreshCw" size={14} color="#fff" />
              Try Again
            </button>
          </div>
        )}

        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(285px, 1fr))",
              gap: 20,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} delay={i * 80} />
            ))}
          </div>
        )}

        {!loading && !pageError && services.length === 0 && (
          <EmptyState onAdd={handleOpenAdd} />
        )}

        {!loading && !pageError && services.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(285px, 1fr))",
              gap: 20,
            }}
          >
            {services.map((service, i) => (
              <ServiceCard
                key={service.id || service._id}
                service={service}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(8,12,18,0.65)",
            backdropFilter: "blur(8px)",
            animation: "backdropIn 0.2s ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 22,
              width: "100%",
              maxWidth: 560,
              maxHeight: "92dvh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 32px 72px -10px rgba(0,0,0,0.35)",
              overflow: "hidden",
              animation: "modalSlideUp 0.28s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "20px 22px 16px",
                borderBottom: "1px solid #F3F4F6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 3px",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#0D1117",
                    letterSpacing: "-0.3px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {editingId ? "Edit Listing" : "Add New Listing"}
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>
                  Step {modalStep + 1} of {currentSteps.length} —{" "}
                  {currentSteps[modalStep]}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "#F3F4F6",
                  border: "none",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6B7280",
                  transition: "all 0.14s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#E5E7EB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#F3F4F6")
                }
              >
                <Icon name="x" size={14} />
              </button>
            </div>

            {/* Step indicator */}
            <div
              style={{
                padding: "14px 22px 10px",
                borderBottom: "1px solid #F9FAFB",
              }}
            >
              <StepIndicator steps={currentSteps} current={modalStep} />
            </div>

            {/* Body */}
            <div style={{ overflowY: "auto", flex: 1, padding: "20px 22px" }}>
              {renderModalBody()}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 22px",
                borderTop: "1px solid #F3F4F6",
                background: "#FAFAFA",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                {modalStep > 0 && (
                  <button
                    onClick={() => setModalStep((s) => s - 1)}
                    style={{
                      background: "transparent",
                      color: "#374151",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 9,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.14s",
                      fontFamily: "var(--font)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    ← Back
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={closeModal}
                  style={{
                    background: "transparent",
                    color: "#374151",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 9,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.14s",
                    fontFamily: "var(--font)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F9FAFB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Cancel
                </button>
                {!isLastStep ? (
                  <button
                    onClick={() => setModalStep((s) => s + 1)}
                    disabled={!canProceed}
                    style={{
                      padding: "8px 22px",
                      borderRadius: 9,
                      border: "none",
                      background: canProceed ? "#0D1117" : "#E5E7EB",
                      color: canProceed ? "#fff" : "#9CA3AF",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: canProceed ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                      fontFamily: "var(--font)",
                    }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canProceed}
                    style={{
                      padding: "8px 24px",
                      borderRadius: 9,
                      border: "none",
                      background:
                        isSubmitting || !canProceed
                          ? "#86EFAC"
                          : "linear-gradient(135deg,#16A34A,#22C55E)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor:
                        isSubmitting || !canProceed ? "not-allowed" : "pointer",
                      boxShadow:
                        isSubmitting || !canProceed
                          ? "none"
                          : "0 4px 14px rgba(22,163,74,0.35)",
                      transition: "all 0.15s",
                      fontFamily: "var(--font)",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            border: "2px solid rgba(255,255,255,0.5)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />{" "}
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Icon name="zap" size={12} color="#fff" />{" "}
                        {editingId ? "Save Changes" : "Publish Now 🚀"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderServices;
