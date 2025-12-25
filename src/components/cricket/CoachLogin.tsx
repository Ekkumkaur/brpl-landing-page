import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, ArrowRight, Loader } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';

const CoachLogin = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    // const BASE_URL = "http://localhost:5000";
    const BASE_URL = "https://brpl.net/api";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/auth/login-coach`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Login Successful",
                    description: `Welcome back, ${data.user.name}!`,
                });

                // Store token and user details
                localStorage.setItem("_auth_token", data.token);
                localStorage.setItem("_user_role", data.user.role);
                localStorage.setItem("_user_id", data.user.id);

                // Redirect based on role
                if (data.user.role === 'coach') {
                    navigate('/coach/dashboard');
                } else if (data.user.role === 'influencer') {
                    navigate('/influencer/dashboard');
                } else {
                    navigate('/'); // Fallback
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: data.message || "Invalid credentials.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Connection Error",
                description: "Failed to connect to server.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1220] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#263574]/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#263574]/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                        <h2 className="text-3xl font-display font-bold text-[#263574]">Partner Login</h2>
                        <p className="text-gray-500 mt-2">Coach & Influencer Portal</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-1 focus:ring-[#263574] transition-all text-gray-900"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-[#263574] hover:underline font-medium">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#263574] focus:ring-1 focus:ring-[#263574] transition-all text-gray-900"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#263574] text-white font-bold rounded-lg hover:bg-[#1f2b5e] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Login to Dashboard
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="p-4 text-center bg-gray-50 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/coach-register" className="font-bold text-[#263574] hover:underline">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CoachLogin;
