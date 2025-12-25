import { motion } from 'framer-motion';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Who can participate in BRPL?',
    answer: 'BRPL is open to aspiring and semi-professional cricketers aged 16–35 from 28 states and 8 Union Territories across India. If you have the skill and hunger to compete, BRPL is for you.',
  },
  {
    question: 'Do I need to travel for trials or auditions?',
    answer: 'No. Players can audition from their own state or local ground by submitting a short performance video. Talent matters more than location.',
  },
  {
    question: 'How does the selection process work?',
    answer: 'Players progress through a direct pathway — video auditions → zonal tournaments → nationwide league tournament. Performance at every stage decides selection.',
  },
  {
    question: 'What makes BRPL different from other cricket leagues?',
    answer: 'BRPL focuses on fair opportunity, real exposure and competitive intensity. It’s not just about participation — it’s about getting noticed and moving forward.',
  },
  {
    question: 'What do players gain beyond match experience?',
    answer: 'Players gain visibility, confidence, high-pressure match exposure and recognition within a structured cricket ecosystem designed to support long-term growth.',
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/faq.png"
          alt="Cricket background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background/60 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider uppercase bg-primary/20 border border-primary/40 rounded-full text-primary">
            FAQs
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Questions
            </span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Quick answers to the most common questions about training, batches, and enrollment.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto glass rounded-2xl p-6 md:p-8 border border-white/10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((item, idx) => (
              <AccordionItem
                key={item.question}
                value={`faq-${idx}`}
                className="glass-hover rounded-xl border border-white/10 px-4"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/75 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
