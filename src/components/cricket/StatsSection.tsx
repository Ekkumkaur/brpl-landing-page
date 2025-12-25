import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Users, Target, Award } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

const StatItem = ({ icon, value, suffix = '', label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/10 text-sky-200 border border-white/10 group-hover:bg-sky-500/20 group-hover:text-white transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-white/60 font-medium">{label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    { icon: <Trophy className="w-7 h-7" />, value: 150, suffix: '+', label: 'Championships Won' },
    { icon: <Users className="w-7 h-7" />, value: 5000, suffix: '+', label: 'Players Trained' },
    { icon: <Target className="w-7 h-7" />, value: 98, suffix: '%', label: 'Success Rate' },
    { icon: <Award className="w-7 h-7" />, value: 25, suffix: '', label: 'International Players' },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#0b1220]">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <img
          src="/image1.png"
          alt="Cricket background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0b1220]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/30 via-[#0b1220]/75 to-black/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
            Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-emerald-300">
              Legacy
            </span>
          </h2>
          <p className="text-white/70 max-w-lg mx-auto">
            Numbers that speak for our excellence and commitment to cricket
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
