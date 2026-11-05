import { motion } from 'motion/react';

export default function Education() {
  return (
    <section id="education" className="py-5 px-4 max-w-6xl mx-auto relative">
      <div className="flex items-center gap-2 text-2xs font-mono text-amber-400 tracking-wider uppercase mb-8">
        <span className="w-4 h-4 rounded-full bg-amber-400" />
        <span>Academic Credentials & Distinctions</span>
      </div>

      <div className="max-w-2xl mb-12">
        <p className="text-xs sm:text-[24px] text-slate-400 mt-2">
          Theoretical Computer Science Paired With Practical Distributed Systems Architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
              <span>2023-2026</span>
              <span className="text-emerald-400 text-[11px] font-semibold">All Semester</span>
            </div>

            <h3 className="text-lg font-bold font-['Outfit'] text-white">
              Bachelor's of Science
            </h3>
            <p className="text-sm text-slate-300 font-medium mt-1">
              Khallikote Unitary University, Brahmapur, Odisha
            </p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              <strong>Specialization in Electronics and Telecommunications</strong><br />
              <strong>CGPA:</strong> 8.79
              <strong><br />Highest SGPA in the department:</strong> 9.28 in 3rd Semester.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}