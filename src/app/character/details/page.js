"use client"

import { Suspense, useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { getCharacterDetails } from "@/components/character/characterDetailsData"
import { ZODIAC_SIGNS, ELEMENT_COLORS } from "@/components/character/zodiacData"
import ZodiacGlyph from "@/components/character/ZodiacGlyph"
import ElementalAuroraBackground from "@/components/character/ElementalAuroraBackground"

/**
 * Helper to highlight key lore keywords (Character, Sign, Clovers, Traveler, Portfolio)
 * Zero emojis - pure typography and radiant glowing styles.
 */
function HighlightText({ text, charName, signName, elementColor }) {
  if (!text) return null

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const terms = [
    { type: "char", pattern: escapeRegExp(charName) },
    { type: "sign", pattern: escapeRegExp(signName) },
    { type: "clovers", pattern: "four-leaf clovers?" },
    { type: "traveler", pattern: "Traveler" },
    { type: "portfolio", pattern: "Drishti's Portfolio" },
  ].filter((t) => Boolean(t.pattern))

  const fullRegex = new RegExp(`(${terms.map((t) => t.pattern).join("|")})`, "gi")
  const parts = text.split(fullRegex)

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null
        const lower = part.toLowerCase()

        if (lower === charName.toLowerCase()) {
          return (
            <span
              key={index}
              className="font-bold tracking-wide transition-colors"
              style={{
                color: elementColor || "#f59e0b",
                textShadow: `0 0 10px ${elementColor}99, 0 2px 4px rgba(0,0,0,0.95)`,
              }}
            >
              {part}
            </span>
          )
        }

        if (lower === signName.toLowerCase()) {
          return (
            <span
              key={index}
              className="font-bold text-amber-300"
              style={{
                textShadow: "0 0 10px rgba(251,191,36,0.7), 0 2px 4px rgba(0,0,0,0.95)",
              }}
            >
              {part}
            </span>
          )
        }

        if (lower.includes("four-leaf clover")) {
          return (
            <span
              key={index}
              className="font-semibold text-emerald-300"
              style={{
                textShadow: "0 0 10px rgba(52,211,153,0.8), 0 2px 4px rgba(0,0,0,0.95)",
              }}
            >
              {part}
            </span>
          )
        }

        if (lower === "traveler") {
          return (
            <span
              key={index}
              className="font-semibold text-amber-200"
              style={{
                textShadow: "0 0 8px rgba(253,224,71,0.7), 0 2px 4px rgba(0,0,0,0.95)",
              }}
            >
              {part}
            </span>
          )
        }

        if (lower === "drishti's portfolio") {
          return (
            <span
              key={index}
              className="font-bold text-amber-300 underline decoration-amber-400/60 underline-offset-4"
              style={{
                textShadow: "0 0 12px rgba(251,191,36,0.9), 0 2px 4px rgba(0,0,0,0.95)",
              }}
            >
              {part}
            </span>
          )
        }

        return <span key={index}>{part}</span>
      })}
    </>
  )
}

function CharacterDetailsView({ signId }) {
  const char = useMemo(() => getCharacterDetails(signId), [signId])
  const zodiacSign = useMemo(
    () => ZODIAC_SIGNS.find((s) => s.id === char.signId) || ZODIAC_SIGNS[1],
    [char.signId]
  )
  const elemConfig = ELEMENT_COLORS[zodiacSign.element] || ELEMENT_COLORS.earth

  // Experience state
  const [phase, setPhase] = useState("video") // "video" | "namecard"
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(true)
  const [dialogueStage, setDialogueStage] = useState(0) // 0, 1, 2
  const [typedCharCount, setTypedCharCount] = useState(0)
  const [isTransitioningStage, setIsTransitioningStage] = useState(false)
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const [showFlash, setShowFlash] = useState(true)

  const videoRef = useRef(null)
  const musicRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const pointerDownPos = useRef({ x: 0, y: 0 })

  // Handle Autoplay for Video with polite mute fallback
  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      videoRef.current.currentTime = 0
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented: mute and play
          setIsVideoMuted(true)
          if (videoRef.current) {
            videoRef.current.muted = true
            videoRef.current.play().catch(() => {})
          }
        })
      }
    }
  }, [phase, char.videoSrc])

  // Transition from Video to Namecard
  const handleSkipOrEndVideo = () => {
    setShowFlash(true)
    setPhase("namecard")
    setIsOpeningAnimation(true)
    setDialogueStage(0)
    setTypedCharCount(0)

    // Allow center-morph opening animation to play for 1s before typewriter begins
    setTimeout(() => {
      setIsOpeningAnimation(false)
    }, 950)
  }

  // Handle background theme music in Namecard phase
  useEffect(() => {
    if (phase === "namecard" && musicRef.current) {
      musicRef.current.volume = 0.35
      if (!isMusicMuted) {
        musicRef.current.play().catch(() => {})
      } else {
        musicRef.current.pause()
      }
    } else if (musicRef.current) {
      musicRef.current.pause()
    }
  }, [phase, isMusicMuted, char.musicSrc])

  // Current stage paragraphs
  const currentStageData = char.dialogue[dialogueStage] || char.dialogue[0]
  const currentParagraphs = currentStageData.paragraphs

  // Total characters for the active stage
  const totalStageChars = useMemo(() => {
    return currentParagraphs.reduce((sum, p) => sum + p.length, 0)
  }, [currentParagraphs])

  const isTypingComplete = typedCharCount >= totalStageChars

  // Typewriter ticker
  useEffect(() => {
    if (phase !== "namecard") return
    if (isOpeningAnimation) return
    if (isTransitioningStage) return
    if (isTypingComplete) return

    const timer = setInterval(() => {
      setTypedCharCount((prev) => {
        const next = prev + 1
        if (next >= totalStageChars) {
          clearInterval(timer)
          return totalStageChars
        }
        return next
      })
    }, 24)

    return () => clearInterval(timer)
  }, [phase, isOpeningAnimation, isTransitioningStage, isTypingComplete, totalStageChars])

  // Auto-scroll as text types (respects manual scroll-up)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 70
      if (isNearBottom || typedCharCount < 15) {
        el.scrollTop = el.scrollHeight
      }
    }
  }, [typedCharCount])

  // Advance dialogue or skip typing for current stage
  const handleAdvanceDialogue = () => {
    if (isOpeningAnimation || isTransitioningStage) return

    if (!isTypingComplete) {
      // Instantly reveal complete text for this stage
      setTypedCharCount(totalStageChars)
      return
    }

    if (dialogueStage < char.dialogue.length - 1) {
      // Crossfade to next stage
      setIsTransitioningStage(true)
      setTimeout(() => {
        setDialogueStage((s) => s + 1)
        setTypedCharCount(0)
        setIsTransitioningStage(false)
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0
        }
      }, 300)
    }
  }

  // Keyboard accessibility: Space or Enter advances dialogue
  useEffect(() => {
    if (phase !== "namecard") return

    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault()
        handleAdvanceDialogue()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  // Calculate paragraph text slices for typewriter effect immutably
  const paragraphSlices = useMemo(() => {
    let cumulative = 0
    const result = []
    for (const p of currentParagraphs) {
      const start = cumulative
      const end = cumulative + p.length
      cumulative = end
      if (typedCharCount <= start) {
        result.push("")
      } else if (typedCharCount >= end) {
        result.push(p)
      } else {
        result.push(p.slice(0, typedCharCount - start))
      }
    }
    return result
  }, [currentParagraphs, typedCharCount])

  // Replay cutscene handler
  const handleReplayCutscene = () => {
    setShowFlash(true)
    setPhase("video")
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <div
      className="relative min-h-screen w-screen text-white overflow-x-hidden select-none font-sans flex flex-col justify-between transition-colors duration-1000 bg-transparent"
    >
      {/* Organic Ethereal Aurora Wave & Tactile Film Grain Background matching Image 3 for all 4 elements */}
      <ElementalAuroraBackground element={char.element} />
      {/* Background Theme Audio */}
      {char.musicSrc && (
        <audio ref={musicRef} src={char.musicSrc} loop preload="auto" />
      )}

      {/* Seamless White Flash Transition */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            onAnimationComplete={() => setShowFlash(false)}
            className="fixed inset-0 bg-white pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* PHASE 1: FULLSCREEN CINEMATIC CHARACTER VIDEO                             */}
      {/* ========================================================================= */}
      {phase === "video" && (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={char.videoSrc}
            playsInline
            autoPlay
            muted={isVideoMuted}
            onEnded={handleSkipOrEndVideo}
            className="w-full h-full object-contain md:object-cover"
          />

          {/* Top Bar Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
            {/* Character & Zodiac Badge (Zero Emojis, Pure SVG Glyph) */}
            <div className="flex items-center gap-3">
              <ZodiacGlyph
                sign={char.signId}
                className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-serif tracking-widest uppercase text-white font-bold">
                  {char.characterName}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-white/60">
                  {char.signName} • {char.element}
                </span>
              </div>
              {char.isPatronSign && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-[10px] font-bold tracking-widest uppercase">
                  Patron Sign
                </span>
              )}
            </div>

            {/* Audio & Skip Actions (Zero Emojis, Clean SVGs) */}
            <div className="flex items-center gap-3">
              {/* Sound Toggle SVG */}
              <button
                type="button"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-amber-400 text-xs font-mono text-white/90 hover:text-amber-300 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                title={isVideoMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isVideoMuted ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
                <span className="hidden sm:inline font-mono text-[11px]">{isVideoMuted ? "UNMUTE" : "MUTE"}</span>
              </button>

              {/* Genshin Skip Button */}
              <button
                type="button"
                onClick={handleSkipOrEndVideo}
                className="group px-4 py-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-amber-400 text-xs font-mono tracking-wider text-white hover:text-amber-300 transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span className="font-mono text-[11px] tracking-wider font-semibold">SKIP</span>
                <svg className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <polygon points="13 4 23 12 13 20 13 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: NAMECARD CENTER-MORPH OPENING & GENSHIN DIALOGUE                */}
      {/* ========================================================================= */}
      {phase === "namecard" && (
        <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 md:p-10 z-10">
          {/* Top Header Bar */}
          <header className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto mb-4">
            <Link
              href="/character"
              className="group px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-xs font-mono tracking-wider text-white/80 hover:text-white transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <span className="text-amber-400 group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
              <span>Sanctuary</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Music Toggle SVG */}
              {char.musicSrc && (
                <button
                  type="button"
                  onClick={() => setIsMusicMuted(!isMusicMuted)}
                  className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-xs font-mono text-white/80 hover:text-amber-300 transition-all cursor-pointer"
                  title={isMusicMuted ? "Play Theme Music" : "Pause Theme Music"}
                >
                  {isMusicMuted ? (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  )}
                </button>
              )}

              {/* Element Badge */}
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${char.elementBadge}`}
              >
                {char.element}
              </span>

              {char.isPatronSign && (
                <span className="hidden md:inline-block px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold tracking-widest uppercase">
                  Patron Sign
                </span>
              )}
            </div>
          </header>

          {/* Center Stage: The Namecard Frame with Morphing Reveal */}
          <main className="relative z-20 flex-1 flex flex-col items-center justify-center my-auto w-full max-w-5xl mx-auto">
            {/* Center-morphing container */}
            <motion.div
              key={`${char.signId}-namecard-frame`}
              initial={{
                scaleX: 0.02,
                scaleY: 0.85,
                opacity: 0,
                filter: "brightness(2.2)",
              }}
              animate={{
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                filter: "brightness(1)",
              }}
              transition={{
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full aspect-[1818/865] min-h-[460px] sm:min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] select-none bg-black flex"
            >
              {/* Vertical Radiant Seam during opening */}
              <motion.div
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: [0, 1.2, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] bg-gradient-to-b from-transparent via-amber-200 to-transparent shadow-[0_0_30px_#fde047] pointer-events-none z-30"
              />

              {/* Namecard Background Artwork */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={char.namecardSrc}
                  alt={`${char.characterName} Namecard`}
                  fill
                  priority
                  className="object-cover object-left sm:object-center"
                />
              </div>

              {/* Genshin dialogue box positioned on the right half (empty space) */}
              <div
                onPointerDown={(e) => {
                  pointerDownPos.current = { x: e.clientX, y: e.clientY }
                }}
                onPointerUp={(e) => {
                  // If user dragged to scroll, don't advance dialogue
                  const dist = Math.hypot(
                    e.clientX - pointerDownPos.current.x,
                    e.clientY - pointerDownPos.current.y
                  )
                  if (dist < 6) {
                    handleAdvanceDialogue()
                  }
                }}
                className="absolute left-[38%] sm:left-[43%] md:left-[45%] right-3 sm:right-6 md:right-8 top-3 sm:top-5 md:top-6 bottom-3 sm:bottom-5 md:bottom-6 z-20 flex flex-col justify-between p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-black/60 backdrop-blur-[4px] border border-white/15 hover:border-amber-400/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-300 overflow-hidden group"
              >
                {/* Dialogue Header: Stage & Status Indicator (Fixed top) */}
                <div className="flex-shrink-0 flex items-center justify-between pb-2 border-b border-white/10 text-[10px] sm:text-xs font-mono tracking-widest text-amber-300/80 uppercase select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm text-amber-300">✦</span>
                    <span>{char.characterName}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{char.signName}</span>
                  </div>

                  {/* Stage Progress Pills */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[0, 1, 2].map((s) => (
                      <span
                        key={s}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                          s === dialogueStage
                            ? "bg-amber-400 scale-125 shadow-[0_0_8px_#fbbf24]"
                            : s < dialogueStage
                              ? "bg-amber-400/50"
                              : "bg-white/20"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-[10px] text-white/50">
                      {dialogueStage + 1}/3
                    </span>
                  </div>
                </div>

                {/* Dialogue Body with Dedicated Working Scroll & Golden Scrollbar */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 min-h-0 overflow-y-auto my-2 sm:my-3 pr-2 flex flex-col justify-start"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(251, 191, 36, 0.4) transparent",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!isTransitioningStage && (
                      <motion.div
                        key={`stage-${dialogueStage}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className={`font-genshin text-white text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] tracking-wide select-none pb-4 ${
                          dialogueStage === 1
                            ? "leading-[1.65] sm:leading-[1.75]"
                            : "leading-relaxed sm:leading-loose"
                        }`}
                        style={{
                          fontFamily: "'GenshinFont', -apple-system, sans-serif",
                          textShadow:
                            "0 2px 4px rgba(0,0,0,0.98), 0 0 12px rgba(0,0,0,0.85)",
                        }}
                      >
                        {paragraphSlices.map((slice, idx) => {
                          if (!slice && idx > 0) return null
                          return (
                            <p
                              key={idx}
                              className={
                                dialogueStage === 1
                                  ? "my-1 sm:my-1.5"
                                  : "my-2.5 sm:my-3.5"
                              }
                            >
                              {slice.split("\\n").map((line, lineIdx, arr) => (
                                <span key={lineIdx}>
                                  <HighlightText
                                    text={line}
                                    charName={char.characterName}
                                    signName={char.signName}
                                    elementColor={char.elementColor}
                                  />
                                  {lineIdx < arr.length - 1 && <br />}
                                </span>
                              ))}
                              {/* Show blinking caret on the active typing line */}
                              {!isTypingComplete &&
                                idx ===
                                  paragraphSlices.filter((s) => s.length > 0).length -
                                    1 && (
                                  <span className="inline-block w-1.5 h-3.5 sm:h-4 bg-amber-400 ml-1 animate-pulse align-middle" />
                                )}
                            </p>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dialogue Footer: Genshin Advance Indicator (Fixed bottom) */}
                <div className="flex-shrink-0 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50 select-none">
                  <span className="hidden sm:inline">
                    {!isTypingComplete
                      ? "Click or Space to reveal"
                      : dialogueStage < 2
                        ? "Click or Space to continue"
                        : "✦ Blessing Received ✦"}
                  </span>

                  {/* Pulsing Next Icon */}
                  <div className="flex items-center gap-1.5 ml-auto text-amber-300 font-bold">
                    {dialogueStage < 2 ? (
                      <motion.div
                        animate={{ y: [0, 3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          ease: "easeInOut",
                        }}
                        className="flex items-center gap-1"
                      >
                        <span className="text-[11px] font-sans">Next</span>
                        <span className="text-xs">▼</span>
                      </motion.div>
                    ) : (
                      <span className="text-amber-300 animate-pulse">◆ Complete</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Actions upon Stage 3 Completion */}
            <AnimatePresence>
              {dialogueStage === 2 && isTypingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 z-30"
                >
                  {/* Enter Drishti's Portfolio CTA */}
                  <Link
                    href="/enter"
                    className="px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(251,191,36,0.45)] hover:shadow-[0_0_40px_rgba(251,191,36,0.7)] flex items-center gap-2 cursor-pointer border border-amber-200"
                  >
                    <span>✦</span>
                    <span>Enter Drishti&apos;s Portfolio</span>
                    <span>✦</span>
                  </Link>

                  {/* Replay Cinematic Video */}
                  <button
                    type="button"
                    onClick={handleReplayCutscene}
                    className="px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-amber-400 text-white hover:text-amber-300 font-mono text-xs font-semibold tracking-wider uppercase transition-all shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>↺</span>
                    <span>Replay Cutscene</span>
                  </button>

                  {/* Return to Sanctuary */}
                  <Link
                    href="/character"
                    className="px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-amber-400 text-white/80 hover:text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>←</span>
                    <span>Sanctuary</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
    </div>
  )
}

function CharacterDetailsContent() {
  const searchParams = useSearchParams()
  const signId = searchParams.get("sign") || "taurus"

  return <CharacterDetailsView key={signId} signId={signId} />
}

export default function CharacterDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#05040a] flex items-center justify-center text-amber-300 font-mono text-xs">
          Aligning Celestial Embodiment...
        </div>
      }
    >
      <CharacterDetailsContent />
    </Suspense>
  )
}
