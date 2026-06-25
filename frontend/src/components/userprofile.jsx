import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, CalendarClock, Settings, LogOut, ChevronRight 
} from 'lucide-react';
import axiosInstance from "../services/axiosinstance";
import { useNavigate } from 'react-router-dom';

export default function UserProfilePanel({ isOpen, onClose }) {
  // Mock user data - swap with your actual auth state
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D0D0D&color=fff",
  };

  const navigate = useNavigate();

  // Streamlined for a startup MVP - only the absolute essentials
  const menuOptions = [
    { icon: User, label: "Personal Information", desc: "Update your contact details" },
    { icon: CalendarClock, label: "Service Bookings", desc: "View your active & past requests" },
    { icon: Settings, label: "Preferences", desc: "Account security & settings" },
  ];

  const logout = async ()=>{
    try {
     let res = await axiosInstance.post('/auth/logout');
     let responseData = res.data;
     if(responseData.success){
      navigate('/');
     }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

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
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Minimalist Header */}
            <div className="pt-8 pb-6 px-6 border-b border-gray-100 flex justify-between items-start bg-white">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close panel"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable Core Content */}
            <div className="flex-1 overflow-y-auto bg-white p-4">
              <div className="space-y-1">
                {menuOptions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={item.label}
                      className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Clean Footer with Logout */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                <LogOut size={16} strokeWidth={2} />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}