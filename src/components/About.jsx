import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData.js';

// One-time word-by-word reveal. Plays once when the paragraph enters the
// viewport, then stays fully visible. It is not tied to scroll position.
function RevealParagraph({ text, baseDelay = 0 }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <p className="text-xl sm:text-2xl lg:text-3xl font-normal font-['Outfit'] leading-relaxed tracking-tight">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={reduceMotion ? false : { opacity: 0.18, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: baseDelay + i * 0.03, duration: 0.4, ease: 'easeOut' }}
          className="inline-block mr-[0.28em] my-[0.08em] text-white"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export default function About() {
  const containerRef = useRef(null);

  // Scroll progress is now used only for the photo parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const manifesto1 =
    "I believe great software should do more than work—it should feel responsive, perform reliably under load, and be architecturally elegant.";
  const manifesto2 =
    "Over the past 3 years, my engineering practice has focused on bridging high-throughput UI systems and fluid, interactive user interfaces.";

  return (
    <section
      id="about"
      ref={containerRef}
      className="pt-6 pb-2 px-6 max-w-6xl mx-auto relative overflow-hidden"
    >
      <div className="flex items-center gap-2 text-[19px] font-mono text-amber-400 tracking-wider uppercase mb-8">
        <span className="w-4 h-4 rounded-full bg-amber-400" />
        <span>About & Creative Philosophy</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <RevealParagraph text={manifesto1} />
            {/* Second paragraph starts slightly after the first */}
            <RevealParagraph text={manifesto2} baseDelay={0.4} />
          </div>
        </div>

      </div>
    </section>
  );
}