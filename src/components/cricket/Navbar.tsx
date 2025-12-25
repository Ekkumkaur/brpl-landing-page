import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const navLinks = [
  //   { name: 'Home', href: '#' },
  //   { name: 'Programs', href: '#features' },
  //   { name: 'Statistics', href: '#stats' },
  //   { name: 'Testimonials', href: '#testimonials' },
  //   { name: 'Register', href: '#registration' },
  // ];

  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href.replace('#', '#'));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'py-6'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              type="button"
              onClick={() => scrollToSection('#')}
              className="flex items-center gap-3"
              aria-label="BRPL home"
            >
              <img
                src="/logo.png"
                alt="BRPL logo"
                className="h-16 w-auto object-contain"
              />
              {/* <span className="hidden sm:block font-display text-xl font-bold tracking-wide text-foreground">
                BRPL
              </span> */}
            </button>

            {/* Desktop Nav */}
            {/* <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-sm font-semibold transition-colors ${
                    isScrolled ? 'text-foreground/80 hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div> */}

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollToSection('#registration')}
                className="px-6 py-2 bg-primary text-white font-display font-semibold rounded-lg border-2 border-white/20 hover:bg-primary/90 hover:border-white/40 transition-all shadow-lg"
              >
                Register Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass pt-24 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-6">
                {/* {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="text-xl font-display font-semibold text-foreground/80 hover:text-primary transition-colors text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.name}
                  </motion.button>
                ))} */}

                <motion.button
                  onClick={() => scrollToSection('#registration')}
                  className="mt-4 px-6 py-3 bg-[#263574] text-white font-display font-semibold rounded-lg border-2 border-white/20 shadow-lg relative overflow-hidden group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="relative z-10">Register Now</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
