'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ELEMENT_COLORS } from './zodiacData'

export default function CharacterModal({
  sign,
  isOpen,
  onClose,
  onBeginJourney,
}) {
  if (!isOpen || !sign) return null

  const elemConfig = ELEMENT_COLORS[sign.element] || ELEMENT_COLORS.earth

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md select-none"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#110e17] border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center gap-8 text-white"
        >
          {/* Subtle Element Radial Halo in Background */}
          <div
            className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: elemConfig.halo }}
          />

          {/* Left Column: Large Character Card Preview */}
          <div className="relative shrink-0 flex flex-col items-center">
            {/* Double-sided card preview */}
            <div className="relative w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl">
              <Image
                src={`/models/character/tiles/tile_back_${sign.id}.png`}
                alt={sign.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 192px, 224px"
              />
            </div>

            {/* Her Sign Gold Badge */}
            {sign.isHerSign && (
              <div className="mt-3 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                <span>★</span>
                <span>Her Patron Sign</span>
                <span>★</span>
              </div>
            )}
          </div>

          {/* Right Column: Lore, Archetype & Actions */}
          <div className="flex-1 flex flex-col justify-between text-left">
            <div>
              {/* Element & Dates Tag */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${elemConfig.badge}`}
                >
                  {sign.element}
                </span>
                <span className="text-xs font-mono text-white/50 tracking-wide">
                  {sign.dates}
                </span>
              </div>

              {/* Character Name & Symbol */}
              <div className="flex items-baseline gap-3 mb-1">
                <h2
                  className="text-3xl sm:text-4xl font-serif font-normal tracking-wide text-white"
                  style={{ fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)' }}
                >
                  {sign.name}
                </h2>
                <span
                  className="text-2xl font-serif"
                  style={{ color: elemConfig.halo }}
                >
                  {sign.symbol}
                </span>
              </div>

              {/* Archetype Title */}
              <p className="text-sm sm:text-base text-amber-200/90 font-mono tracking-wide mb-4">
                {sign.title}
              </p>

              {/* Flavor Quote */}
              <blockquote className="text-sm sm:text-base italic font-serif text-white/90 border-l-2 border-amber-400/60 pl-3 mb-5 leading-relaxed">
                &ldquo;{sign.quote}&rdquo;
              </blockquote>

              {/* Story Description */}
              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed mb-4">
                {sign.description}
              </p>

              {/* Affinity Lore */}
              <div className="text-xs font-mono text-white/50 mb-8">
                <span className="text-amber-300/80 uppercase font-semibold">Affinity: </span>
                {sign.affinity}
              </div>
            </div>

            {/* Action Buttons (Solid styling, NO gradients) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
              {/* Solid Primary Button */}
              <button
                onClick={onBeginJourney}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✦</span>
                <span>Begin Journey</span>
                <span>✦</span>
              </button>

              {/* Solid Secondary Button */}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-white font-mono text-xs font-medium tracking-wider uppercase border border-white/20 transition-all cursor-pointer"
              >
                Choose Another Sign
              </button>
            </div>
          </div>

          {/* Close X Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer text-sm font-mono"
            aria-label="Close"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
