import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cricket Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/banner-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-primary/50" />
      </div>

      {/* Semi-transparent Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>


      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto text-center text-white py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider uppercase bg-black/40 border border-white/20 rounded-full text-white backdrop-blur-sm shadow-lg">
            Beyond Reach Premier League
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="block text-white drop-shadow-md">UNLEASH YOUR</span>
          <span className="block gradient-text text-shadow-hero drop-shadow-xl">INNER CHAMPION</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-md font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Join the elite training program that has produced international cricketers.
          Master your skills with world-class coaches and state-of-the-art facilities.
        </motion.p>

        <div className="flex justify-center items-center">
          <button
            onClick={scrollToForm}
            className="bg-[#263574] hover:bg-[#1f2b5e] text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 flex items-center gap-2 mx-auto group shadow-lg hover:shadow-xl hover:scale-105 transform border-2 border-white/20 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Register Now
              <ChevronDown className="w-5 h-5 animate-bounce-subtle" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-primary/60" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
