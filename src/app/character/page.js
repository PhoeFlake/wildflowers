'use client'

import { motion } from 'framer-motion'
import Link from 'framer-motion'

export default function CharacterSelectionPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#080616] via-[#150d2a] to-[#080514] text-white flex flex-col items-center justify-center select-none px-6">
      {/* Background Starfield & Subtle Nebula Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center z-10 mb-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80 font-mono mb-2">
          zodiac alignment
        </p>
        <h1
          className="text-3xl md:text-5xl font-serif tracking-wide text-white drop-shadow-lg"
          style={{ fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)' }}
        >
          Choose Your Character
        </h1>
        <p className="text-sm text-white/60 italic mt-2 font-light tracking-wider">
          The 12-Card Zodiac Selection Wheel is arriving next...
        </p>
      </motion.div>

      {/* Temporary navigation links for previewing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.0 }}
        className="flex items-center gap-4 z-10"
      >
        <a
          href="/title"
          className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white/80 hover:text-white transition-all shadow-md"
        >
          ← Back to Title (/title)
        </a>
        <a
          href="/enter"
          className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white/80 hover:text-white transition-all shadow-md"
        >
          ← Back to Door (/enter)
        </a>
      </motion.div>
    </main>
  )
}
