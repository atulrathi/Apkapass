import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// Assuming you have an axios instance configured
// import axiosInstance from '../utils/axiosInstance'; 
import { 
  User, Phone, MapPin, ArrowRight, ShieldCheck, 
  TrendingUp, Wallet, ArrowLeft, LocateFixed, 
  CheckCircle, Loader2, Wrench
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ac', label: 'AC Repair' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrician', label: 'Electrical' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'carpenter', label: 'Carpentry' },
  { id: 'painter', label: 'Painting' },
  { id: 'appliance', label: 'Appliance Repair' },
  { id: 'pest', label: 'Pest Control' },
  { id: 'salon', label: 'Salon & Beauty' },
  { id: 'movers', label: 'Packers & Movers' }
];

export default function ProviderRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
  });
  
  // Step 2: OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Step 3: Location & Services State
  const [selectedServices, setSelectedServices] = useState([]);
  const [locationCoords, setLocationCoords] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // --- Handlers ---

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      // Mock API call - Replace with your actual axiosInstance
      // await axiosInstance.post('/auth/send-otp', { phone: formData.phone });
      
      // Simulating network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || !formData.name.trim()) {
      setError('Please provide your name and a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Mock API call
      /* await axiosInstance.post('/provider/verify-provider-otp', {
        phone: formData.phone,
        otp: otpValue,
        name: formData.name,
      });
      */
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(3);
    } catch (err) {
      setError('Invalid OTP or verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setError('Please select at least one service.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const payload = {
        name: formData.name.trim(),
        services: selectedServices,
        location: locationCoords.length === 2 ? { type: 'Point', coordinates: locationCoords } : null
      };

      // Mock API call
      // await axiosInstance.post('/provider/update-provider', payload);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/provider-profile');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setIsLoading(false);
    }
  };

  // --- Helpers ---

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const toggleService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // GeoJSON standard is [longitude, latitude]
        setLocationCoords([position.coords.longitude, position.coords.latitude]);
        setIsFetchingLocation(false);
      },
      (error) => {
        setIsFetchingLocation(false);
        setError("Could not get location. Please enable location permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // --- Animation Variants ---
  const slideVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 flex flex-col md:flex-row">
      
      {/* Left Column - Marketing */}
      <div className="w-full md:w-[45%] lg:w-[40%] bg-gray-900 text-white relative overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <button onClick={() => navigate('/home')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 font-medium">
            <ArrowLeft size={20} /> Back to Home
          </button>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
            Grow your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ApkaPass</span>
          </h1>
          <p className="text-lg text-gray-400 mb-12 font-medium max-w-md">
            Join thousands of top-rated professionals. Get verified, meet new customers, and manage your bookings seamlessly.
          </p>

          <div className="space-y-8 hidden md:block">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <TrendingUp className="text-blue-400" size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">More Customers</h3>
                <p className="text-gray-400 font-medium text-sm">Get discovered by locals searching for your exact skills.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Wallet className="text-emerald-400" size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Increase Earnings</h3>
                <p className="text-gray-400 font-medium text-sm">Set your own rates and build a profitable pipeline.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                <ShieldCheck className="text-purple-400" size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Verified Trust</h3>
                <p className="text-gray-400 font-medium text-sm">Our verification badge gives customers confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Multi-Step Form */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-xl">
          
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > num ? <CheckCircle size={16} /> : num}
              </div>
            ))}
          </div>

          {/* Form Area */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[400px] relative overflow-hidden">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: Phone Number */}
              {step === 1 && (
                <motion.form key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handlePhoneSubmit}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome to Pro</h2>
                    <p className="text-gray-500 font-medium text-md">Enter your phone number to start.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Phone Number</label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-4 text-gray-400" size={20} />
                        <span className="absolute left-11 text-gray-500 font-medium border-r border-gray-200 pr-3">+91</span>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10)})}
                          className="w-full pl-28 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-gray-900 text-lg"
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 group">
                      {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>Send OTP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: Name & OTP */}
              {step === 2 && (
                <motion.form key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleVerifyOTP}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Verify Details</h2>
                    <p className="text-gray-500 font-medium text-md">Code sent to +91 {formData.phone}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 text-gray-400" size={20} />
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-gray-900"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">6-Digit Secure OTP</label>
                      <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={el => otpRefs.current[index] = el}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 group">
                      {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>Verify & Continue <CheckCircle size={20} className="group-hover:scale-110 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: Services & Location */}
              {step === 3 && (
                <motion.form key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleUpdateProfile}>
                  <div className="mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Build Profile</h2>
                    <p className="text-gray-500 font-medium text-md">Tell us what you do and where you work.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Services Selection */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Select Services You Offer</label>
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                        {CATEGORIES.map(cat => {
                          const isSelected = selectedServices.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleService(cat.id)}
                              className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                                isSelected 
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                              }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location Fetcher */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Service Area (Location)</label>
                      <div 
                        className={`w-full p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-colors ${locationCoords.length ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
                      >
                        {locationCoords.length ? (
                          <>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <MapPin className="text-green-600" size={24} />
                            </div>
                            <p className="text-green-800 font-bold">Location Captured Successfully</p>
                            <p className="text-green-600 text-xs mt-1">Ready to receive nearby jobs</p>
                            <button type="button" onClick={handleGetLocation} className="mt-3 text-sm text-green-700 underline font-semibold">Update Location</button>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <LocateFixed className="text-blue-600" size={24} />
                            </div>
                            <p className="text-gray-600 font-medium mb-4 text-sm">We need your location to connect you with nearby customers.</p>
                            <button
                              type="button"
                              onClick={handleGetLocation}
                              disabled={isFetchingLocation}
                              className="bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-800 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                              {isFetchingLocation ? <Loader2 className="animate-spin text-blue-600" size={18} /> : <MapPin size={18} className="text-blue-600" />}
                              Fetch Current Location
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading || locationCoords.length === 0} className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group">
                      {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>Complete Setup <Wrench size={20} className="group-hover:rotate-12 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-gray-400 font-medium mt-6">
            By proceeding, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}