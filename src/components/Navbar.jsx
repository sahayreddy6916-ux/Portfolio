import { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.js';

export default function Navbar({ lenisInstance, activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      // Background glass effect threshold
      setIsScrolled(latest > 40);

      // Hide on scroll down, show on scroll up
      if (latest > 120) {
        if (latest > lastScrollY.current && latest - lastScrollY.current > 6) {
          setIsVisible(false);
        } else if (latest < lastScrollY.current && lastScrollY.current - latest > 6) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = latest;
    });
  }, [scrollY]);

  const navItems = [
    { label: 'About', target: '#about' },
    { label: 'Skills', target: '#skills' },
    { label: 'Experience', target: '#experience' },
    { label: 'Projects', target: '#projects' },
    { label: 'Education', target: '#education' },
  ];

  const handleNavClick = (e, target) => {
    e.preventDefault();
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { offset: -70, duration: 1.2 });
    } else {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
        : 'py-6 bg-transparent border-b border-transparent'
        }`}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* justify-end pushes the whole group (name + links + button) to the right */}
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-end gap-8 lg:gap-10">
        {/* Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 group-hover:rotate-45 transition-transform duration-300"></span>
          <span className="font-['Outfit'] tracking-wide">K Sahay Kumar Reddy</span>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const sectionId = item.target.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.target}
                href={item.target}
                onClick={(e) => handleNavClick(e, item.target)}
                className={`relative whitespace-nowrap shrink-0 transition-colors py-1 ${isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-200"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-md flex items-center gap-1.5 shadow-sm shadow-amber-400/20 whitespace-nowrap shrink-0"
          >
            <span>Initiate Contact</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}