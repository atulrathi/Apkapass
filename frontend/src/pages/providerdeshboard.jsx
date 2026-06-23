import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosinstance";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────
   Professional SVG Icon Set
───────────────────────────────────────────── */
const icons = {
  eye: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.17h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.92z"/></svg>,
  whatsapp: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  trending: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  wifi: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  lightbulb: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.5.8 2.8 2.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>,
  alertCircle: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
};

/* ─────────────────────────────────────────────
   Sidebar navigation items
───────────────────────────────────────────── */
const navItems = [
  { icon: "home", label: "Dashboard", path: "/provider-profile" },
  { icon: "briefcase", label: "Services", path: "/provider-services" },
  { icon: "star", label: "Reviews", path: "/provider-reviews" },
  { icon: "settings", label: "Settings", path: "/provider-settings" },
];

/* ─────────────────────────────────────────────
   Skeleton Components
───────────────────────────────────────────── */
const SkeletonLine = ({ width, height = 14, borderRadius = 4, bg = "#E2E8F0", style }) => (
  <div style={{ width, height, borderRadius, background: bg, animation: "skeletonPulse 1.5s ease-in-out infinite", ...style }} />
);

const SkeletonMetricCard = () => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "22px 20px", border: "1px solid #EAECF0", display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
    <SkeletonLine width={44} height={44} borderRadius={12} bg="#F1F5F9" />
    <div style={{ marginTop: "auto" }}>
      <SkeletonLine width="50%" height={12} style={{ marginBottom: 12 }} />
      <SkeletonLine width="30%" height={32} style={{ marginBottom: 16 }} />
      <SkeletonLine width="80%" height={10} />
    </div>
  </div>
);

const SkeletonLowerCard = () => (
  <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #EAECF0", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <SkeletonLine width={36} height={36} borderRadius={10} bg="#F1F5F9" />
      <SkeletonLine width={140} height={20} />
    </div>
    <SkeletonLine width="90%" height={12} style={{ marginBottom: 32 }} />
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < 3 ? "1px solid #F2F4F7" : "none" }}>
        <SkeletonLine width={40} height={40} borderRadius={10} bg="#F1F5F9" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <SkeletonLine width="40%" height={14} />
          <SkeletonLine width="80%" height={12} bg="#F1F5F9" />
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Professional Error Component
───────────────────────────────────────────── */
const ProfessionalError = () => (
  <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "'Inter', sans-serif", padding: 20 }}>
    <div style={{ background: "#fff", border: "1px solid #EAECF0", borderRadius: 24, padding: "48px 40px", textAlign: "center", maxWidth: 460, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        {icons.alertCircle}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#101828", marginBottom: 12, marginTop: 0 }}>Unable to Load Dashboard</h2>
      <p style={{ fontSize: 15, color: "#475467", lineHeight: 1.6, margin: "0 0 32px" }}>
        We encountered a temporary issue while connecting to the ApkaPass network. Please check your connection and try again.
      </p>
      <button onClick={() => window.location.reload()} style={{ padding: "14px 28px", background: "#101828", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
        Refresh Dashboard
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Metric card (Handles Empty States)
───────────────────────────────────────────── */
const MetricCard = ({ icon, label, value, sub, accent, explanation, increaseTip }) => {
  const hasData = value && value > 0;

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "22px 20px", border: "1px solid #EAECF0",
      display: "flex", flexDirection: "column", gap: 14, transition: "box-shadow 0.2s, transform 0.2s",
      cursor: "default", height: "100%",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
          {icons[icon]}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "#667085", fontWeight: 600, letterSpacing: "0.02em" }}>{label}</p>
          <h2 style={{ margin: "6px 0 4px", fontSize: 32, color: "#101828", fontWeight: 800, lineHeight: 1 }}>{value ?? 0}</h2>
        </div>

        {hasData ? (
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#667085" }}>{sub}</p>
        ) : (
          <div style={{ marginTop: 16, background: "#F9FAFB", padding: 12, borderRadius: 10, border: "1px dashed #D0D5DD" }}>
            <p style={{ display: "flex", gap: 6, fontSize: 12, color: "#344054", margin: "0 0 8px", lineHeight: 1.4 }}><span style={{ color: "#667085", marginTop: 2 }}>{icons.info}</span><span><strong>What is this?</strong> <br/> {explanation}</span></p>
            <p style={{ display: "flex", gap: 6, fontSize: 12, color: "#15803D", margin: 0, lineHeight: 1.4 }}><span style={{ marginTop: 2 }}>{icons.lightbulb}</span><span><strong>How to improve:</strong> <br/> {increaseTip}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Status badge
───────────────────────────────────────────── */
const Badge = ({ ok, trueLabel = "Active", falseLabel = "Inactive" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, 
    fontSize: 12, fontWeight: 600, background: ok ? "#ECFDF3" : "#FEF3F2", color: ok ? "#027A48" : "#B42318",
    border: `1px solid ${ok ? '#ABEFC6' : '#FECDCA'}`
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ok ? "#12B76A" : "#F04438", display: "inline-block" }} />
    {ok ? trueLabel : falseLabel}
  </span>
);

/* ─────────────────────────────────────────────
   Tip card
───────────────────────────────────────────── */
const Tip = ({ icon, title, desc }) => (
  <div style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #F2F4F7" }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F9FAFB", border: "1px solid #EAECF0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#344054" }}>
      {icons[icon]}
    </div>
    <div>
      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#101828" }}>{title}</p>
      <p style={{ margin: 0, fontSize: 13, color: "#667085", lineHeight: 1.55 }}>{desc}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────── */
const Sidebar = ({ visible, navigate, currentPath, provider, isLoading }) => {
  const initials = provider?.name 
    ? provider.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "";

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, width: 260, height: "100dvh", background: "#fff", 
      borderRight: "1px solid #EAECF0", zIndex: 30, display: "flex", flexDirection: "column",
      transform: visible ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div style={{ padding: "24px", borderBottom: "1px solid #F2F4F7" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#101828", letterSpacing: "-0.5px" }}>
          Apka<span style={{ color: "#16A34A" }}>Pass</span>
        </h2>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
        {navItems.map(({ icon, label, path }) => {
          const isActive = currentPath === path;
          return (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
              background: isActive ? "#F0FDF4" : "transparent", color: isActive ? "#16A34A" : "#475467",
              fontWeight: isActive ? 600 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
            }}
              onClick={() => navigate(path)}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {icons[icon]} {label}
            </div>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div style={{ margin: "0 16px 16px", padding: "16px", borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0", cursor: "pointer" }} onClick={() => !isLoading && navigate("/provider-settings")}>
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SkeletonLine width={42} height={42} borderRadius="50%" />
            <div style={{ flex: 1 }}>
              <SkeletonLine width="80%" height={14} style={{ marginBottom: 6 }} />
              <SkeletonLine width="50%" height={10} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#16A34A,#4ADE80)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0, boxShadow: "0 2px 6px rgba(22,163,74,0.2)" }}>
              {initials}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{provider?.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 500, color: "#64748B" }}>{provider?.plan || "Free"} Plan</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
const ApkaPassDashboard = ({ provider, stats, isLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // States for Duty Toggle
  const [isDutyOn, setIsDutyOn] = useState(false); 
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);

  useEffect(() => {
    if (provider && provider.isDutyOn !== undefined) {
      setIsDutyOn(provider.isDutyOn);
    }
  }, [provider]);

  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleDutyToggle = async () => {
    if (isLoading || isTogglingDuty) return;
    
    const newStatus = !isDutyOn;
    setIsTogglingDuty(true);
    
    try {
      // Send real update to your specific endpoint
      await axiosInstance.post("/toggle/dutytoggle", { isDutyOn: newStatus });
      
      // Update the visual toggle ONLY if the API call succeeds
      setIsDutyOn(newStatus);
    } catch (err) {
      console.error("Failed to update duty status securely.");
      // The toggle stays in its original position since the request failed
    } finally {
      setIsTogglingDuty(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F9FAFB", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; overflow-x: hidden; }
        @keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <Sidebar visible={sidebarOpen} navigate={navigate} currentPath={location.pathname || "/provider-profile"} provider={provider} isLoading={isLoading} />

      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 25, backdropFilter: "blur(2px)" }} />
      )}

      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, height: 70, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)", 
        borderBottom: "1px solid #EAECF0", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingLeft: isMobile ? 16 : 296, paddingRight: 24, transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#344054", display: "flex", padding: 4 }}>
              {sidebarOpen ? icons.close : icons.menu}
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#101828", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: "#667085", marginTop: 2, margin: 0 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Real Duty Toggle synced with API and Loading State */}
        {isLoading ? (
          <SkeletonLine width={120} height={36} borderRadius={999} />
        ) : (
          <div style={{ 
            display: "flex", alignItems: "center", gap: 12, background: isDutyOn ? "#F0FDF4" : "#F1F5F9", 
            padding: "6px 14px", borderRadius: 999, border: `1px solid ${isDutyOn ? '#BBF7D0' : '#E2E8F0'}`, transition: "all 0.3s"
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: isDutyOn ? "#15803D" : "#475467", display: "flex", alignItems: "center", gap: 6 }}>
              {isDutyOn && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />}
              {isDutyOn ? "On Duty" : "Off Duty"}
            </span>
            
            <button 
              onClick={handleDutyToggle} 
              disabled={isTogglingDuty}
              style={{
                width: 44, height: 24, borderRadius: 12, background: isDutyOn ? '#16A34A' : '#CBD5E1',
                position: 'relative', border: 'none', cursor: isTogglingDuty ? 'not-allowed' : 'pointer', 
                transition: 'background 0.3s', padding: 0, opacity: isTogglingDuty ? 0.7 : 1
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, 
                left: isDutyOn ? 22 : 2, transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {/* Micro-spinner visible only during API call */}
                {isTogglingDuty && (
                  <div style={{ 
                    width: 12, height: 12, borderRadius: '50%', border: '2px solid #E2E8F0', 
                    borderTopColor: '#16A34A', animation: 'spin 0.6s linear infinite' 
                  }} />
                )}
              </div>
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        paddingLeft: isMobile ? 16 : 296, paddingRight: isMobile ? 16 : 36, paddingTop: 32, paddingBottom: 60, 
        transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", maxWidth: 1600, margin: "0 auto"
      }}>
        
        {/* ── HERO BANNER ── */}
        {isLoading ? (
          <div style={{ background: "#1E293B", borderRadius: 24, padding: isMobile ? "28px 24px" : "40px 48px", marginBottom: 32, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
            <div>
              <SkeletonLine width={140} height={14} bg="#334155" style={{ marginBottom: 16 }} />
              <SkeletonLine width={280} height={36} bg="#334155" style={{ marginBottom: 20 }} />
              <div style={{ display: "flex", gap: 12 }}>
                <SkeletonLine width={120} height={26} borderRadius={999} bg="#334155" />
                <SkeletonLine width={140} height={26} borderRadius={999} bg="#334155" />
              </div>
            </div>
            <SkeletonLine width={180} height={100} borderRadius={20} bg="#334155" />
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #064E3B 100%)", borderRadius: 24, padding: isMobile ? "28px 24px" : "40px 48px", 
            marginBottom: 32, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, position: "relative", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}>
            <div style={{ position: "absolute", right: -40, top: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 120, bottom: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none" }} />

            <div style={{ zIndex: 1 }}>
              <p style={{ color: "#6EE7B7", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Welcome back 👋</p>
              <h1 style={{ color: "#fff", fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 16 }}>{provider?.name || "Service Provider"}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Badge ok={provider?.isVerified} trueLabel="✓ Verified Identity" falseLabel="Identity Not Verified" />
                <Badge ok={provider?.isApproved} trueLabel="✓ Approved by ApkaPass" falseLabel="Pending Approval" />
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", padding: "24px 36px", borderRadius: 20, textAlign: "center", zIndex: 1 }}>
              <p style={{ color: "#CBD5E1", fontSize: 13, fontWeight: 600, marginBottom: 8, letterSpacing: "0.02em" }}>Active Services</p>
              <h2 style={{ color: "#fff", fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{stats?.activeServices ?? 0}</h2>
            </div>
          </div>
        )}

        {/* ── METRICS GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
          {isLoading ? (
            <>
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
            </>
          ) : (
            <>
              <MetricCard icon="eye" label="Profile Views" value={stats?.views} sub="Total people who viewed your page." accent="#7C3AED" explanation="The number of users who clicked on your profile while searching for local services." increaseTip="Add a clear profile picture and write a detailed bio to stand out in search results." />
              <MetricCard icon="phone" label="Phone Leads" value={stats?.calls} sub="Customers who tapped your phone number." accent="#0284C7" explanation="How many customers pressed the 'Call Now' button to speak with you directly." increaseTip="Ensure your service descriptions explicitly mention you are available for urgent calls." />
              <MetricCard icon="whatsapp" label="WhatsApp Clicks" value={stats?.whatsappClicks} sub="Users who opened a chat with you." accent="#16A34A" explanation="The amount of users who decided to message you directly via WhatsApp." increaseTip="Mention 'Message me on WhatsApp for a quick quote!' in your service details." />
              <MetricCard icon="calendar" label="Monthly Leads" value={stats?.leadsThisMonth} sub="Total inquiries generated this month." accent="#D97706" explanation="A summary of all your combined interactions (views, calls, chats) in the last 30 days." increaseTip="Ask your satisfied customers to leave a 5-star review. Higher ratings drive up to 3x more monthly leads!" />
            </>
          )}
        </div>

        {/* ── LOWER GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr", gap: 24 }}>
          {isLoading ? (
            <>
              <SkeletonLowerCard />
              <SkeletonLowerCard />
            </>
          ) : (
            <>
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A" }}>{icons.trending}</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#101828", margin: 0 }}>Growth Tips</h2>
                </div>
                <p style={{ fontSize: 14, color: "#667085", marginBottom: 24 }}>Implement these quick wins to improve your conversion rate and get more bookings.</p>
                <Tip icon="zap" title="Respond Within 5 Minutes" desc="Customers contact multiple providers. The one who replies first wins the job 80% of the time." />
                <Tip icon="image" title="Upload Real Work Photos" desc="Don't use stock images. Authentic pictures of your previous work build massive trust with local clients." />
                <Tip icon="star" title="Collect Customer Reviews" desc="Profiles with 3 or more positive reviews rank significantly higher in the ApkaPass search algorithm." />
              </div>

              <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>{icons.shield}</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#101828", margin: 0 }}>Account Overview</h2>
                </div>
                <p style={{ fontSize: 14, color: "#667085", marginBottom: 24 }}>Your current membership details and account status.</p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Current Subscription", value: provider?.plan || "Free Tier", valueColor: "#101828", sub: "Upgrade to Premium →" },
                    { label: "Identity Verification", ok: provider?.isVerified, trueLabel: "Verified", falseLabel: "Verification Needed" },
                    { label: "Profile Approval", ok: provider?.isApproved, trueLabel: "Live on Platform", falseLabel: "Under Review" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: i < 2 ? "1px solid #F2F4F7" : "none" }}>
                      <p style={{ margin: 0, fontSize: 14, color: "#475467", fontWeight: 500 }}>{row.label}</p>
                      {row.value !== undefined ? (
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: row.valueColor }}>{row.value}</p>
                          {row.sub && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#16A34A", fontWeight: 600, cursor: "pointer" }}>{row.sub}</p>}
                        </div>
                      ) : (
                        <Badge ok={row.ok} trueLabel={row.trueLabel} falseLabel={row.falseLabel} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────
   App root with data fetching
───────────────────────────────────────────── */
export default function App() {
  const [provider, setProvider] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/provider/getproviderdetails");
        const doc = response?.data?.data || response?.data || {};

        setProvider({
          name: doc.name,
          plan: doc.plan,
          isVerified: doc.isVerified,
          isApproved: doc.isApproved,
          // Extract the REAL duty data from the backend
          isDutyOn: Boolean(doc.duty), 
        });


        setStats({
          views: doc.views, 
          calls: doc.calls, 
          whatsappClicks: doc.whatsappClicks,
          leadsThisMonth: doc.leadsThisMonth, 
          activeServices: doc.activeServices, 
        });
      } catch (err) {
        console.error("Internal Request Failed"); 
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (hasError) return <ProfessionalError />;

  return <ApkaPassDashboard provider={provider} stats={stats} isLoading={loading} />;
}