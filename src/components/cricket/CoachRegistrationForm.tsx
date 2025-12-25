import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle, ChevronDown, ImagePlus, Mail, Phone, Shield, Sparkles, User, Users } from "lucide-react";

type CoachFormData = {
  role: "coach" | "influencer";
  name: string;
  mobile: string;
  otp: string;
  address: string;
  academyName: string;
  numberOfPlayers: string;
  email: string;
  password: string;
};

const CoachRegistrationForm = () => {
  const { toast } = useToast();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const [formData, setFormData] = useState<CoachFormData>({
    role: "coach",
    name: "",
    mobile: "",
    otp: "",
    address: "",
    academyName: "",
    numberOfPlayers: "",
    email: "",
    password: "",
  });

  const [coachImage, setCoachImage] = useState<File | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const BASE_URL = "http://localhost:5000";
  const BASE_URL = "https://brpl.net/api";

  const imagePreviewUrl = useMemo(() => {
    if (!coachImage) return null;
    return URL.createObjectURL(coachImage);
  }, [coachImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
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
        body: JSON.stringify({ mobile: formData.mobile }),
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
          title: "Failed to Send OTP",
          description: data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server.",
        variant: "destructive",
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
        body: JSON.stringify({ mobile: formData.mobile, otp: formData.otp }),
      });
      const data = await response.json();

      if (response.ok && data?.success) {
        setIsOtpVerified(true);
        toast({
          title: "OTP Verified",
          description: "Mobile number verified successfully.",
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to server.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateBeforeSubmit = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.mobile || formData.mobile.length !== 10) return "Valid mobile number is required.";
    if (!isOtpVerified) return "Please verify mobile number with OTP.";
    if (!formData.address.trim()) return "Address is required.";
    if (formData.role === "coach" && !formData.academyName.trim()) return "Academy name is required.";
    if (formData.role === "coach" && !formData.numberOfPlayers.trim()) return "Number of players is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!formData.password) return "Password is required.";
    if (!coachImage) return "Coach image is required.";
    return null;
  };

  const roleMeta = {
    coach: {
      label: "Coach",
      icon: <Users className="w-5 h-5" />,
      hint: "Academy + players details required",
    },
    influencer: {
      label: "Influencer",
      icon: <Sparkles className="w-5 h-5" />,
      hint: "Promote & collaborate with BRPL",
    },
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateBeforeSubmit();
    if (validationError) {
      toast({
        title: "Missing Information",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("role", formData.role);
      payload.append("name", formData.name);
      payload.append("mobile", formData.mobile);
      payload.append("address", formData.address);
      if (formData.role === "coach") {
        payload.append("academyName", formData.academyName);
        payload.append("numberOfPlayers", formData.numberOfPlayers);
      }
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      if (coachImage) payload.append("image", coachImage);

      const response = await fetch(`${BASE_URL}/auth/register-coach`, {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        toast({
          title: "Registration Submitted",
          description: `${formData.role === 'influencer' ? 'Influencer' : 'Coach'} registered successfully.`,
        });
        setFormData({
          role: "coach",
          name: "",
          mobile: "",
          otp: "",
          address: "",
          academyName: "",
          numberOfPlayers: "",
          email: "",
          password: "",
        });
        setCoachImage(null);
        setIsOtpSent(false);
        setIsOtpVerified(false);
      } else {
        let message = "Registration failed. Please try again.";
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {
          // ignore
        }
        toast({
          title: "Registration Failed",
          description: message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connection Error",
        description: "Failed to connect to server.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#0b1220]">
      <div className="absolute inset-0">
        <img src="/image1.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0b1220]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/80 via-[#263574]/20 to-[#0b1220]/90" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="px-8 pb-2 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-[#263574]">Coach Registration</CardTitle>
            <CardDescription className="text-gray-500">Fill in your details to register as a coach.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="px-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Register As</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen((v) => !v)}
                    className={`w-full p-3 bg-gray-50 border rounded-lg flex items-center justify-between transition-all duration-300 ${isRoleDropdownOpen
                      ? "border-[#263574] ring-2 ring-[#263574]/20"
                      : "border-gray-200 hover:border-[#263574]/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full text-white shadow-sm ${formData.role === "coach"
                          ? "bg-gradient-to-br from-[#263574] to-[#1f2b5e]"
                          : "bg-gradient-to-br from-purple-600 to-pink-600"
                          }`}
                      >
                        {roleMeta[formData.role].icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-[#0b1220]">{roleMeta[formData.role].label}</div>
                        <div className="text-xs text-gray-500">{roleMeta[formData.role].hint}</div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isRoleDropdownOpen ? "rotate-180 text-[#263574]" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isRoleDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {(["coach", "influencer"] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, role }));
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${formData.role === role ? "bg-[#263574]/5" : "hover:bg-gray-50"
                              }`}
                          >
                            <div
                              className={`p-2 rounded-full text-white ${role === "coach"
                                ? "bg-gradient-to-br from-[#263574] to-[#1f2b5e]"
                                : "bg-gradient-to-br from-purple-600 to-pink-600"
                                }`}
                            >
                              {roleMeta[role].icon}
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold ${formData.role === role ? "text-[#263574]" : "text-gray-700"}`}>
                                {roleMeta[role].label}
                              </div>
                              <div className="text-xs text-gray-500">{roleMeta[role].hint}</div>
                            </div>
                            {formData.role === role && <CheckCircle className="w-5 h-5 text-[#263574]" />}
                          </button>
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
                <div className="flex gap-3">
                  <div className="relative flex-grow flex">
                    <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-700 font-medium select-none">
                      +91
                    </div>
                    <div className="relative flex-grow">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={isOtpVerified}
                        required
                        placeholder="Enter your mobile number"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                        inputMode="numeric"
                      />
                      {isOtpVerified && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                    </div>
                  </div>

                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || isOtpSent}
                      className="px-6 py-3 bg-[#263574] text-white rounded-lg disabled:opacity-70 whitespace-nowrap shadow"
                    >
                      {isSendingOtp ? "Sending..." : isOtpSent ? "Sent" : "Send OTP"}
                    </button>
                  )}
                </div>

                {isOtpSent && !isOtpVerified && (
                  <div className="mt-3 flex gap-3">
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter OTP"
                      className="flex-grow pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-70 shadow"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                )}
              </div>

              {formData.role === "coach" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Academy Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                      <input
                        type="text"
                        name="academyName"
                        value={formData.academyName}
                        onChange={handleChange}
                        required
                        placeholder="Enter academy name"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">No. of Players</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                      <input
                        type="text"
                        name="numberOfPlayers"
                        value={formData.numberOfPlayers}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 25"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Address</label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  className="bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-[#263574]/20 focus-visible:ring-2 focus-visible:ring-offset-0 text-gray-900"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email Id</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#263574] transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="*****"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-2 focus:ring-[#263574]/20 transition-all text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Image of Coach</label>
                <div className="relative">
                  <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoachImage(e.target.files?.[0] || null)}
                    className="h-12 pl-12 border-gray-200 bg-gray-50 text-gray-900"
                    required
                  />
                </div>
                {imagePreviewUrl && (
                  <div className="pt-3">
                    <img src={imagePreviewUrl} alt="Coach preview" className="h-28 w-28 rounded-lg object-cover border border-gray-200" />
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="px-8 pb-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-[#263574] hover:bg-[#1f2b5e] shadow-lg text-white transition-all duration-200"
              >
                {isSubmitting ? "Submitting..." : formData.role === 'influencer' ? 'Register Influencer' : 'Register Coach'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CoachRegistrationForm;
