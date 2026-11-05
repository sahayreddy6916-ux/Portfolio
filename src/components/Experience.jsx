import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Briefcase, ArrowUpRight } from 'lucide-react';
import { EXPERIENCE_DATA } from '../data/portfolioData.js';

function TimelineItem({ item, index, total }) {
  const itemRef = useRef(null);
  const inView = useInView(itemRef, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`relative grid grid-cols-1 md:grid-cols-12 gap-8 items-start ${index !== total - 1 ? 'pb-16' : ''
        }`}
    >
      {/* Date & Company Column (Desktop Left) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="md:col-span-4 md:text-right space-y-1 pt-1"
      >
        <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider">
          {item.period}
        </span>
        <h4 className="text-base font-bold font-['Outfit'] text-white">
          {item.company}
        </h4>
        <p className="text-xs text-slate-400">{item.location}</p>
      </motion.div>

      {/* Center Activation Dot on the Timeline Line */}
      <div className="hidden md:flex md:col-span-1 justify-center relative pt-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative z-20 flex items-center justify-center"
        >
          {/* Pulsing ring on activation */}
          {inView && (
            <motion.div
              className="absolute w-7 h-7 rounded-full bg-amber-400/20"
              animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <div className={`w-3.5 h-3.5 rounded-full border-2 transition-colors duration-500 ${inView
            ? 'bg-amber-400 border-white shadow-md shadow-amber-400/50'
            : 'bg-slate-900 border-slate-700'
            }`} />
        </motion.div>
      </div>

      {/* Role & Accomplishments Card (Desktop Right) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:col-span-7 p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-amber-400/30 transition-all duration-300 relative group"
      >
        <h3 className="text-xl font-bold font-['Outfit'] text-white">
          {item.role}
        </h3>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          {item.summary}
        </p>

        {/* Highlights */}
        <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
          {item.highlights.map((highlight, hIdx) => (
            <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
              <span className="text-amber-400 mt-0.5">·</span>
              <span className="leading-relaxed">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Unboxed Tech Stack metadata */}
        <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="text-slate-400">STACK:</span>
          {item.tech.map((t, tIdx) => (
            <span key={t} className="text-slate-400">
              {t}{tIdx < item.tech.length - 1 && <span className="text-slate-600 ml-2">/</span>}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 35%']
  });

  return (
    <section id="experience" ref={containerRef} className="py-1 px-4 max-w-6xl mx-auto relative">
      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-wider uppercase mb-8">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span>Chronological Trajectory</span>
      </div>

      <div className="max-w-2xl mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight text-white">
          Designing, developing, and delivering modern web experiences.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
          Passionate about engineering interactive applications, optimizing rendering performance, and delivering intuitive user interfaces.
        </p>
      </div>

      <div className="relative">
        {/* Scroll-Linked Drawing Timeline Line (Desktop) */}
        <div className="hidden md:block absolute left-[33.333%] top-4 bottom-8 w-[2px] -translate-x-1/2 bg-slate-800 pointer-events-none">
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="w-full h-full bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 origin-top shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          />
        </div>

        <div className="space-y-4">
          {EXPERIENCE_DATA.map((item, index) => (
            <TimelineItem
              key={item.company + item.period}
              item={item}
              index={index}
              total={EXPERIENCE_DATA.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
