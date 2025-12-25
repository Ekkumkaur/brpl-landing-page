import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, href: 'https://www.instagram.com/brplofficial/', label: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: 'https://x.com/BRPLOfficial', label: 'Twitter' },
    { icon: <Facebook className="w-5 h-5" />, href: 'https://www.facebook.com/people/BRPL-Official/61584782136820/', label: 'Facebook' },
    // { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="py-16 relative border-t border-border/50" style={{ backgroundColor: '#263574' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="inline-flex items-center gap-3 mb-4" aria-label="BRPL home">
              <div className="bg-transperent p-2 rounded-lg">
                <img
                  src="/logo.png"
                  alt="BRPL logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            </a>
            <p className="text-white/80 mb-6 max-w-md">
              Beyond Reach Premier League (BRPL) is dedicated to nurturing cricket talent through world-class training, competitive leagues, and professional coaching programs. Join us in our mission to elevate the game and empower the next generation of cricketers.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#263574] transition-all duration-300 border border-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {/* <h4 className="font-display font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Programs', 'Coaches', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>Ground Floor, Suite G-01, Procapitus Business Park, D-247/4A, D Block, Sector 63, Noida, Uttar Pradesh 201309</span>
              </li>
              {/* <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-white" />
                <span>+1 234 567 8900</span>
              </li> */}
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-white" />
                <span>info@brpl.net</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © Copyright {new Date().getFullYear()} | All Rights Reserved by Beyond Reach Premier League
          </p>
          {/* <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
