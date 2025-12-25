import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, Target, Send, CheckCircle, CreditCard, Upload, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { MapPin, Building2, Square, Swords, CircleDot, Shield, Zap } from 'lucide-react';

interface RegistrationFormProps {
  isEmbedded?: boolean;
}

const RegistrationForm = ({ isEmbedded = false }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    phone: '',
    state: '',
    city: '',
    email: '',
    password: '',
    referralCodeUsed: '',
    otp: '',
    termsAccepted: false,
    paymentAmount: 0,
    paymentId: '',
    isFromLandingPage: true
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // const BASE_URL = "http://localhost:5000";
  const BASE_URL = "https://brpl.net/api";


  const roles = ['Batsman', 'Bowler', 'Wicket Keeper', 'All-Rounder'];

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.role || !formData.name || !formData.phone || !formData.state || !formData.city) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields to proceed.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.termsAccepted) {
        toast({
          title: "Terms Required",
          description: "Please agree to the terms and conditions.",
          variant: "destructive",
        });
        return;
      }
      if (!isOtpVerified) {
        toast({
          title: "OTP Verification Required",
          description: "Please verify your mobile number with OTP.",
          variant: "destructive",
        });
        return;
      }
      setStep(step + 1);
    } else if (step === 2) {
      // Allow direct navigation via Next button only if simulating or handled by Payment Handler
      // But we want to block "Next" until payment is done.
      // The UI for Step 2 won't have a "Next" button that calls handleNext directly anymore,
      // it will be the Payment button.
      // However, we might keep handleNext for "Already Paid" scenario or similar if needed.
      // For now, let's assume handleNext is NOT used for Step 2 -> Step 3 transition in this flow,
      // except maybe manually called.
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: formData.phone }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your mobile for the OTP.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Send OTP",
          description: data.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to server.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the OTP sent to your mobile.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: formData.phone, otp: formData.otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsOtpVerified(true);
        toast({
          title: "OTP Verified",
          description: "Mobile number verified successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: data.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to server.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    const res = await loadRazorpay();

    if (!res) {
      toast({
        variant: "destructive",
        title: "Razorpay SDK Failed",
        description: "Failed to load Razorpay SDK. Check your internet connection.",
      });
      setIsProcessingPayment(false);
      return;
    }

    try {
      // 1. Create Order
      const orderResponse = await fetch(`${BASE_URL}/api/payment/order-landing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2 }), // Amount in INR (2.00)
      });
      const orderData = await orderResponse.json();

      if (!orderData.id) {
        throw new Error("Failed to create order");
      }

      // 2. Open Razorpay Options
      const options = {
        key: "rzp_live_RsBsR05m5SGbtT", // Should ideally come from backend or env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Beyond Reach Premier League",
        description: "Registration Fee",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyResponse = await fetch(`${BASE_URL}/api/payment/verify-landing`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast({
                title: "Payment Successful",
                description: "Proceeding to next step.",
              });
              setFormData((prev) => ({
                ...prev,
                paymentId: response.razorpay_payment_id,
                paymentAmount: verifyData.amount || 2 // Fallback to 2 if not returned, or use orderData.amount / 100 if available
              }));
              setStep(3); // Move to Step 3
            } else {
              toast({
                variant: "destructive",
                title: "Payment Verification Failed",
                description: "Please contact support.",
              });
            }
          } catch (err) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Payment verification failed.",
            });
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
          email: formData.email, // Might be empty at step 2, but okay
        },
        theme: {
          color: "#263574",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initiate payment.",
      });
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fname: formData.name,
        mobile: formData.phone,
        state: formData.state,
        city: formData.city,
        playerRole: formData.role,
        email: formData.email,
        password: formData.password,
        isFromLandingPage: true,
        paymentAmount: formData.paymentAmount,
        paymentId: formData.paymentId,
        referralCodeUsed: formData.referralCodeUsed,
      };

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Registration Complete! 🏏",
          description: "Welcome to the BRPL Please login to continue.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Removed early return to allow modal overlay


  return (
    <>
      <section id="registration" className="p-15 py-20 relative overflow-hidden">

        <div className={`container mx-auto px-4 relative z-10 ${isEmbedded ? '' : 'grid lg:grid-cols-2 gap-12 items-center'}`}>
          {/* Left Content */}
          {!isEmbedded && (
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider uppercase bg-white/10 border border-white/20 rounded-full text-white">
                Join The Elite
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Journey</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Take the first step towards your professional cricket career. Our comprehensive registration process ensures we understand your skills and potential.
              </p>

              <div className="space-y-6">
                {[
                  { step: 1, title: 'Personal Details', desc: 'Tell us about yourself and your cricketing role.' },
                  { step: 2, title: 'Secure Payment', desc: 'Complete the registration fee payment securely.' },
                  { step: 3, title: 'Create Account', desc: 'Secure your account with a username and password.' }
                ].map((item) => (
                  <div key={item.step} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${step === item.step ? 'bg-white/10 border border-white/20' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${step >= item.step ? 'bg-[#263574] text-white border border-white/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                      {step > item.step ? <CheckCircle className="w-5 h-5" /> : item.step}
                    </div>
                    <div>
                      <h4 className={`font-bold ${step === item.step ? 'text-white' : 'text-gray-400'}`}>{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Right Form */}
          <motion.div
            className={`bg-white rounded-2xl p-4 md:p-8 shadow-2xl relative overflow-hidden ${isEmbedded ? 'w-full' : ''}`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#263574]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
                <span className={step >= 1 ? 'text-[#263574] font-bold' : ''}>Details</span>
                <span className={step >= 2 ? 'text-[#263574] font-bold' : ''}>Payment</span>
                <span className={step >= 3 ? 'text-[#263574] font-bold' : ''}>Account</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Step 1 Fields */}
                      <div className="group relative z-50">
                        <label className="block text-sm font-semibold mb-3 text-gray-700">Select Your Role</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            className={`w-full p-3 bg-gray-50 border rounded-xl flex items-center justify-between transition-all duration-300 ${isRoleDropdownOpen ? 'border-[#263574] ring-2 ring-[#263574]/20' : 'border-gray-200 hover:border-[#263574]/50'}`}
                          >
                            <div className="flex items-center gap-3">
                              {formData.role ? (
                                <>
                                  <div className="p-2 bg-[#263574] text-white rounded-full">
                                    {formData.role === 'Batsman' && <Swords className="w-5 h-5" />}
                                    {formData.role === 'Bowler' && <CircleDot className="w-5 h-5" />}
                                    {formData.role === 'Wicket Keeper' && <Shield className="w-5 h-5" />}
                                    {formData.role === 'All-Rounder' && <Zap className="w-5 h-5" />}
                                  </div>
                                  <span className="font-semibold text-[#263574]">{formData.role}</span>
                                </>
                              ) : (
                                <>
                                  <div className="p-2 bg-gray-200 text-gray-500 rounded-full">
                                    <Target className="w-5 h-5" />
                                  </div>
                                  <span className="text-gray-500">Choose your playing role</span>
                                </>
                              )}
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180 text-[#263574]' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isRoleDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                              >
                                {roles.map((role) => (
                                  <div
                                    key={role}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, role }));
                                      setIsRoleDropdownOpen(false);
                                    }}
                                    className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${formData.role === role ? 'bg-[#263574]/5' : 'hover:bg-gray-50'}`}
                                  >
                                    <div className={`p-2 rounded-full ${formData.role === role ? 'bg-[#263574] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                      {role === 'Batsman' && <Swords className="w-5 h-5" />}
                                      {role === 'Bowler' && <CircleDot className="w-5 h-5" />}
                                      {role === 'Wicket Keeper' && <Shield className="w-5 h-5" />}
                                      {role === 'All-Rounder' && <Zap className="w-5 h-5" />}
                                    </div>
                                    <span className={`font-semibold ${formData.role === role ? 'text-[#263574]' : 'text-gray-600'}`}>
                                      {role}
                                    </span>
                                    {formData.role === role && <CheckCircle className="w-4 h-4 text-[#263574] ml-auto" />}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Mobile Number</label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow flex">

                            {/* Country Code */}
                            <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-700 font-medium select-none">
                              +91
                            </div>

                            {/* Phone Input */}
                            <div className="relative flex-grow">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />

                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isOtpVerified}
                                required
                                placeholder="Enter your mobile number"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                              />

                              {isOtpVerified && (
                                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                              )}
                            </div>

                          </div>
                          {!isOtpVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isSendingOtp || isOtpSent}
                              className="px-4 py-2 bg-[#263574] text-white rounded-lg disabled:opacity-70 whitespace-nowrap"
                            >
                              {isSendingOtp ? "Sending..." : isOtpSent ? "Sent" : "Send OTP"}
                            </button>
                          )}
                        </div>
                        {isOtpSent && !isOtpVerified && (
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              name="otp"
                              value={formData.otp}
                              onChange={handleChange}
                              placeholder="Enter OTP"
                              className="flex-grow pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] text-gray-900"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-70"
                            >
                              {isVerifyingOtp ? "Verifying..." : "Verify"}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold mb-2 text-gray-700">State</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              required
                              placeholder="Your State"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="group">
                          <label className="block text-sm font-semibold mb-2 text-gray-700">Trial City</label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              placeholder="Preferred City"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          id="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-gray-300 text-[#263574] focus:ring-[#263574]"
                        />
                        <label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer select-none">
                          I agree to the <a href="#" className="text-[#263574] hover:underline font-semibold">Terms and Conditions</a>
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full py-4 bg-[#263574] text-white font-display font-bold text-lg rounded-lg relative overflow-hidden group border-2 border-white/20 hover:bg-[#1f2b5e] shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="relative z-10">Next Step</span>
                      <ArrowRight className="w-5 h-5 relative z-10" />
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-[#263574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-[#263574]" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Registration Fee</h3>
                      <p className="text-3xl font-bold text-[#263574] mb-1">₹2.00</p>
                      <p className="text-sm text-gray-500">One-time registration fee</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="font-medium text-gray-900 block">
                          UPI / Net Banking
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          100% secure payments powered by <span className="font-semibold text-[#263574]">Razorpay</span>.
                          Supports UPI, Net Banking, Debit & Credit Cards.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="w-1/3 py-4 bg-gray-100 text-gray-700 font-display font-bold text-lg rounded-lg border border-gray-200 hover:bg-gray-200 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                        className="w-2/3 py-4 bg-[#263574] text-white font-display font-bold text-lg rounded-lg relative overflow-hidden group border-2 border-white/20 hover:bg-[#1f2b5e] shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="relative z-10">{isProcessingPayment ? "Processing..." : "Pay & Proceed"}</span>
                        <ArrowRight className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-[#263574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-[#263574]" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Create Your Account</h3>
                      <p className="text-sm text-gray-500">Set up your login credentials to access the dashboard</p>
                    </div>

                    <div className="space-y-4">
                      <div className="group">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Referral Code (Optional)</label>
                        <div className="relative">
                          <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                          <input
                            type="text"
                            name="referralCodeUsed"
                            value={formData.referralCodeUsed}
                            onChange={handleChange}
                            placeholder="Enter referral code if you have"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address (Username)</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
                        <div className="relative">
                          {/* Reusing Shield icon or similar for password if Lock icon not imported, assuming Shield is available from imports */}
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a strong password"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="w-1/3 py-4 bg-gray-100 text-gray-700 font-display font-bold text-lg rounded-lg border border-gray-200 hover:bg-gray-200 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 py-4 bg-[#263574] text-white font-display font-bold text-lg rounded-lg relative overflow-hidden group disabled:opacity-70 border-2 border-white/20 hover:bg-[#1f2b5e] shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="relative z-10">
                          {isSubmitting ? 'Registering...' : 'Complete Registration'}
                        </span>
                        {!isSubmitting && <CheckCircle className="w-5 h-5 relative z-10" />}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className="w-20 h-20 text-[#263574] mx-auto mb-6" />
              </motion.div>
              <h3 className="font-display text-3xl font-bold mb-4 text-gray-900">You're In!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for registering. Our team will contact you within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href="https://brpl.net/auth"
                  className="px-6 py-2 bg-[#263574] text-white rounded-lg hover:bg-[#1f2b5e] transition-colors"
                >
                  Login
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegistrationForm;
