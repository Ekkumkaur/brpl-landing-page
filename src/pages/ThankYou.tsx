import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    useEffect(() => {
        // Meta Pixel Event Code
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'CompleteRegistration', {
                value: 1499,
                currency: 'INR',
            });
        }
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <img
                    src="/stats.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <motion.div
                className="relative z-20 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    <CheckCircle className="w-24 h-24 text-[#263574] mx-auto mb-6" />
                </motion.div>

                <h1 className="font-display text-4xl font-bold mb-4 text-gray-900">
                    Welcome to the Team!
                </h1>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Your registration is complete. We are excited to see you on the field. Our team will contact you within 24 hours with further details.
                </p>

                <div className="space-y-4">
                    <a
                        href="https://brpl.net/auth"
                        className="block w-full py-4 bg-[#263574] text-white font-display font-bold text-lg rounded-lg relative overflow-hidden group border-2 border-white/20 hover:bg-[#1f2b5e] shadow-lg flex items-center justify-center gap-2"
                    >
                        <span className="relative z-10">Login to Dashboard</span>
                        <ArrowRight className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </a>

                    <Link
                        to="/"
                        className="block w-full py-3 text-gray-500 font-medium hover:text-[#263574] transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ThankYou;
