/**
 * Zodiac Sanctuary Data Architecture
 * 12 Signs in astronomical order with authentic constellation star coordinates,
 * line chords, Roman titles, glyphs, and celestial lore.
 */

export const ELEMENT_COLORS = {
  fire: {
    name: 'Fire',
    halo: '#ff3b30',
    core: '#ff6b4a',
    particle: '#ff5533',
    glow: '#f97316',
    border: 'border-red-500/40',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
  earth: {
    name: 'Earth',
    halo: '#22c55e',
    core: '#10b981',
    particle: '#22c55e',
    glow: '#f59e0b', // Radiant golden-amber sanctuary glow
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  air: {
    name: 'Air',
    halo: '#3b82f6',
    core: '#60a5fa',
    particle: '#60a5fa',
    glow: '#38bdf8',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  water: {
    name: 'Water',
    halo: '#06b6d4',
    core: '#38bdf8',
    particle: '#22d3ee',
    glow: '#06b6d4',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
}

export const ZODIAC_SIGNS = [
  {
    index: 0,
    id: 'aries',
    name: 'Aries',
    creature: 'The Ram',
    symbol: '',
    element: 'fire',
    dates: 'Mar 21 – Apr 19',
    title: 'The Sun-Forged Vanguard',
    quote: 'Through ash and bramble, the first spark clears the path.',
    isHerSign: false,
    // Constellation stars: [normalizedX, normalizedY, brightness]
    stars: [
      [-0.8, -0.3, 1.2], // Hamal (alpha Ari)
      [-0.2, 0.2, 1.0],  // Sheratan (beta Ari)
      [0.3, 0.4, 0.9],   // Mesarthim (gamma Ari)
      [0.8, 0.1, 0.7],   // 41 Arietis
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    index: 1,
    id: 'taurus',
    name: 'Taurus',
    creature: 'The Celestial Bull',
    symbol: '',
    element: 'earth',
    dates: 'Apr 20 – May 20',
    title: 'The Verdant Caretaker',
    quote: 'In patient soil and quiet stone, roots remember the ancient songs.',
    isHerSign: true, // ★ Default active selection & her patron sign
    // Authentic Taurus constellation (Aldebaran, Elnath, Hyades V, Pleiades)
    stars: [
      [0.15, -0.2, 1.6],  // 0: Aldebaran (Alpha Tauri, brilliant orange giant)
      [0.75, 0.85, 1.2],  // 1: Elnath (Beta Tauri, North horn tip)
      [0.85, 0.15, 1.1],  // 2: Tianguan / Zeta Tauri (South horn tip)
      [0.05, 0.25, 0.9],  // 3: Ain / Epsilon Tauri (North eye of V)
      [-0.15, 0.05, 0.85],// 4: Delta Tauri (Center of V)
      [-0.35, -0.25, 0.9],// 5: Gamma Tauri (Apex of Hyades V)
      [-0.55, -0.05, 0.8],// 6: Lambda Tauri (Neck)
      [-0.95, 0.55, 1.4], // 7: Pleiades cluster (The Seven Sisters / Shoulder)
      [-0.85, -0.45, 0.8],// 8: Xi Tauri (Chest)
      [-1.15, -0.25, 0.7],// 9: Omicron Tauri (Front Hoof)
    ],
    lines: [
      // Northern horn
      [0, 3],
      [3, 1],
      // Southern horn
      [0, 4],
      [4, 2],
      // Hyades V-head
      [3, 4],
      [4, 5],
      [5, 0],
      // Body to Pleiades
      [0, 6],
      [6, 7],
      // Forequarters
      [6, 8],
      [8, 9],
    ],
  },
  {
    index: 2,
    id: 'gemini',
    name: 'Gemini',
    creature: 'The Twins',
    symbol: '',
    element: 'air',
    dates: 'May 21 – Jun 20',
    title: 'The Wind-Woven Twin',
    quote: 'One voice to speak with the clouds, one to listen to the echoes.',
    isHerSign: false,
    stars: [
      [-0.4, 0.8, 1.4],  // 0: Castor
      [0.2, 0.9, 1.5],   // 1: Pollux
      [-0.5, 0.3, 0.8],  // 2: Mebsuta
      [0.1, 0.4, 0.9],   // 3: Wasat
      [-0.7, -0.2, 0.8], // 4: Tejat
      [-0.1, -0.3, 0.8], // 5: Mekbuda
      [0.3, -0.4, 0.9],  // 6: Alhena
      [-0.8, -0.6, 0.7], // 7: Propus
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 7],
      [5, 6],
      [2, 3],
    ],
  },
  {
    index: 3,
    id: 'cancer',
    name: 'Cancer',
    creature: 'The Crab',
    symbol: '',
    element: 'water',
    dates: 'Jun 21 – Jul 22',
    title: 'The Tide-Keeper',
    quote: 'The ocean cradles all secrets, forgiving every departing wave.',
    isHerSign: false,
    stars: [
      [-0.2, 0.1, 1.3],  // 0: Praesepe / Beehive Cluster
      [0.1, 0.5, 0.9],   // 1: Asellus Borealis
      [0.2, -0.2, 0.9],  // 2: Asellus Australis
      [-0.6, 0.3, 0.8],  // 3: Iota Cancri
      [0.7, -0.5, 0.8],  // 4: Acubens (Alpha Cancri)
      [-0.4, -0.6, 0.7], // 5: Altarf (Beta Cancri)
    ],
    lines: [
      [1, 0],
      [0, 2],
      [0, 3],
      [2, 4],
      [0, 5],
    ],
  },
  {
    index: 4,
    id: 'leo',
    name: 'Leo',
    creature: 'The Lion',
    symbol: '',
    element: 'fire',
    dates: 'Jul 23 – Aug 22',
    title: 'The Dawn-Crowned Sovereign',
    quote: 'Let the horizon ignite; we are the warmth of the waking world.',
    isHerSign: false,
    stars: [
      [-0.6, -0.5, 1.5], // 0: Regulus (Alpha Leonis)
      [-0.3, -0.1, 1.0], // 1: Eta Leonis
      [-0.1, 0.3, 1.2],  // 2: Algieba (Gamma Leonis)
      [-0.2, 0.7, 0.9],  // 3: Adhafera
      [-0.5, 0.8, 0.9],  // 4: Rasalas
      [-0.8, 0.5, 0.8],  // 5: Alterf
      [0.3, 0.2, 1.1],   // 6: Zosma (Delta Leonis)
      [0.4, -0.3, 0.9],  // 7: Chertan (Theta Leonis)
      [0.9, 0.0, 1.3],   // 8: Denebola (Beta Leonis)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 6],
      [6, 8],
      [8, 7],
      [7, 0],
      [6, 7],
    ],
  },
  {
    index: 5,
    id: 'virgo',
    name: 'Virgo',
    creature: 'The Maiden',
    symbol: '',
    element: 'earth',
    dates: 'Aug 23 – Sep 22',
    title: 'The Star-Weaver',
    quote: 'Perfection is not stillness, but a petal placed with deliberate love.',
    isHerSign: false,
    stars: [
      [0.4, -0.7, 1.6],  // 0: Spica (Alpha Virginis, brilliant blue-white)
      [0.1, -0.2, 1.0],  // 1: Porrima (Gamma Virginis)
      [-0.3, 0.1, 1.0],  // 2: Vindemiatrix (Epsilon Virginis)
      [-0.6, -0.1, 0.9], // 3: Zavijava (Beta Virginis)
      [-0.1, -0.5, 0.8], // 4: Zaniah
      [0.6, -0.1, 0.8],  // 5: Heze (Zeta Virginis)
      [0.8, 0.5, 0.7],   // 6: Syrma
    ],
    lines: [
      [3, 4],
      [4, 1],
      [1, 2],
      [1, 0],
      [1, 5],
      [5, 6],
      [5, 0],
    ],
  },
  {
    index: 6,
    id: 'libra',
    name: 'Libra',
    creature: 'The Scales',
    symbol: '',
    element: 'air',
    dates: 'Sep 23 – Oct 22',
    title: 'The Twilight Arbiter',
    quote: 'Where shadow and light meet, balance becomes a gentle melody.',
    isHerSign: false,
    stars: [
      [-0.5, 0.1, 1.3],  // 0: Zubenelgenubi (Alpha Librae, South Balance)
      [0.3, 0.6, 1.3],   // 1: Zubeneschamali (Beta Librae, North Balance)
      [0.6, -0.1, 1.0],  // 2: Zubenelhakrabi (Gamma Librae)
      [-0.2, -0.6, 0.9], // 3: Brachium (Sigma Librae)
      [0.1, 0.0, 0.8],   // 4: Upsilon Librae
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [1, 4],
      [0, 4],
    ],
  },
  {
    index: 7,
    id: 'scorpio',
    name: 'Scorpio',
    creature: 'The Scorpion',
    symbol: '',
    element: 'water',
    dates: 'Oct 23 – Nov 21',
    title: 'The Abyssal Seer',
    quote: 'The deepest waters fear no darkness, for they hold their own stars.',
    isHerSign: false,
    stars: [
      [-0.2, 0.3, 1.6],  // 0: Antares (Alpha Scorpii, Heart of Scorpion)
      [-0.6, 0.7, 1.1],  // 1: Graffias (Beta Scorpii)
      [-0.7, 0.4, 1.0],  // 2: Dschubba (Delta Scorpii)
      [-0.7, 0.1, 0.9],  // 3: Pi Scorpii
      [-0.1, -0.1, 0.9], // 4: Larawag (Epsilon Scorpii)
      [0.1, -0.4, 0.9],  // 5: Zeta Scorpii
      [0.3, -0.7, 1.0],  // 6: Sargas (Theta Scorpii)
      [0.6, -0.6, 1.0],  // 7: Iota Scorpii
      [0.7, -0.2, 1.2],  // 8: Shaula (Lambda Scorpii, Stinger)
      [0.5, -0.1, 1.0],  // 9: Lesath (Upsilon Scorpii)
    ],
    lines: [
      [1, 2],
      [2, 3],
      [2, 0],
      [0, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
    ],
  },
  {
    index: 8,
    id: 'sagittarius',
    name: 'Sagittarius',
    creature: 'The Centaur Archer',
    symbol: '',
    element: 'fire',
    dates: 'Nov 22 – Dec 21',
    title: 'The Far-Strider',
    quote: 'No mountain too steep for arrows aimed at the infinite blue.',
    isHerSign: false,
    stars: [
      [-0.5, 0.0, 1.2],  // 0: Kaus Media (Delta Sgr)
      [-0.3, -0.5, 1.3], // 1: Kaus Australis (Epsilon Sgr)
      [-0.6, 0.4, 1.0],  // 2: Kaus Borealis (Lambda Sgr)
      [0.3, -0.4, 1.1],  // 3: Ascella (Zeta Sgr)
      [0.5, 0.1, 1.2],   // 4: Nunki (Sigma Sgr)
      [0.1, 0.2, 0.9],   // 5: Phi Sgr
      [-0.9, -0.1, 1.0], // 6: Alnasl (Gamma Sgr, Spout tip)
      [0.8, -0.1, 0.8],  // 7: Tau Sgr (Handle)
    ],
    lines: [
      [2, 5],
      [2, 0],
      [0, 6],
      [6, 1],
      [1, 0],
      [0, 5],
      [5, 4],
      [4, 3],
      [3, 1],
      [4, 7],
      [7, 3],
    ],
  },
  {
    index: 9,
    id: 'capricorn',
    name: 'Capricorn',
    creature: 'The Sea-Goat',
    symbol: '',
    element: 'earth',
    dates: 'Dec 22 – Jan 19',
    title: 'The Frost-Horned Climber',
    quote: 'Step by step upon frozen crags, eternity is won through quiet resolve.',
    isHerSign: false,
    stars: [
      [-0.7, 0.5, 1.1],  // 0: Algedi (Alpha Cap)
      [-0.6, 0.2, 1.1],  // 1: Dabih (Beta Cap)
      [0.8, 0.2, 1.2],   // 2: Deneb Algedi (Delta Cap)
      [0.7, 0.0, 1.0],   // 3: Nashira (Gamma Cap)
      [0.2, -0.5, 0.9],  // 4: Omega Cap
      [-0.2, -0.6, 0.9], // 5: Psi Cap
      [0.5, -0.3, 0.8],  // 6: Theta Cap
    ],
    lines: [
      [0, 1],
      [1, 5],
      [5, 4],
      [4, 6],
      [6, 3],
      [3, 2],
      [0, 2],
    ],
  },
  {
    index: 10,
    id: 'aquarius',
    name: 'Aquarius',
    creature: 'The Water Bearer',
    symbol: '',
    element: 'air',
    dates: 'Jan 20 – Feb 18',
    title: 'The Sky-Bearer',
    quote: 'We pour new rivers from the stars to awaken slumbering valleys.',
    isHerSign: false,
    stars: [
      [-0.1, 0.6, 1.3],  // 0: Sadalsuud (Beta Aqr)
      [0.4, 0.4, 1.3],   // 1: Sadalmelik (Alpha Aqr)
      [0.6, 0.1, 1.0],   // 2: Sadachbia (Gamma Aqr)
      [-0.5, 0.2, 0.9],  // 3: Albali (Epsilon Aqr)
      [0.2, -0.2, 0.9],  // 4: Ancha (Theta Aqr)
      [0.5, -0.6, 1.0],  // 5: Skat (Delta Aqr)
      [-0.3, -0.7, 0.8], // 6: Hydor (Lambda Aqr)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [0, 3],
      [1, 4],
      [4, 5],
      [4, 6],
    ],
  },
  {
    index: 11,
    id: 'pisces',
    name: 'Pisces',
    creature: 'The Two Fish',
    symbol: '',
    element: 'water',
    dates: 'Feb 19 – Mar 20',
    title: 'The Dream-Drifter',
    quote: 'Between waking and sleep, the wildflowers bloom without season.',
    isHerSign: false,
    stars: [
      [0.7, -0.5, 1.2],  // 0: Alrescha (Alpha Psc, The Knot)
      [0.8, 0.2, 0.9],   // 1: Torcular
      [0.5, 0.6, 1.0],   // 2: Omega Psc (North Fish)
      [0.1, 0.8, 0.9],   // 3: Iota Psc
      [0.2, -0.6, 0.9],  // 4: Delta Psc
      [-0.4, -0.5, 1.0], // 5: Gamma Psc (West Fish)
      [-0.7, -0.3, 0.9], // 6: Theta Psc
      [-0.5, 0.0, 0.8],  // 7: Lambda Psc
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 5],
    ],
  },
]
