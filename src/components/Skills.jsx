import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SKILLS_CATEGORIES } from '../data/portfolioData.js';

// Animated Count-Up Number
function CountUpNumber({ targetValue, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let start = 0;
    const duration = 1400; // ms
    const stepTime = 20; // 50 fps
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, targetValue]);

  return <span className="tabular-nums font-mono text-xs text-amber-400 font-semibold">{count}%</span>;
}

// Individual Skill Row with Bar & Bounce-in badge
function SkillItem({ skill, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
        type: 'spring',
        bounce: 0.35
      }}
      className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/30 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors font-['Outfit']">
            {skill.name}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">{skill.highlight}</p>
        </div>
        <CountUpNumber targetValue={skill.level} inView={inView} />
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-sm"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.15 + index * 0.08,
            ease: [0.16, 1, 0.3, 1]
          }}
        />
      </div>
    </motion.div>
  );
}

// Category Row sliding in alternately from left or right
function SkillCategoryRow({ categoryGroup, index }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: isLeft ? -70 : 70 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -70 : 70 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400">0{index + 1}.</span>
          <h3 className="text-lg font-bold font-['Outfit'] text-white">
            {categoryGroup.category}
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          {categoryGroup.skills.length} SPECIALIZATIONS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryGroup.skills.map((skill, sIdx) => (
          <SkillItem
            key={skill.name}
            skill={skill}
            index={sIdx}
            inView={inView}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="pt-17 pb-29 px-6 max-w-6xl mx-auto relative">
      <div className="flex items-center gap-2 text-2xs font-mono text-amber-400 tracking-wider uppercase mb-8">
        <span className="w-4 h-4 rounded-full bg-amber-400" />
        <span>Technical Concepts & Disciplines</span>
      </div>

      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight text-white">
          Designed to Think. Engineered to Perform.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
          From responsive user interfaces to scalable frontend architectures, every component is crafted with precision, performance, and seamless user experiences in mind.
        </p>
      </div>
      <div className="space-y-16">
        {SKILLS_CATEGORIES.map((categoryGroup, index) => (
          <SkillCategoryRow
            key={categoryGroup.category}
            categoryGroup={categoryGroup}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}