import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Education from './components/Education.jsx';
import Contact from './components/Contact.jsx';
import ProjectModal from './components/ProjectModal.jsx';

export default function App() {
  const [lenisInstance, setLenisInstance] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress Bar
  const { scrollYProgress, scrollY } = useScroll();

  // Subtle Parallax Background Orbs
  const orb1Y = useTransform(scrollY, [0, 4000], [0, -450]);
  const orb2Y = useTransform(scrollY, [0, 4000], [0, 350]);
  const orb3Y = useTransform(scrollY, [0, 4000], [0, -250]);

  // Initialize Lenis Smooth Inertia Scrolling
  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  // Section Observer for Active Navigation Highlighting
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'experience', 'education', 'contact'];
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 relative selection:bg-amber-400/20 selection:text-white">
      {/* 1. Global Animated Scroll Progress Bar at the top */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0%',
        }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 z-50 shadow-[0_0_12px_rgba(245,158,11,0.7)]"
      />

      {/* 2. Parallax Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-dots opacity-30" />

        <motion.div
          style={{ y: orb1Y }}
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.08] rounded-full blur-[140px]"
        />
        <motion.div
          style={{ y: orb2Y }}
          className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[160px]"
        />
        <motion.div
          style={{ y: orb3Y }}
          className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-violet-600/[0.06] rounded-full blur-[150px]"
        />
      </div>

      {/* 3. Top Navigation */}
      <Navbar lenisInstance={lenisInstance} activeSection={activeSection} />

      {/* 4. Content Flow */}
      <main className="relative z-10">
        <Hero lenisInstance={lenisInstance} />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Contact lenisInstance={lenisInstance} />
      </main>

      {/* 5. Project Detail Inspection Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}