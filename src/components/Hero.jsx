import { useEffect, useRef } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import HangingIDCard from './HangingIDCard.jsx';

const EASE = [0.22, 1, 0.36, 1];

/* ---------- Animation variants (one orchestrated page-load sequence) ---------- */

// Parent: staggers the eyebrow, headline, paragraph, buttons and stats in order
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

// Eyebrow: wipes in from the left like a line being typed
const eyebrow = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  show: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

// Headline: each word slides up out of a mask
const headline = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const headlineWord = {
  hidden: { y: '110%', rotate: 3 },
  show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

// Paragraph: words fade in from a soft blur
const paragraph = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025 } },
};
const paragraphWord = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: EASE },
  },
};

// Buttons + stats
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const drawLine = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: EASE } },
};

/* ---------- Small helpers ---------- */

function HeadlineWords({ text }) {
  return text.split(' ').map((word, i) => (
    // The wrapper masks the word; the padding/negative margin keeps descenders (g, y) from being clipped
    <span
      key={i}
      className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.25em]"
    >
      <motion.span variants={headlineWord} className="inline-block will-change-transform">
        {word}
      </motion.span>
    </span>
  ));
}

function ParagraphWords({ text }) {
  return text.split(' ').map((word, i) => (
    <motion.span key={i} variants={paragraphWord} className="inline-block mr-[0.25em]">
      {word}
    </motion.span>
  ));
}

function CountUp({ to, suffix = '', delay = 1.5, reduceMotion }) {
  const value = useMotionValue(reduceMotion ? to : 0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (reduceMotion) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.6, delay, ease: EASE });
    return () => controls.stop();
  }, [to, delay, reduceMotion, value]);

  return (
    <span className="inline-flex">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

/* ---------- Component ---------- */

export default function Hero({ lenisInstance }) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Hero text scales down slightly and fades out as user scrolls through hero
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.6, 0.95], [1, 0.9, 0]);
  const heroTextScale = useTransform(scrollYProgress, [0, 0.6, 0.95], [1, 0.98, 0.92]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Scroll indicator disappears after first scroll
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 45], [1, 0]);
  const scrollIndicatorY = useTransform(scrollY, [0, 45], [0, 15]);

  const handleScrollClick = (target) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { offset: -70, duration: 1.2 });
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      // NOTE: no overflow-hidden here, so the swinging card is never clipped
      className="relative flex flex-col pt-28 pb-6 px-6 max-w-6xl mx-auto"
    >
      {/* Background ambient light: clipping lives here only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Split: Typography (Left) + Hanging ID Card (Right) */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8">
        {/* Left Column: the scroll-linked style stays on this wrapper,
            the load-in sequence runs through variants on its children */}
        <motion.div
          style={{
            opacity: heroTextOpacity,
            scale: heroTextScale,
            y: heroTextY,
          }}
          className="lg:col-span-7"
        >
          <motion.div
            variants={container}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            className="space-y-6"
          >
            {/* Eyebrow */}
            <motion.div
              variants={eyebrow}
              className="flex items-center gap-2 text-2xs font-mono text-amber-400 tracking-wider uppercase"
            >
              <span className="relative flex w-4 h-4">
                {!reduceMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-amber-400"
                    animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
                  />
                )}
                <span className="relative w-4 h-4 rounded-full bg-amber-400" />
              </span>
              <span>Creative UI Designs and Dashboards</span>
            </motion.div>

            {/* Headline: word-by-word mask reveal */}
            <motion.h1
              variants={headline}
              aria-label="Associate Software Engineer, Frontend"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Outfit'] tracking-tight text-white leading-[1.08] text-balance"
            >
              <span aria-hidden="true">
                <HeadlineWords text="Associate Software Engineer, Frontend" />
              </span>
            </motion.h1>

            {/* Intro paragraph: blur-in word stagger */}
            <motion.p
              variants={paragraph}
              aria-label="Hi, I’m K Sahay Kumar Reddy, an Associate Software Engineer. I don’t just build interfaces. I build worlds where math becomes motion and code becomes experience."
              className="text-xl text-slate-300 max-w-lg leading-relaxed"
            >
              <span aria-hidden="true">
                <ParagraphWords text="Hi, I’m K Sahay Kumar Reddy, an Associate Software Engineer. I don’t just build interfaces. I build worlds where math becomes motion and code becomes experience." />
              </span>
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleScrollClick('#projects')}
                className="group px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg flex items-center gap-2 shadow-lg shadow-amber-400/20 whitespace-nowrap cursor-pointer"
              >
                <span>Explore Selected Work</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => handleScrollClick('#contact')}
                className="group px-6 py-3 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Let's Connect</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>

            {/* Quantitative strip: divider draws in, number counts up */}
            <motion.div variants={fadeUp} className="pt-6 mt-2 max-w-lg relative">
              <motion.div
                variants={drawLine}
                className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white tabular-nums tracking-tight">
                    <CountUp to={1} suffix="+" reduceMotion={reduceMotion} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    Years Engineering Systems
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column: wider swing area, overflow visible so nothing is cut */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative overflow-visible lg:min-w-[420px]">
          <HangingIDCard heroProgress={scrollYProgress} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          opacity: scrollIndicatorOpacity,
          y: scrollIndicatorY,
        }}
        onClick={() => handleScrollClick('#about')}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Discover</span>
        <div className="w-5 h-8 rounded-full border border-slate-500 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-amber-400 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}