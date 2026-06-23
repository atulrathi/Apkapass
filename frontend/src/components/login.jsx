import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import axiosInstance from "../services/axiosinstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  // 6 digit OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  // 6 refs for the 6 inputs
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Handle the countdown timer
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [step, timeLeft]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setIsLoading(true);

    try {
      // The code 'waits' here until the backend responds
      const response = await axiosInstance.post("/auth/send-otp", {
        phone: `+91${phone}`,
      });

      // If successful:
      setIsLoading(false);
      setStep(2);
      setTimeLeft(300); // Start the 5-minute timer from the previous step
    } catch (error) {
      // If it fails (Network error, CORS, 400/500 status):
      setIsLoading(false);
      console.error("Error sending OTP:", error);

      // Professionally extract the backend error message if it exists
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      alert(errorMessage);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        phone: `+91${phone}`,
        otp: otpValue,
      });
      console.log("OTP verification response:", response);

      if (response.status === 200) {
        if (response.data.role === "provider") {
          setIsLoading(false);
          setStep(3);
          navigate("/provider-profile");
        } else {
          setIsLoading(false);
          setStep(3);
          navigate("/home");
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error verifying OTP:", error);

      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      alert(errorMessage);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    // Move focus to next input (up to index 5)
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    setIsLoading(true);
    // Simulate resend API call
    setTimeout(() => {
      setIsLoading(false);
      setTimeLeft(300); // Reset timer to 5 minutes
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current.focus();
    }, 1000);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {/* STEP 1: PHONE NUMBER INPUT */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
                Welcome
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Enter your mobile number to continue
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit}>
              <div className="mb-6">
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center pl-4 pr-3 py-4 border-r border-slate-200 bg-slate-50">
                    <Smartphone
                      size={18}
                      strokeWidth={2}
                      className="text-slate-400"
                    />
                  </div>
                  <div className="flex items-center px-3 text-slate-900 font-bold text-base">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="00000 00000"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-transparent outline-none py-4 pr-4 font-bold text-slate-900 tracking-wider placeholder:text-slate-300 text-base"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length < 10 || isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Continue"
                )}
                {!isLoading && <ArrowRight size={16} strokeWidth={2.5} />}
              </button>
            </form>

            <p className="text-center text-[10px] font-bold text-slate-400 mt-6 px-4">
              By continuing, you accept our{" "}
              <span className="text-blue-600 cursor-pointer">Terms</span> and{" "}
              <span className="text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </motion.div>
        )}

        {/* STEP 2: OTP VERIFICATION (6 Digits + Timer) */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors mb-6"
            >
              <ArrowLeft size={14} strokeWidth={2.5} /> Back
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck
                  size={24}
                  className="text-blue-600"
                  strokeWidth={2}
                />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
                Verification
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Code sent to{" "}
                <span className="font-bold text-slate-900">+91 {phone}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit}>
              {/* 6 Digit OTP Input Row - slightly narrower boxes to fit nicely */}
              <div className="flex justify-between gap-2 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otp.join("").length < 6 || isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Verify & Login"
                )}
              </button>
            </form>

            <div className="text-center mt-6 flex flex-col items-center justify-center gap-2">
              <span className="text-[11px] font-bold flex items-center gap-1 text-slate-400">
                <Clock size={12} strokeWidth={2} />
                {formatTime(timeLeft)}
              </span>
              <button
                onClick={handleResendCode}
                disabled={timeLeft > 0 || isLoading}
                className={`text-[12px] font-bold transition-colors ${timeLeft > 0 ? "text-slate-300 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"}`}
              >
                Resend Code
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center py-6"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2
                size={32}
                className="text-green-600"
                strokeWidth={2}
              />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
              Securely Logged In
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Routing to your dashboard...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
