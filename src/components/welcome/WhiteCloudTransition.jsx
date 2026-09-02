'use client'

import { motion } from 'framer-motion'

export default function WhiteCloudTransition({ active = false }) {
  if (!active) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 pointer-events-auto overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f4f8fc 60%, #eaf1f9 100%)',
      }}
    >
      {/* Soft celestial god rays / light bloom */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,1) 0%, rgba(210,230,255,0.4) 50%, transparent 80%)'
        }}
      />

      {/* Cloud Layer 1 - Background large soft clouds drifting slowly */}
      <motion.div
        animate={{ x: [-80, 80, -80] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-12 -left-20 w-[140vw] h-[60vh] opacity-70 pointer-events-none"
        style={{ filter: 'blur(28px)' }}
      >
        <svg viewBox="0 0 1200 400" className="w-full h-full fill-white">
          <path d="M150,300 Q200,120 380,180 Q450,80 620,130 Q780,50 900,160 Q1050,110 1150,260 Q1200,380 950,380 L100,380 Z" />
        </svg>
      </motion.div>

      {/* Cloud Layer 2 - Midground fluffy cumulus clouds */}
      <motion.div
        animate={{ x: [60, -60, 60] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -right-16 w-[120vw] h-[55vh] opacity-85 pointer-events-none"
        style={{ filter: 'blur(16px)' }}
      >
        <svg viewBox="0 0 1100 400" className="w-full h-full fill-white">
          <path d="M80,320 Q160,160 320,200 Q420,100 580,140 Q700,60 840,150 Q960,120 1060,250 L1060,390 L80,390 Z" />
        </svg>
      </motion.div>

      {/* Cloud Layer 3 - Lower floating billowing clouds */}
      <motion.div
        animate={{ x: [-40, 40, -40], y: [0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-16 -left-10 w-[130vw] h-[65vh] opacity-95 pointer-events-none"
        style={{ filter: 'blur(10px)' }}
      >
        <svg viewBox="0 0 1200 500" className="w-full h-full fill-[#fafdff]">
          <path d="M50,450 Q120,220 280,260 Q380,140 560,190 Q680,100 860,180 Q1000,130 1140,290 L1180,500 L20,500 Z" />
        </svg>
      </motion.div>

      {/* Cloud Layer 4 - Foreground crisp floating puffy clouds */}
      <motion.div
        animate={{ x: [30, -30, 30], y: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 w-[110vw] h-[45vh] opacity-90 pointer-events-none"
        style={{ filter: 'blur(4px)' }}
      >
        <svg viewBox="0 0 1000 350" className="w-full h-full fill-white">
          <path d="M0,350 Q100,180 250,220 Q360,130 520,170 Q660,90 800,180 Q920,140 1000,260 L1000,350 Z" />
        </svg>
      </motion.div>

      {/* Luminous anime atmospheric glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.4) 60%, transparent 100%)'
        }}
      />

      {/* Serene atmospheric subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.2 }}
        className="relative z-10 text-center font-mono text-xs tracking-[0.35em] text-sky-900/60 uppercase"
      >
        ✦ The Sky Beyond ✦
      </motion.div>
    </motion.div>
  )
}
