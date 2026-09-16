"use client"

/**
 * Pure SVG Zodiac astronomical glyphs.
 * Prevents mobile browsers (iOS / macOS) from replacing symbols with colored Apple emojis.
 */
export default function ZodiacGlyph({ sign, className = "w-6 h-6", style = {} }) {
  const normalized = (sign || "taurus").toLowerCase().trim()

  const glyphProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style,
    "aria-hidden": "true",
  }

  switch (normalized) {
    case "aries":
      return (
        <svg {...glyphProps}>
          <path d="M12 21V8" />
          <path d="M12 8C12 5 9.5 3 6.5 5C4 6.8 5.5 10 7.5 10" />
          <path d="M12 8C12 5 14.5 3 17.5 5C20 6.8 18.5 10 16.5 10" />
        </svg>
      )

    case "taurus":
      return (
        <svg {...glyphProps}>
          <path d="M6 4C6 8 18 8 18 4" />
          <circle cx="12" cy="14" r="5.5" />
        </svg>
      )

    case "gemini":
      return (
        <svg {...glyphProps}>
          <path d="M4 4C10 7 14 7 20 4" />
          <path d="M4 20C10 17 14 17 20 20" />
          <path d="M8 5.5V18.5" />
          <path d="M16 5.5V18.5" />
        </svg>
      )

    case "cancer":
      return (
        <svg {...glyphProps}>
          <circle cx="7" cy="8" r="3.2" />
          <circle cx="17" cy="16" r="3.2" />
          <path d="M10.2 8C10.2 4 19 4 19 8" />
          <path d="M13.8 16C13.8 20 5 20 5 16" />
        </svg>
      )

    case "leo":
      return (
        <svg {...glyphProps}>
          <circle cx="6.5" cy="16" r="3" />
          <path d="M8.5 13.5C9.2 8 16 6 16 11C16 15.5 19.5 17.5 21 15.5" />
        </svg>
      )

    case "virgo":
      return (
        <svg {...glyphProps}>
          <path d="M4 6V17C4 18.5 5.5 18.5 5.5 17V6" />
          <path d="M5.5 12C5.5 7.5 10.5 7.5 10.5 12V17C10.5 18.5 12 18.5 12 17V6" />
          <path d="M12 12C12 7.5 17 7.5 17 12V18C17 20.5 14.5 21.5 14.5 19.5C14.5 17.5 20.5 15 20.5 21" />
        </svg>
      )

    case "libra":
      return (
        <svg {...glyphProps}>
          <path d="M4 19H20" />
          <path d="M4 15H8C8 11.5 16 11.5 16 15H20" />
        </svg>
      )

    case "scorpio":
      return (
        <svg {...glyphProps}>
          <path d="M4 6V17C4 18.5 5.5 18.5 5.5 17V6" />
          <path d="M5.5 12C5.5 7.5 10.5 7.5 10.5 12V17C10.5 18.5 12 18.5 12 17V6" />
          <path d="M12 12C12 7.5 17 7.5 17 12V17C17 18.5 18.5 18.5 20 16" />
          <path d="M17 16L20 16L19 13" />
        </svg>
      )

    case "sagittarius":
      return (
        <svg {...glyphProps}>
          <path d="M5 19L19 5" />
          <path d="M12 5H19V12" />
          <path d="M8 11L13 16" />
        </svg>
      )

    case "capricorn":
      return (
        <svg {...glyphProps}>
          <path d="M4 6L7 17C7.8 19 9.5 19 10.5 16L13.5 8C14.5 5.5 17.5 5.5 17.5 9C17.5 12.5 15 14.5 15 17.5C15 20 17 20.5 18 19" />
        </svg>
      )

    case "aquarius":
      return (
        <svg {...glyphProps}>
          <path d="M3 8L6 5L9 8L12 5L15 8L18 5L21 8" />
          <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15" />
        </svg>
      )

    case "pisces":
      return (
        <svg {...glyphProps}>
          <path d="M6 4C9 9 9 15 6 20" />
          <path d="M18 4C15 9 15 15 18 20" />
          <path d="M4 12H20" />
        </svg>
      )

    default:
      return null
  }
}
