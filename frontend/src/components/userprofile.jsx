import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, CalendarDays, MapPin, CreditCard, 
  Settings, LogOut, ChevronRight, Camera, ShieldCheck, Bell 
} from 'lucide-react';

export default function UserProfilePanel({ isOpen, onClose }) {
  // Mock user data - in production, pass this via props or global state/context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    joinDate: "Member since Mar 2026",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=fff&color=2563eb",
  };

  const menuOptions = [
    { icon: User, label: "Personal Information", desc: "Update your details & phone" },
    { icon: CalendarDays, label: "My Bookings", desc: "Past & upcoming services" },
    { icon: MapPin, label: "Saved Addresses", desc: "Manage your locations" },
    { icon: CreditCard, label: "Payment Methods", desc: "Cards & saved wallets" },
    { icon: Bell, label: "Notifications", desc: "Alerts & promotional emails" },
    { icon: Settings, label: "Account Settings", desc: "Privacy & security options" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%', boxShadow: '-20px 0 40px rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-20px 0 40px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '-20px 0 40px rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header / Cover Area */}
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 pt-12 pb-6 px-6">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              
              <div className="flex items-end gap-4 mt-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-xl shadow-md hover:scale-105 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                
                <div className="pb-1 text-white">
                  <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    {user.name}
                    <ShieldCheck size={18} className="text-blue-200" />
                  </h2>
                  <p className="text-blue-100 text-sm font-medium opacity-90">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 space-y-6">
              
              {/* Quick Stats Widget */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex justify-around shadow-sm">
                <div className="text-center">
                  <span className="block text-2xl font-black text-gray-900">12</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bookings</span>
                </div>
                <div className="w-px bg-gray-100"></div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-gray-900">2</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Addresses</span>
                </div>
              </div>

              {/* Menu Options */}
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                {menuOptions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={item.label}
                      className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors group ${
                        index !== menuOptions.length - 1 ? 'border-b border-gray-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                      <div className="ml-4 text-left flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
              <button className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-xl font-bold transition-colors active:scale-95">
                <LogOut size={18} strokeWidth={2.5} />
                Sign Out
              </button>
              <p className="text-center text-xs text-gray-400 font-medium mt-4">
                {user.joinDate}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}