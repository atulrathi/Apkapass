import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */
const icons = {
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),

  close: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),

  briefcase: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),

  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),

  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),

  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   Sidebar Navigation
───────────────────────────────────────────── */
const navItems = [
  { icon: "home", label: "Dashboard", active: true },
  { icon: "briefcase", label: "Services" },
  { icon: "calendar", label: "Bookings" },
  { icon: "chart", label: "Analytics" },
  { icon: "settings", label: "Settings" },
];

/* ─────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────── */
const Sidebar = ({ visible }) => {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #EAECF0",
        zIndex: 100,
        transform: visible ? "translateX(0)" : "translateX(-100%)",
        transition: "0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px",
          borderBottom: "1px solid #F2F4F7",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#101828",
          }}
        >
          Apka<span style={{ color: "#16A34A" }}>Pass</span>
        </h2>
      </div>

      {/* Nav Links */}
      <nav style={{ padding: 12, flex: 1 }}>
        {navItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              marginBottom: 4,
              borderRadius: 12,
              cursor: "pointer",
              background: item.active ? "#F0FDF4" : "transparent",
              color: item.active ? "#16A34A" : "#667085",
              fontWeight: item.active ? 600 : 500,
              transition: "0.2s",
            }}
          >
            {icons[item.icon]}
            {item.label}
          </div>
        ))}
      </nav>

      {/* Bottom Status */}
      <div
        style={{
          margin: 12,
          padding: 16,
          borderRadius: 14,
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#15803D",
          }}
        >
          You're Online
        </p>

        <p
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#4ADE80",
          }}
        >
          Receiving customer leads
        </p>
      </div>
    </aside>
  );
};

/* ─────────────────────────────────────────────
   Main Navbar Layout
───────────────────────────────────────────── */
export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar visible={sidebarOpen} />

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 50,
          }}
        />
      )}

     
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#344054",
              }}
            >
              {sidebarOpen ? icons.close : icons.menu}
            </button>
          )}

          
        </div>

        
        
      
    </div>
  );
}