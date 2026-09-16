'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * ElementalAuroraBackground:
 * Renders an ethereal, flowing aurora wave and velvety film grain texture
 * matching the exact organic reference in media_1789444083160.png (Image 3).
 */
export default function ElementalAuroraBackground({ element = 'Dendro' }) {
  const normElem = (element || 'Dendro').toLowerCase().trim()

  const theme = useMemo(() => {
    switch (normElem) {
      case 'pyro':
      case 'fire':
        return {
          base: '#070101',
          coreColor: '#ff3b30',
          midColor: '#ef4444',
          deepColor: '#5c0606',
          ambientHalo: '#b91c1c',
          highlight: '#ff9999',
        }
      case 'anemo':
      case 'air':
        return {
          base: '#010609',
          coreColor: '#00f0ff',
          midColor: '#0ea5e9',
          deepColor: '#03394a',
          ambientHalo: '#0284c7',
          highlight: '#a5f3fc',
        }
      case 'hydro':
      case 'water':
        return {
          base: '#02030d',
          coreColor: '#38bdf8',
          midColor: '#2563eb',
          deepColor: '#0b2759',
          ambientHalo: '#1d4ed8',
          highlight: '#93c5fd',
        }
      case 'dendro':
      case 'earth':
      default:
        return {
          base: '#020704',
          coreColor: '#00e676',
          midColor: '#10b981',
          deepColor: '#04421e',
          ambientHalo: '#059669',
          highlight: '#a7f3d0',
        }
    }
  }, [normElem])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 transition-colors duration-1000"
      style={{ backgroundColor: theme.base }}
    >
      {/* 1. Deep Ambient Atmospheric Foundation */}
      <div
        className="absolute inset-0 opacity-50 blur-[130px]"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 30% 60%, ${theme.deepColor} 0%, transparent 75%)`,
        }}
      />

      {/* 2. Luminous Flowing Aurora S-Curve Ribbon (Matching Image 3 Reference) */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 w-full h-full"
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-90 blur-[50px] sm:blur-[70px]"
        >
          <defs>
            <linearGradient id={`aurora-grad-${normElem}`} x1="0%" y1="70%" x2="100%" y2="20%">
              <stop offset="0%" stopColor={theme.ambientHalo} stopOpacity="0.3" />
              <stop offset="25%" stopColor={theme.coreColor} stopOpacity="0.95" />
              <stop offset="55%" stopColor={theme.midColor} stopOpacity="0.8" />
              <stop offset="85%" stopColor={theme.coreColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor={theme.deepColor} stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id={`aurora-core-${normElem}`} x1="0%" y1="70%" x2="100%" y2="20%">
              <stop offset="15%" stopColor={theme.highlight} stopOpacity="0" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="60%" stopColor={theme.highlight} stopOpacity="0.7" />
              <stop offset="90%" stopColor={theme.coreColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Broad Atmospheric Flow */}
          <path
            d="M -100 640 C 320 780, 520 480, 860 380 C 1180 280, 1340 120, 1600 60"
            stroke={`url(#aurora-grad-${normElem})`}
            strokeWidth="220"
            strokeLinecap="round"
            fill="none"
          />

          {/* Intense Core S-Curve Ribbon */}
          <path
            d="M -100 640 C 320 780, 520 480, 860 380 C 1180 280, 1340 120, 1600 60"
            stroke={`url(#aurora-core-${normElem})`}
            strokeWidth="60"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Ambient Radial Cloud Bloom for extra atmospheric depth */}
        <div
          className="absolute inset-0 opacity-80 blur-[80px]"
          style={{
            background: `
              radial-gradient(ellipse 55% 35% at 18% 68%, ${theme.coreColor} 0%, transparent 65%),
              radial-gradient(ellipse 65% 40% at 52% 44%, ${theme.midColor} 0%, transparent 68%),
              radial-gradient(ellipse 55% 35% at 88% 20%, ${theme.coreColor} 0%, transparent 65%)
            `,
          }}
        />
      </motion.div>

      {/* 3. High-Luminance Center Beam Ribbon */}
      <motion.div
        animate={{
          opacity: [0.7, 0.95, 0.7],
          rotate: [-14, -10, -14],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[130vw] h-[45vh] -left-[15vw] top-[32vh] opacity-75 blur-[60px] sm:blur-[80px]"
        style={{
          background: `linear-gradient(135deg, transparent 15%, ${theme.coreColor} 45%, ${theme.ambientHalo} 60%, transparent 85%)`,
          transformOrigin: 'center center',
        }}
      />

      {/* 4. Organic Fine Film Grain / Noise Overlay (Matching Image 3 tactile matte texture) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.22] mix-blend-overlay pointer-events-none">
        <filter id={`aurora-grain-${normElem}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.80"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#aurora-grain-${normElem})`} />
      </svg>
    </div>
  )
}
