import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, Copy, Check, Send, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.js';

export default function Contact({ lenisInstance }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    scope: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const { scrollY } = useScroll();
  const showBackToTop = useTransform(scrollY, [0, 400], [0, 1]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `New inquiry from ${formData.name} (${formData.email})`,
          from_name: formData.name,
          replyto: formData.email,
          name: formData.name,
          email: formData.email,
          scope: formData.scope || 'Not specified',
          message: formData.message
        })
      });

      const data = await res.json();
      console.log('Web3Forms response:', data);

      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Form error:', err);
      setError('Something went wrong. Please try again or email me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToTop = () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="pt-5 pb-16 px-6 max-w-6xl mx-auto relative">
      {/* Kicker */}
      <div className="flex items-center gap-2 text-2xs font-mono text-amber-400 tracking-wider uppercase mb-8">
        <span className="w-4 h-4 rounded-full bg-amber-400" />
        <span>Initiate Collaboration</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading scales up */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold font-['Outfit'] tracking-tight text-white leading-tight">
              Let's engineer something memorable together.
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Available for Principal Frontend Engineering roles, high-impact consulting, and frontend architecture advisory for spatial, interactive, and motion-driven web experiences.
            </p>
          </motion.div>

          {/* Direct Email Card with One-Click Copy */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="truncate">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Direct Inquiries</span>
                <span className="text-sm font-semibold text-white truncate block">{PERSONAL_INFO.email}</span>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Consultation Inquiry Form */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-['Outfit'] text-white">
                  Message Dispatched
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, {formData.name}. Your transmission has been queued. I will review your project brief and respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', scope: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-400">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Username.."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-400">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-400">
                    Engagement Scope
                  </label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950/70 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-300 transition-colors"
                  >
                    <option value="">Choose Project Category...</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Full-Stack Development">Full-Stack Development</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-400">
                    Project Overview & Timeline
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe your product goals, technical constraints, and anticipated launch windows..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.99] cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="font-mono text-xs">Dispatching Transmission...</span>
                  ) : (
                    <>
                      <span>Transmit Project Brief</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Floating Back to Top Button that appears after scrolling */}
      <motion.button
        style={{ opacity: showBackToTop }}
        onClick={handleBackToTop}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900/90 text-amber-400 border border-white/20 shadow-xl hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-md"
        title="Scroll to top"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </section>
  );
}