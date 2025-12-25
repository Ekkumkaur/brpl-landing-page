import { motion } from 'framer-motion';
import { Smartphone, Trophy, Map, Scale, Users } from 'lucide-react';

const features = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Show Your Skills. From Anywhere.',
    description: 'BRPL is where players get the chance to audition from your own state or own stadium or playground; you just need to shoot a small video and showcase your skill.',
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: 'One Performance. Zonal Stage. Nationwide League.',
    description: 'BRPL gives you the chance to win your zone & then step straight into the nationwide league spotlight.',
  },
  {
    icon: <Map className="w-8 h-8" />,
    title: '28 States. 8 UTs. One High-Intensity Battle for the Top.',
    description: 'A national stage bringing together top talent from 28 states and 8 UTs — real competition, real pressure & real cricket.',
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: 'Fair Selection',
    description: '100% talent-based selection. No bias, no favouritism – just pure skill',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'All Age Groups',
    description: 'Categories: Under-16, Under-19, Under-24, Under-40',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0b1220]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/image1.png"
          alt="Cricket background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0b1220]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/40 via-[#0b1220]/80 to-black/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider uppercase bg-white/10 border border-white/15 rounded-full text-white/90">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
            Why Choose{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              BRPL?
            </span>
          </h2>
          <p className="text-white/70 max-w-lg mx-auto">
            Everything you need to become a professional cricketer, all in one place
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group rounded-xl p-6 cursor-pointer bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/15 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-sky-200 mb-4 group-hover:bg-sky-500/20 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-white group-hover:text-sky-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
