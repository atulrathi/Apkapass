import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../services/axiosinstance";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────
   Icon set — matched exactly to dashboard
───────────────────────────────────────────── */
const icons = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  alertCircle: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevronLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  mapPin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  fileText: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  camera: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
};

const navItems = [
  { icon: "home", label: "Dashboard", path: "/provider-profile" },
  { icon: "briefcase", label: "Services", path: "/provider-services" },
  { icon: "star", label: "Reviews", path: "/provider-reviews" },
  { icon: "settings", label: "Settings", path: "/provider-settings" },
];

const MAX_IMAGE_SIZE_MB = 5;

const SkeletonLine = ({ width, height = 14, borderRadius = 4, bg = "#E2E8F0", style }) => (
  <div style={{ width, height, borderRadius, background: bg, animation: "skeletonPulse 1.5s ease-in-out infinite", ...style }} />
);

const SkeletonField = () => (
  <div style={{ marginBottom: 24 }}>
    <SkeletonLine width={140} height={12} style={{ marginBottom: 8 }} />
    <SkeletonLine width="100%" height={44} borderRadius={10} bg="#F1F5F9" />
  </div>
);

const ProfessionalError = () => (
  <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "'Inter', sans-serif", padding: 20 }}>
    <div style={{ background: "#fff", border: "1px solid #EAECF0", borderRadius: 24, padding: "48px 40px", textAlign: "center", maxWidth: 460, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        {icons.alertCircle}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#101828", marginBottom: 12, marginTop: 0 }}>Unable to Load Profile</h2>
      <p style={{ fontSize: 15, color: "#475467", lineHeight: 1.6, margin: "0 0 32px" }}>
        We couldn't fetch your provider details from ApkaPass. Check your connection and try again.
      </p>
      <button onClick={() => window.location.reload()} style={{ padding: "14px 28px", background: "#101828", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
        Refresh Page
      </button>
    </div>
  </div>
);

const Badge = ({ ok, trueLabel = "Verified", falseLabel = "Unverified" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999,
    fontSize: 12, fontWeight: 600, background: ok ? "#ECFDF3" : "#FEF3F2", color: ok ? "#027A48" : "#B42318",
    border: `1px solid ${ok ? "#ABEFC6" : "#FECDCA"}`,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ok ? "#12B76A" : "#F04438", display: "inline-block" }} />
    {ok ? trueLabel : falseLabel}
  </span>
);

const ConfirmModal = ({ open, title, message, confirmLabel, loadingLabel, isLoading, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(16,24,40,0.5)", backdropFilter: "blur(2px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#101828" }}>{title}</h3>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#667085", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #D0D5DD", background: "#fff", color: "#344054", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
              background: "#101828", color: "#fff", fontWeight: 600, fontSize: 14,
              cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {isLoading && <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.6s linear infinite" }} />}
            {isLoading ? (loadingLabel || "Please wait…") : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* Lightweight toast — auto-dismisses, announced to screen readers */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 60,
        display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderRadius: 12,
        background: "#101828", color: "#fff", fontSize: 13.5, fontWeight: 600, maxWidth: "90vw",
        boxShadow: "0 12px 28px rgba(0,0,0,0.2)", animation: "toastIn 0.25s ease-out",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: isSuccess ? "#22C55E" : "#F87171", flexShrink: 0 }} />
      {toast.message}
    </div>
  );
};

const Sidebar = ({ visible, navigate, currentPath }) => (
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
          <div
            key={label}
            role="button"
            tabIndex={0}
            onClick={() => navigate(path)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(path); }}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
              background: isActive ? "#F0FDF4" : "transparent", color: isActive ? "#16A34A" : "#475467",
              fontWeight: isActive ? 600 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F9FAFB"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {icons[icon]} {label}
          </div>
        );
      })}
    </nav>
  </aside>
);

const ReadOnlyField = ({ label, value }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 8 }}>{label}</label>
    <div style={{
      width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #EAECF0",
      fontSize: 14, color: value ? "#101828" : "#94A3B8", background: "#F8FAFC",
      fontFamily: "inherit", minHeight: 44, display: "flex", alignItems: "center", wordBreak: "break-word"
    }}>
      {value || "Not Provided"}
    </div>
  </div>
);

const DocumentTile = ({ title, imgUrl }) => (
  <div style={{ border: "1px solid #EAECF0", borderRadius: 12, padding: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>
        {icons.fileText}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{title}</div>
        <div style={{ fontSize: 11, color: imgUrl ? "#16A34A" : "#94A3B8", fontWeight: 500 }}>
          {imgUrl ? "Uploaded & Recorded" : "Missing Document"}
        </div>
      </div>
    </div>
    {imgUrl && (
      <a
        href={imgUrl}
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "none", padding: "6px 10px", borderRadius: 6, background: "#EFF6FF" }}
      >
        View
      </a>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   Main Settings Page
───────────────────────────────────────────── */
export default function ProviderSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [confirmModal, setConfirmModal] = useState(null); // null | "logout" | "removePhoto"
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/provider/getproviderdetails");
        const doc = response?.data?.data || response?.data || {};
        console.log("Fetched provider data:", doc);

        // Extract phone safely whether it was populated via userId lookup or directly injected
        const phoneData = doc?.userId?.phone || doc?.phone || "";

        setProvider({
          name: doc?.name || "",
          profileImage: doc?.profileImage || "",
          phone: phoneData,
          address: doc?.Address || "",
          services: Array.isArray(doc?.services) ? doc.services : [],
          locationAddress: doc?.location?.address || "",
          coordinates: doc?.location?.coordinates || [],
          adharImage: doc?.AdharcardImage || "",
          panImage: doc?.PancardImage || "",
          isApproved: Boolean(doc?.isApproved),
          isVerified: Boolean(doc?.isVerified),
          duty: Boolean(doc?.duty),
          rating: doc?.rating || 0,
          createdAt: doc?.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null
        });
      } catch (err) {
        console.error("Failed to load professional profile");
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (type, message) => setToast({ type, message });

  const handleLogout = async () => {
    setIsProcessingAction(true);
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed locally");
    } finally {
      setIsProcessingAction(false);
      setConfirmModal(null);
      navigate("/");
    }
  };

  /* ── Profile photo: fake upload, ready to be swapped for the real endpoint ── */
  const fakeUploadProfileImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read the selected file"));
      reader.onload = () => {
        // Simulated network round-trip. Swap this whole function body for the
        // real request below once the backend endpoint is live.
        setTimeout(() => resolve(reader.result), 1300);
      };
      reader.readAsDataURL(file);
    });

  const handleAvatarButtonClick = () => {
    if (isUploadingPhoto) return;
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so picking the same file again still fires onChange
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please choose an image file (JPG, PNG, or WEBP).");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      showToast("error", `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setIsUploadingPhoto(true);
    try {

     
         const formData = new FormData();
         formData.append("profileImage", file);
         const response = await axiosInstance.post(
           "/provider/update-profile-image",
           formData,
           { headers: { "Content-Type": "multipart/form-data" } }
         );
         const imageUrl = response?.data?.data?.profileImage || response?.data?.profileImage;
      

      setProvider((prev) => ({ ...prev, profileImage: imageUrl }));
      showToast("success", "Profile photo updated.");
    } catch (err) {
      console.error("Photo upload failed:", err);
      showToast("error", "Couldn't update your photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const fakeRemoveProfileImage = () => new Promise((resolve) => setTimeout(resolve, 700));

  const handleRemovePhotoConfirmed = async () => {
    setIsRemovingPhoto(true);
    try {
      await fakeRemoveProfileImage();

      /* ── Real backend call — uncomment when the endpoint is ready ──
         await axiosInstance.post("/provider/remove-profile-image");
      */

      setProvider((prev) => ({ ...prev, profileImage: "" }));
      showToast("success", "Profile photo removed.");
    } catch (err) {
      showToast("error", "Couldn't remove your photo. Please try again.");
    } finally {
      setIsRemovingPhoto(false);
      setConfirmModal(null);
    }
  };

  if (hasError) return <ProfessionalError />;

  const initials = provider?.name
    ? provider.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const confirmContent = {
    logout: {
      title: "Log out of ApkaPass?",
      message: "You will be redirected to the sign-in portal.",
      confirmLabel: "Log Out",
      loadingLabel: "Logging out…",
      isLoading: isProcessingAction,
      onConfirm: handleLogout,
    },
    removePhoto: {
      title: "Remove profile photo?",
      message: "Your profile will show your initials instead.",
      confirmLabel: "Remove Photo",
      loadingLabel: "Removing…",
      isLoading: isRemovingPhoto,
      onConfirm: handleRemovePhotoConfirmed,
    },
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F9FAFB", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; overflow-x: hidden; }
        @keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .ap-btn:focus-visible, .ap-link:focus-visible { outline: 2px solid #16A34A; outline-offset: 2px; }
        .ap-camera-btn:hover { background: #15803D; }
        .ap-camera-btn:disabled { background: #94A3B8; cursor: not-allowed; }
      `}</style>

      <Sidebar visible={sidebarOpen} navigate={navigate} currentPath={location.pathname || "/provider-settings"} />

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
            <button className="ap-btn" onClick={() => setSidebarOpen((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#344054", display: "flex", padding: 4 }}>
              {sidebarOpen ? icons.close : icons.menu}
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#101828", margin: 0 }}>Profile Settings</h1>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        paddingLeft: isMobile ? 16 : 296, paddingRight: isMobile ? 16 : 36, paddingTop: 32, paddingBottom: 60,
        transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", maxWidth: 1100, margin: "0 auto",
      }}>

        {/* ── PROFILE BANNER ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", marginBottom: 24, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {isLoading ? (
            <>
              <SkeletonLine width={72} height={72} borderRadius="50%" bg="#F1F5F9" />
              <div style={{ flex: 1, minWidth: 200 }}>
                <SkeletonLine width={180} height={22} style={{ marginBottom: 10 }} />
                <SkeletonLine width={240} height={14} bg="#F1F5F9" />
              </div>
            </>
          ) : (
            <>
              {/* Avatar + photo upload control */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                    background: provider?.profileImage ? "#F1F5F9" : "#101828",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, fontWeight: 700, opacity: isUploadingPhoto ? 0.5 : 1, transition: "opacity 0.2s",
                  }}>
                    {provider?.profileImage ? (
                      <img
                        src={provider.profileImage}
                        alt={`${provider?.name || "Provider"}'s profile photo`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (initials || icons.user)}
                  </div>

                  {isUploadingPhoto && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid rgba(16,24,40,0.15)", borderTopColor: "#101828", animation: "spin 0.7s linear infinite" }} />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelected}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    className="ap-btn ap-camera-btn"
                    onClick={handleAvatarButtonClick}
                    disabled={isUploadingPhoto}
                    aria-label={provider?.profileImage ? "Change profile photo" : "Add profile photo"}
                    style={{
                      position: "absolute", bottom: -2, right: -2, width: 28, height: 28, borderRadius: "50%",
                      background: "#16A34A", border: "2px solid #fff", color: "#fff", display: "flex",
                      alignItems: "center", justifyContent: "center", cursor: isUploadingPhoto ? "not-allowed" : "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.15)", transition: "background 0.15s",
                    }}
                  >
                    {icons.camera}
                  </button>
                </div>

                {provider?.profileImage && !isUploadingPhoto && (
                  <button
                    type="button"
                    className="ap-link"
                    onClick={() => setConfirmModal("removePhoto")}
                    style={{ background: "none", border: "none", padding: 0, fontSize: 11.5, fontWeight: 600, color: "#94A3B8", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#101828" }}>{provider?.name || "Provider Account"}</h2>
                  <span style={{ fontSize: 12, fontWeight: 600, background: provider?.duty ? "#DCFCE7" : "#F1F5F9", color: provider?.duty ? "#15803D" : "#64748B", padding: "3px 10px", borderRadius: 999 }}>
                    {provider?.duty ? "On Duty" : "Off Duty"}
                  </span>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#667085" }}>
                  ★ {provider?.rating ? Number(provider.rating).toFixed(1) : "No Ratings"} · {provider?.createdAt ? `Registered ${provider.createdAt}` : "Active Partner"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <Badge ok={provider?.isVerified} trueLabel="KYC Verified" falseLabel="KYC Unverified" />
                  <Badge ok={provider?.isApproved} trueLabel="Marketplace Approved" falseLabel="Pending Approval" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── READ ONLY DATA GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 24, alignItems: "start" }}>

          {/* LEFT COLUMN: Database Records */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#334155" }}>{icons.user}</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#101828", margin: 0 }}>Registered Information</h2>
              </div>

              {isLoading ? (
                <><SkeletonField /><SkeletonField /><SkeletonField /><SkeletonField /></>
              ) : (
                <>
                  <ReadOnlyField label="Provider Name" value={provider?.name} />
                  <ReadOnlyField label="Phone Number" value={provider?.phone} />
                  <ReadOnlyField label="Personal Address" value={provider?.address} />

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 8 }}>Offered Services</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {provider?.services?.length > 0 ? (
                        provider.services.map((srv, index) => (
                          <span key={index} style={{ fontSize: 13, fontWeight: 600, background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", padding: "6px 14px", borderRadius: 8 }}>
                            {srv}
                          </span>
                        ))
                      ) : (
                        <div style={{ fontSize: 14, color: "#94A3B8", fontStyle: "italic", padding: "8px 0" }}>No services assigned in database</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>{icons.mapPin}</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#101828", margin: 0 }}>Geo-Location Record</h2>
              </div>

              {isLoading ? (
                <><SkeletonField /><SkeletonField /></>
              ) : (
                <>
                  <ReadOnlyField label="Service Dispatch Address" value={provider?.locationAddress} />
                  <ReadOnlyField
                    label="Geo-Coordinates (Lng, Lat)"
                    value={provider?.coordinates?.length === 2 ? `${provider.coordinates[0]}, ${provider.coordinates[1]}` : null}
                  />
                </>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Documents & Session */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#101828", margin: "0 0 16px" }}>KYC Documents</h3>

              {isLoading ? (
                <><SkeletonField /><SkeletonField /></>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <DocumentTile title="Aadhaar Card" imgUrl={provider?.adharImage} />
                  <DocumentTile title="PAN Card" imgUrl={provider?.panImage} />
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#101828", margin: "0 0 8px" }}>Account Session</h3>
              <p style={{ fontSize: 13, color: "#667085", marginBottom: 20, lineHeight: 1.5 }}>
                End your active authentication token on this device.
              </p>

              <button
                className="ap-btn"
                onClick={() => setConfirmModal("logout")}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 10, border: "1px solid #FECACA",
                  background: "#FEF2F2", color: "#DC2626", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s"
                }}
              >
                {icons.logout} Log Out
              </button>
            </div>

          </div>

        </div>
      </main>

      <ConfirmModal
        open={!!confirmModal}
        {...(confirmModal ? confirmContent[confirmModal] : {})}
        onCancel={() => setConfirmModal(null)}
      />

      <Toast toast={toast} />
    </div>
  );
}