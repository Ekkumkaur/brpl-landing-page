import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import RegistrationForm from './RegistrationForm';

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Darker overlay for better text visibility */}
        <img
          src="/stats.png"
          alt="Cricket Banner"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-[20s]"
        />
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
      <div className="container relative z-10 px-4 mx-auto pt-24 pb-8 md:py-20">
        <div className="grid lg:grid-cols-2 gap-0 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left text-white">


            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mt-10 md:mt-0 mb-0 md:mb-6 leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="block text-white mb-2">BHARAT KI LEAGUE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter brightness-125">BHARTIYO KA SAPNA</span>
            </motion.h1>


          </div>

          {/* Right Content - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-2xl mx-auto lg:ml-auto"
          >
            <RegistrationForm isEmbedded={true} />
          </motion.div>
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
