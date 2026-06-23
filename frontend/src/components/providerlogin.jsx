import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiArrowLeft, HiOutlineUser } from 'react-icons/hi2';
import { Zap, MapPin, Loader2, ArrowRight, ShieldCheck, Navigation } from 'lucide-react';
import axiosinstance from '../services/axiosinstance';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Area' },
  { id: 3, label: 'Verify' }
];

export default function ProviderLogin() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [locationState, setLocationState] = useState({
    status: 'idle', // idle, fetching, granted, denied
    coords: null,
    address: '',
  });
  
  const navigate = useNavigate();
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // --- Validation ---
  const isStep1Valid = formData.name.trim().length > 0 && formData.phone.length === 10;
  const isStep2Valid = locationState.status === 'granted';

  // --- Handlers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNextToLocation = () => {
    if (isStep1Valid) setStep(2);
  };

  const handleRequestOtp = async () => {
    if (!isStep2Valid) return;
    
    setIsLoading(true);
    try {
      await axiosinstance.post('/auth/send-otp', { 
        name: formData.name.trim(), 
        phone: formData.phone 
      });
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
    if (e.key === 'Enter') {
      handleVerifyOtp(e);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otp.join('').length !== 6) return;

    setIsLoading(true);
    try {
      // 1. Verify OTP
      await axiosinstance.post('/provider/verify-provider-otp', {
        phone: formData.phone,
        otp: otp.join(''),
        name: formData.name.trim(),
      });

      // 2. Automatically update profile with location upon successful verification
      const updateRes = await axiosinstance.post('/provider/update-provider', {
        name: formData.name.trim(),
        services: [], // Intentionally empty per requirements
        location: { type: 'Point', coordinates: locationState.coords }
      });

      if (updateRes.status === 200) {
        setStep(4); // Triggers success screen
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP or network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocation = () => {
    setLocationState((p) => ({ ...p, status: 'fetching' }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude, latitude } = pos.coords;
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          const city = data.city || data.town || data.suburb || "Local Area";
          const state = data.state || "";
          setLocationState({ 
            status: 'granted', 
            coords: [longitude, latitude], 
            address: `${city}${state ? `, ${state}` : ""}` 
          });
        } catch (err) {
          setLocationState({ status: 'granted', coords: [longitude, latitude], address: "Location Detected Successfully" });
        }
      },
      () => setLocationState((p) => ({ ...p, status: 'denied' }))
    );
  };

  const handleGoToDashboard = () => navigate('/provider-profile');

  // --- Keyboard Navigation ---
  const handleStep1KeyDown = (e) => {
    if (e.key === 'Enter' && isStep1Valid) {
      e.preventDefault();
      handleNextToLocation();
    }
  };

  const handleStep2KeyDown = (e) => {
    if (e.key === 'Enter' && isStep2Valid) {
      e.preventDefault();
      handleRequestOtp();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto antialiased">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* --- Header --- */}
        <div className="bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap size={18} className="text-white" fill="currentColor" />
              </div>
              <h2 className="text-white font-bold text-lg tracking-tight leading-none">ApkaPass</h2>
            </div>
            <ShieldCheck size={20} className="text-slate-500" />
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-between relative px-6">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2 ${
                  step >= s.id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  {step > s.id ? <HiCheckCircle size={16} /> : s.id}
                </div>
                <span className={`text-[9px] mt-2 font-bold uppercase tracking-wider transition-colors ${step >= s.id ? 'text-white' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
            ))}
            <div className="absolute top-3.5 left-10 right-10 h-[1px] bg-slate-800 -z-0" />
            <motion.div 
              className="absolute top-3.5 left-10 h-[1px] bg-indigo-500 -z-0"
              initial={false}
              animate={{ width: `${Math.min(((step - 1) / (STEPS.length - 1)) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 'calc(100% - 5rem)' }}
            />
          </div>
        </div>

        {/* --- Form Body --- */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Details (Name & Phone) */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Partner Registration</h3>
                <p className="text-slate-500 text-sm mb-6">Join our network and grow your business.</p>
                
                <div className="space-y-4" onKeyDown={handleStep1KeyDown}>
                  
                  {/* Name Input */}
                  <div className="relative group">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      autoFocus
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm" 
                      placeholder="Full Name" 
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 group-focus-within:text-indigo-500">+91</span>
                    <input 
                      name="phone" 
                      maxLength="10" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm" 
                      placeholder="Mobile Number" 
                    />
                  </div>

                  <button 
                    onClick={handleNextToLocation} 
                    disabled={!isStep1Valid} 
                    className="w-full mt-2 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onKeyDown={handleStep2KeyDown}>
                <button 
                  onClick={() => setStep(1)} 
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
                >
                  <HiArrowLeft /> Back to Details
                </button>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Set Your Work Area</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  We need your location to match you with nearby customers.
                </p>

                <div className="mb-6">
                  {locationState.status === 'idle' || locationState.status === 'denied' ? (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Navigation size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">Location Required</h4>
                      <p className="text-xs text-slate-500 mb-5 px-2">
                        Grant location access to discover job opportunities in your immediate vicinity.
                      </p>
                      <button 
                        type="button"
                        onClick={requestLocation} 
                        className="w-full py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                      >
                        {locationState.status === 'denied' ? 'Settings: Allow Location' : 'Detect My Location'}
                      </button>
                    </div>
                  ) : locationState.status === 'fetching' ? (
                    <div className="w-full py-12 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-indigo-600" size={24} />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detecting Area...</p>
                    </div>
                  ) : (
                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm">
                          <MapPin size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight mb-0.5">Active Service Area</p>
                          <p className="text-sm font-bold text-slate-800 leading-snug">{locationState.address}</p>
                        </div>
                      </div>
                      <button type="button" onClick={requestLocation} className="text-xs font-bold text-slate-500 underline hover:text-slate-700 text-left">Update Location</button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleRequestOtp} 
                  disabled={isLoading || !isStep2Valid} 
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ArrowRight size={18} /></>}
                </button>
              </motion.div>
            )}

            {/* Step 3: OTP Verification */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button 
                  onClick={() => setStep(2)} 
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
                >
                  <HiArrowLeft /> Back to Location
                </button>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Identity Verification</h3>
                <p className="text-slate-500 text-sm mb-8 text-pretty">
                  Please enter the 6-digit code sent to <span className="font-bold text-slate-800">+91 {formData.phone}</span>
                </p>
                
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx} 
                      ref={otpRefs[idx]} 
                      type="text" 
                      maxLength="1" 
                      inputMode="numeric"
                      value={digit} 
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-100 bg-slate-50 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                <button 
                  onClick={handleVerifyOtp} 
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Complete"}
                </button>
              </motion.div>
            )}

            {/* Success State */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <HiCheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Aboard!</h3>
                <p className="text-slate-500 text-sm mb-8 px-4 leading-relaxed">
                  Your profile has been successfully configured. You are now fully registered and ready to accept opportunities.
                </p>
                <button
                  onClick={handleGoToDashboard} 
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Access Dashboard <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">
        Secured by <b className="text-slate-500">ApkaPass Trust</b>
      </p>
    </div>
  );
}