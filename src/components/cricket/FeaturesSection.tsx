import { motion } from 'framer-motion';
import { Dumbbell, Video, Users, Award, Timer, MapPin } from 'lucide-react';

const features = [
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: 'Elite Training',
    description: 'State-of-the-art facilities with advanced equipment and personalized training programs.',
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: 'Video Analysis',
    description: 'AI-powered biomechanical analysis to perfect your technique and identify areas for improvement.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Expert Coaches',
    description: 'Learn from former international cricketers and certified professional coaches.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Tournaments',
    description: 'Regular competitive matches and tournaments to test your skills against the best.',
  },
  {
    icon: <Timer className="w-8 h-8" />,
    title: 'Flexible Schedule',
    description: 'Morning, evening, and weekend batches to fit your lifestyle and commitments.',
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Multiple Locations',
    description: 'Training centers across the city with indoor and outdoor practice facilities.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0b1220]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/stats.png"
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
            World-Class{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Training
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
