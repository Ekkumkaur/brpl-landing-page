import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
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
            const response = await fetch(`${BASE_URL}/admin/landing/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Admin Access Granted",
                    description: "Welcome to the control center.",
                });

                // Store token
                localStorage.setItem("_admin_token", data.data.token);

                navigate('/admin/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Access Denied",
                    description: "Invalid credentials.",
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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#070a13]">
            <div className="absolute inset-0">
                <img src="/auth1.png" alt="Admin background" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[#070a13]/70" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/70 via-[#263574]/20 to-[#070a13]/80" />
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#263574]/30 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl text-white">
                    <div className="p-8 text-center border-b border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/25 to-[#263574]/25 border border-white/10 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">BRPL Admin</h2>
                        <p className="text-white/70 mt-2 text-sm">Secure control center access</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-red-400/60 focus:ring-2 focus:ring-red-400/25 transition-all text-white placeholder-white/40"
                                        placeholder="admin@brpl.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-red-400/60 focus:ring-2 focus:ring-red-400/25 transition-all text-white placeholder-white/40"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 bg-gradient-to-r from-red-600 via-red-500 to-[#263574] hover:from-red-500 hover:via-red-400 hover:to-[#2f3f86] transition-all"
                            >
                                {isLoading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-xs text-white/50 text-center">Use your admin credentials to continue</div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
