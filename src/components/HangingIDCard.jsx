import { useState, useRef } from 'react';
import {
  motion,
  animate,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
} from 'motion/react';
import { ShieldCheck, RefreshCw, Download, Github, Linkedin } from 'lucide-react';
// Put your photo in src/assets/images/ and match the filename here
import myPhoto from '../assets/images/my-photo.png';

// Put your real profile links here
const GITHUB_URL = 'https://github.com/sahayreddy6916-ux';
const LINKEDIN_URL = 'https://www.linkedin.com/in/k-sahay-kumar-reddy-a0573134a/';

// Tech stack shown on the front of the badge.
// Rendered as one pipe-separated line of text that wraps to fill the card.
const SKILLS = [
  'REACT', 'PYTHON', 'HTML', 'CSS', 'JAVASCRIPT',
  'TYPESCRIPT', 'NODE JS', 'GRAPHQL', 'TAILWIND CSS', 'NEXT.JS', 'AXIOS',
];

// One physical side of the badge (acrylic frame + dark inner card).
// Defined outside the component so it never remounts.
function BadgeFace({ children, back = false }) {
  return (
    <div
      className="col-start-1 row-start-1 relative w-[300px] sm:w-[330px] rounded-2xl p-2.5 bg-slate-900/80 border border-white/20 shadow-2xl shadow-black/80"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : undefined,
      }}
    >
      {/* Lanyard slot cutout at top */}
      <div className="w-12 h-2.5 mx-auto -mt-1 mb-2 bg-slate-950/90 rounded-full border border-white/30 shadow-inner flex items-center justify-center">
        <div className="w-4 h-1 bg-amber-400/60 rounded-full" />
      </div>

      <div className="relative w-full h-[calc(100%-1.25rem)] rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/10 p-5 overflow-hidden">
        {/* Holographic foil sheen */}
        <div className="absolute inset-0 holo-shimmer opacity-35 pointer-events-none mix-blend-overlay" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        {children}
      </div>
    </div>
  );
}

// True when the pointer is inside the given element's on-screen rectangle.
const isInside = (el, e) => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
};

export default function HangingIDCard({ heroProgress }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardRef = useRef(null);
  const pivotRef = useRef(null); // top of the whole assembly = swing pivot
  const cvRef = useRef(null); // the Download CV link on the back side
  const githubRef = useRef(null); // the GitHub link on the front side
  const linkedinRef = useRef(null); // the LinkedIn link on the front side

  // Flip animation (0 = front, 180 = back)
  const flipRotation = useMotionValue(0);
  const flipAnim = useRef(null);

  // Drag state
  const dragAngle = useMotionValue(0);
  const isDragging = useRef(false);
  const moved = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });
  const last = useRef({ angle: 0, t: 0, vel: 0 });
  const releaseAnim = useRef(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  // Scroll velocity drives the pendulum swing
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velocityAngle = useTransform(scrollVelocity, [-2000, 0, 2000], [16, 0, -16]);
  const pendulumRotation = useSpring(velocityAngle, {
    stiffness: 90,
    damping: 12,
    mass: 0.9,
  });

  // Hero exit: applied to the WHOLE assembly (strap + clasp + card)
  const groupY = useTransform(heroProgress, [0, 0.6, 1], [0, -30, -260]);
  const groupScale = useTransform(heroProgress, [0, 0.7, 1], [1, 0.96, 0.72]);
  const groupOpacity = useTransform(heroProgress, [0, 0.75, 1], [1, 0.95, 0]);

  // Single rotation shared by every piece: scroll swing + hover tilt + drag
  const finalRotateZ = useTransform(
    [pendulumRotation, springMouseX, dragAngle],
    ([pendulum, mouse, drag]) =>
      (Number(pendulum) || 0) + (Number(mouse) || 0) * 0.4 + (Number(drag) || 0)
  );

  // Card-only 3D tilt
  const rotateX = useTransform(springMouseY, [-20, 20], [12, -12]);
  const rotateY = useTransform(springMouseX, [-20, 20], [-12, 12]);

  // Shadow scale
  const shadowScaleX = useTransform(finalRotateZ, [-20, 20], [0.8, 1.2]);

  // Returns the link element under the pointer, or null.
  // Back side: Download CV. Front side: GitHub or LinkedIn.
  // Uses on-screen rectangles, so it works even if 3D transforms make the
  // browser report a different event target.
  const getLinkUnderPointer = (e) => {
    if (isFlipped) return isInside(cvRef.current, e) ? cvRef.current : null;
    if (isInside(githubRef.current, e)) return githubRef.current;
    if (isInside(linkedinRef.current, e)) return linkedinRef.current;
    return null;
  };

  // Flip the card with a spring animation
  const handleFlip = () => {
    const next = !isFlipped;
    setIsFlipped(next);
    flipAnim.current?.stop();
    flipAnim.current = animate(flipRotation, next ? 180 : 0, {
      type: 'spring',
      stiffness: 110,
      damping: 15,
      mass: 0.9,
    });
  };

  // Hover tilt (paused while dragging)
  const handleMouseMove = (e) => {
    if (isDragging.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const deltaY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    mouseX.set(deltaX * 14);
    mouseY.set(deltaY * 14);
  };

  const handleMouseLeave = () => {
    if (isDragging.current) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Drag to swing
  const handlePointerDown = (e) => {
    if (getLinkUnderPointer(e)) return; // over a link: no drag, no capture
    releaseAnim.current?.stop();
    isDragging.current = true;
    moved.current = false;
    startPt.current = { x: e.clientX, y: e.clientY };
    last.current = { angle: dragAngle.get(), t: performance.now(), vel: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    if (Math.hypot(e.clientX - startPt.current.x, e.clientY - startPt.current.y) > 4) {
      moved.current = true;
    }
    if (!moved.current || !pivotRef.current) return;

    const rect = pivotRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - rect.top;

    // Angle from the pivot to the pointer (negative = swing to the right)
    let angle = (-Math.atan2(dx, Math.max(dy, 40)) * 180) / Math.PI;
    angle = Math.max(-75, Math.min(75, angle));

    const now = performance.now();
    const dt = (now - last.current.t) / 1000;
    if (dt > 0) last.current.vel = (angle - last.current.angle) / dt;
    last.current.angle = angle;
    last.current.t = now;

    dragAngle.set(angle);
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (!moved.current) return;

    // Don't inherit stale velocity if the pointer was held still before release
    const idle = performance.now() - last.current.t > 80;
    releaseAnim.current = animate(dragAngle, 0, {
      type: 'spring',
      stiffness: 45,
      damping: 4.5, // lower = more swings, higher = settles faster
      velocity: idle ? 0 : last.current.vel,
    });

    // Let the click event fire first (it will be ignored), then reset the flag
    setTimeout(() => {
      moved.current = false;
    }, 0);
  };

  // Card click: flip everywhere EXCEPT over a link (CV, GitHub, LinkedIn)
  const handleCardClick = (e) => {
    const link = getLinkUnderPointer(e);
    if (link) {
      // If the browser sent this click to the card instead of the link,
      // trigger it ourselves. (A click that reached the link directly never
      // gets here, because the link stops propagation.)
      link.click();
      return;
    }
    if (!moved.current) handleFlip();
  };

  return (
    // OUTER: hero exit for everything together, also the swing pivot reference
    <motion.div
      ref={pivotRef}
      className="relative flex flex-col items-center select-none"
      style={{ y: groupY, scale: groupScale, opacity: groupOpacity }}
    >
      {/* PENDULUM: the ONLY rotateZ, pivoting at the top of the strap */}
      <motion.div
        className="flex flex-col items-center"
        style={{ rotateZ: finalRotateZ, transformOrigin: 'top center' }}
      >
        {/* Lanyard strap */}
        <div className="w-8 h-40 bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 border-x border-amber-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,#000_0px,#000_2px,transparent_2px,transparent_4px)]" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-amber-400/40 via-amber-400 to-amber-600/60" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-widest text-amber-300/80 uppercase rotate-90 origin-center whitespace-nowrap">
            SYSTEMS ARCHITECT
          </div>
        </div>

        {/* Clasp & ring */}
        <div className="relative z-20 -mt-1 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-gradient-to-tr from-slate-500 to-slate-200 shadow-md" />
          <div className="w-3.5 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-xs shadow-inner -mt-1" />
          <div className="w-6 h-6 bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 rounded-b-md shadow-md flex items-center justify-center -mt-0.5 border border-slate-400/40">
            <div className="w-1.5 h-3 bg-slate-700/60 rounded-full" />
          </div>
        </div>

        {/* THE CARD: hover tilt + drag + click */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative z-10 cursor-grab active:cursor-grabbing"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1200,
            transformOrigin: 'top center',
            touchAction: 'none',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          title="Click to flip, drag to swing"
          onClick={handleCardClick}
        >
          {/* FLIP CONTAINER: this is what actually turns around */}
          <motion.div
            className="grid"
            style={{
              rotateY: flipRotation,
              transformStyle: 'preserve-3d',
              transformPerspective: 1400,
              transformOrigin: 'center center',
            }}
          >
            {/* FRONT SIDE */}
            <BadgeFace>
              <div className="relative z-10 space-y-4">
                {/* Portrait + Core Bio */}
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-white/20 shadow-md shrink-0 bg-slate-800">
                    {/* Use object-top instead of object-center if your head gets cut off */}
                    <img
                      src={myPhoto}
                      alt="K Sahay Kumar Reddy"
                      draggable={false}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-1 right-1 p-0.5 bg-black/60 rounded">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 pt-1">
                    <h2 className="text-sm font-bold font-['Outfit'] text-white tracking-tight">
                      K Sahay Kumar Reddy
                    </h2>
                    <p className="text-xs text-amber-300 font-medium leading-snug">
                      Associate Software Engineer, Frontend
                    </p>
                    <div className="pt-2 text-[10px] font-mono space-y-0.5 text-slate-400">
                      <p>
                        <span className="text-slate-500">REGION:</span> BANGALORE, KARNATAKA
                      </p>
                      <p>
                        <span className="text-slate-500">VALID:</span> 2026 — FOREVER
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech stack */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono tracking-widest text-amber-400">
                      TECH STACK
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {SKILLS.length} MODULES
                    </span>
                  </div>

                  <p className="text-[10px] font-mono leading-[1.9] text-slate-300 text-justify">
                    {SKILLS.map((skill, i) => (
                      <span key={skill}>
                        <span className="whitespace-nowrap">{skill}</span>
                        {i < SKILLS.length - 1 && (
                          <span className="text-amber-400/70"> | </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Chip & Social Section */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="w-9 h-7 rounded bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border border-amber-300 shadow-sm relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-[1px] bg-amber-800/60 absolute top-2" />
                    <div className="w-full h-[1px] bg-amber-800/60 absolute bottom-2" />
                    <div className="h-full w-[1px] bg-amber-800/60 absolute left-3" />
                    <div className="h-full w-[1px] bg-amber-800/60 absolute right-3" />
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      ref={githubRef}
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open GitHub profile"
                      title="GitHub"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 p-2 rounded bg-white/5 border border-white/10 text-slate-300 cursor-pointer transition-colors duration-200 hover:bg-white/15 hover:border-white/40 hover:text-white"
                    >
                      <Github className="w-5 h-5" />
                    </a>

                    <a
                      ref={linkedinRef}
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open LinkedIn profile"
                      title="LinkedIn"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 p-2 rounded bg-white/5 border border-white/10 text-slate-300 cursor-pointer transition-colors duration-200 hover:bg-[#0A66C2]/30 hover:border-[#0A66C2] hover:text-white"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Flip hint */}
                <div className="flex items-center justify-center gap-1.5 pt-1 text-[9px] font-mono text-slate-500">
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Click to flip</span>
                </div>
              </div>
            </BadgeFace>

            {/* BACK SIDE (stretches to match the taller front) */}
            <BadgeFace back>
              <div className="relative z-10 h-full flex flex-col py-1">
                <div className="shrink-0 w-[calc(100%+2.5rem)] h-9 -mx-5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-y border-white/10 mb-3 shadow-inner" />

                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-400 leading-relaxed">
                    <p className="text-amber-400 font-semibold mb-1">
                      UI Engineering | Secure Token & Access Control
                    </p>
                    <p>
                      I’ve been with Autocrat Engineers for over a year, working on UI Designs and
                      Dashboards, React-based web applications and enjoy building scalable,
                      reliable solutions.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <span className="text-slate-500 block">EXPERIENCE:</span>
                      <span className="text-white font-mono">1+ YEARS</span>
                    </div>

                    {/* DOWNLOAD CV: clicking here downloads and never flips the card */}
                    <a
                      ref={cvRef}
                      href="/resume.pdf"
                      download="K-Sahay-Kumar-Reddy-Resume.pdf"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 block p-2 rounded border border-amber-400/40 bg-amber-400/10 cursor-pointer transition-colors duration-200 hover:bg-amber-400/20 hover:border-amber-400"
                    >
                      <span className="text-slate-400 block">DOWNLOAD CV:</span>
                      <span className="text-amber-400 font-mono inline-flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Resume.pdf
                      </span>
                    </a>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-[9px] font-mono text-slate-500">
                      RETURN TO AUTHORIZED PERSONNEL ONLY
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-[9px] font-mono text-amber-400">
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Click to flip</span>
                    </div>
                  </div>
                </div>
              </div>
            </BadgeFace>
          </motion.div>

          {/* Ambient shadow that shifts with the swing */}
          <motion.div
            className="w-48 h-6 bg-black/70 rounded-full blur-xl mx-auto -mt-2 pointer-events-none"
            style={{ scaleX: shadowScaleX }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}