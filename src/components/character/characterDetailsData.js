/**
 * Character Details Data Dictionary
 * 
 * Maps all 12 Zodiac Signs to their respective characters, elements,
 * video cinematic files, namecard graphics, and 3-stage Genshin dialogue scripts.
 */

const MEDIA_CDN = process.env.NEXT_PUBLIC_MEDIA_CDN_URL || ''
const charVideo = (filename) => `${MEDIA_CDN}/models/character/chars final/${filename}`

export const CHARACTER_DETAILS = {
  aries: {
    signId: 'aries',
    signName: 'Aries',
    signSymbol: '',
    characterName: 'Arlecchino',
    characterKey: 'arlecchino',
    element: 'Pyro',
    elementKey: 'fire',
    elementColor: '#ef4444',
    elementBadge: 'bg-red-500/20 text-red-300 border-red-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #2b0606 0%, #170303 55%, #0a0101 100%)',
    videoSrc: charVideo('arlecchino.mp4'),
    namecardSrc: '/models/character/namecard final/arlecchino.png',
    musicSrc: '/models/character/chars and audios/Arlecchino s Theme — Offertorium of Fortuitum _ The Stellar Moments Vol. 5_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Aries…',
          'You received Arlecchino.',
          'The flame has chosen its bearer.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Beyond this namecard lies a world of hidden paths, forgotten quests, and secrets waiting to be uncovered.',
          'Tread carefully.\nNot every flame exists to light the way.',
          'There are places yet unseen,\nand stories waiting for someone brave enough to uncover them.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'Should the path grow dark,\nlook closely for the four-leaf clovers scattered along the way.\nThey may lead you somewhere unexpected.',
          'Good luck, Traveler.',
          'May the flames guide your courage.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  taurus: {
    signId: 'taurus',
    signName: 'Taurus',
    signSymbol: '',
    characterName: 'Nahida',
    characterKey: 'nahida',
    element: 'Dendro',
    elementKey: 'dendro',
    isPatronSign: true,
    elementColor: '#10b981',
    elementBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #052e16 0%, #03170b 55%, #010a05 100%)',
    videoSrc: charVideo('nahida.mp4'),
    namecardSrc: '/models/character/namecard final/nahida.png',
    musicSrc: '/models/character/chars and audios/Nahida Theme Music EXTENDED - Boundless Bliss (tnbee mix) _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Taurus…',
          'You received Nahida.',
          "The patron sign of Drishti's journey.",
          'A gentle presence has chosen to walk beside you.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'There is much to discover in this world,\nbut not every secret reveals itself at first glance.',
          'Take your time.\nSome paths must be wandered slowly,\nand some answers are found only by looking a little closer.',
          'Among the leaves and hidden corners of this world,\nyou may find stories that were waiting for the right person to discover them.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And should you ever lose your way,\nkeep an eye out for the four-leaf clovers along your path.\nThey may be carrying a little more than luck.',
          'Good luck, Traveler.',
          'May your curiosity take root,\nand may every new discovery bring you closer to what lies ahead.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  gemini: {
    signId: 'gemini',
    signName: 'Gemini',
    signSymbol: '',
    characterName: 'Venti',
    characterKey: 'venti',
    element: 'Air',
    elementKey: 'anemo',
    elementColor: '#06b6d4',
    elementBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #042630 0%, #02141a 55%, #01090d 100%)',
    videoSrc: charVideo('venti.mp4'),
    namecardSrc: '/models/character/namecard final/venti.png',
    musicSrc: '/models/character/chars and audios/Bard s Adventure — Venti s Theme _ Genshin Impact Original Soundtrack_ The Stellar Moments_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Gemini…',
          'You received Venti.',
          'A wandering breeze has decided to join your journey.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Who knows where the wind might carry you?\nThere are no rules saying you have to take the obvious path.',
          "Wander a little.\nFollow what catches your eye, chase the unexpected,\nand perhaps you'll stumble upon something that wasn't meant to be found so easily.",
          'Somewhere along the way, you may hear a song,\nfind a hidden path, or discover a story tucked away where you least expect it.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          "And if you're wondering where to go next,\nkeep an eye out for the four-leaf clovers scattered along the way.\nThey might just be pointing you toward your next adventure.",
          'Good luck, Traveler.',
          'May the wind always carry you somewhere interesting,\nand may your journey never be a dull one.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  cancer: {
    signId: 'cancer',
    signName: 'Cancer',
    signSymbol: '',
    characterName: 'Furina',
    characterKey: 'furina',
    element: 'Water',
    elementKey: 'hydro',
    elementColor: '#3b82f6',
    elementBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #051b38 0%, #030f21 55%, #010712 100%)',
    videoSrc: charVideo('furina.mp4'),
    namecardSrc: '/models/character/namecard final/furina.png',
    musicSrc: '/models/character/chars and audios/Furina Theme Music EXTENDED - All the World s a Stage (tnbee mix) _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Cancer…',
          'You received Furina.',
          'The stage is set, and the curtain is ready to rise.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Every journey has a story,\nand every story deserves an audience.',
          'So take your place, Traveler.\nThere are scenes yet to unfold,\nand perhaps a few surprises waiting behind the curtain.',
          'Look beyond the spectacle,\nfor the most meaningful stories are not always the ones that are performed in plain sight.',
          'Somewhere among the waves and wandering paths,\nyou may find something that feels strangely familiar.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And if you find yourself wondering which way to go,\nlook for the four-leaf clovers hidden along the path.\nPerhaps they have been waiting for you all along.',
          'Good luck, Traveler.',
          'May your story be one worth telling,\nand may the curtain always rise on something wonderful.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  leo: {
    signId: 'leo',
    signName: 'Leo',
    signSymbol: '',
    characterName: 'Mavuika',
    characterKey: 'mavuika',
    element: 'Pyro',
    elementKey: 'fire',
    elementColor: '#f97316',
    elementBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #2b0606 0%, #170303 55%, #0a0101 100%)',
    videoSrc: charVideo('mavuika.mp4'),
    namecardSrc: '/models/character/namecard final/mavuika.png',
    musicSrc: '/models/character/chars and audios/Blazing Heart (English Version)_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Leo…',
          'You received Mavuika.',
          'A radiant flame answers your call.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'The road ahead may lead you beyond familiar shores,\nthrough places where every discovery holds a story of its own.',
          'Walk boldly.\nLet curiosity be your compass, and let your spirit burn bright.',
          'There are wonders waiting beyond the horizon,\nand perhaps a few secrets that have yet to reveal themselves.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'Should you find yourself wondering where to go next,\nkeep an eye out for the four-leaf clovers along your path.\nThey may be pointing you toward something worth discovering.',
          'Good luck, Traveler.',
          'May your flame never fade.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  virgo: {
    signId: 'virgo',
    signName: 'Virgo',
    signSymbol: '',
    characterName: 'Alhaitham',
    characterKey: 'alhaitham',
    element: 'Dendro',
    elementKey: 'dendro',
    elementColor: '#10b981',
    elementBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #052e16 0%, #03170b 55%, #010a05 100%)',
    videoSrc: charVideo('alhaitham.mp4'),
    namecardSrc: '/models/character/namecard final/alhaitham.png',
    musicSrc: '/models/character/chars and audios/Alhaitham Theme Music EXTENDED - Think Before You Act (tnbee mix) _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Virgo…',
          'You received Alhaitham.',
          'A keen mind has chosen to accompany you.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'There is more to this world than what first meets the eye.\nPatterns hide within the details, and every detail may have a purpose.',
          "Observe carefully.\nQuestion what seems obvious,\nand don't be too quick to dismiss what appears insignificant.",
          'Somewhere along the way, you may encounter clues that seem unrelated.\nPerhaps they are not as unrelated as they appear.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And should you need a little guidance,\nlook for the four-leaf clovers hidden along your path.\nThey may reveal more than simple luck.',
          'Good luck, Traveler.',
          'May your eyes catch what others overlook,\nand may your curiosity lead you to the answer.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  libra: {
    signId: 'libra',
    signName: 'Libra',
    signSymbol: '',
    characterName: 'Kazuha',
    characterKey: 'kazuha',
    element: 'Air',
    elementKey: 'anemo',
    elementColor: '#2dd4bf',
    elementBadge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #042630 0%, #02141a 55%, #01090d 100%)',
    videoSrc: charVideo('kazuha.mp4'),
    namecardSrc: '/models/character/namecard final/kazuha.png',
    musicSrc: '/models/character/chars and audios/Kaedehara Kazuha Teaser OST EXTENDED - Moonlit Breeze (tnbee mix) _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Libra…',
          'You received Kazuha.',
          'The gentle breeze has chosen to guide your steps.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Not every destination is reached by following a straight path.\nSometimes, the wind carries you somewhere you never intended to go.',
          'Take a moment to listen.\nLet the breeze guide you through the unfamiliar,\nand allow each new discovery to shape the journey ahead.',
          'There are stories hidden between the pages of this world,\nwaiting patiently for someone to stop and notice them.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And if the wind ever seems to lose its way,\nlook for the four-leaf clovers resting along your path.\nPerhaps the breeze has carried them there for a reason.',
          'Good luck, Traveler.',
          'May the wind guide your journey,\nand may every path you wander bring you somewhere beautiful.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  scorpio: {
    signId: 'scorpio',
    signName: 'Scorpio',
    signSymbol: '',
    characterName: 'Columbina',
    characterKey: 'columbina',
    element: 'Water',
    elementKey: 'hydro',
    elementColor: '#6366f1',
    elementBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #051b38 0%, #030f21 55%, #010712 100%)',
    videoSrc: charVideo('columbina.mp4'),
    namecardSrc: '/models/character/namecard final/columbina.png',
    musicSrc: '/models/character/chars and audios/Columbina Theme Music EXTENDED - To Where She Flies (tnbee mix) ft. @ceciliamusic _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Scorpio…',
          'You received Columbina.',
          'Something unseen has noticed your arrival.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Not everything hidden is meant to remain hidden,\nbut not everything revealed should be trusted.',
          'There are secrets scattered throughout this world,\nquietly waiting beneath what appears familiar.',
          'Look carefully.\nA passing detail, a strange path, or something that seems slightly out of place\nmay be more important than it first appears.',
          'Somewhere beyond the obvious lies a place that has yet to be discovered.\nWhether you find it is entirely up to you.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And if you feel that you are being led somewhere,\nlook for the four-leaf clovers hidden along the way.\nJust remember, luck can sometimes lead you somewhere unexpected.',
          'Good luck, Traveler.',
          'May you uncover what lies beneath the surface,\nand may the secrets you find be worth the journey.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  sagittarius: {
    signId: 'sagittarius',
    signName: 'Sagittarius',
    signSymbol: '',
    characterName: 'Yoimiya',
    characterKey: 'yoimiya',
    element: 'Pyro',
    elementKey: 'fire',
    elementColor: '#f59e0b',
    elementBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #2b0606 0%, #170303 55%, #0a0101 100%)',
    videoSrc: charVideo('yoimiya.mp4'),
    namecardSrc: '/models/character/namecard final/yoimiya.png',
    musicSrc: '/models/character/chars and audios/Yoimiya Theme Music EXTENDED - Dazzling Lights in the Summer (tnbee mix) _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Sagittarius…',
          'You received Yoimiya.',
          'The skies are alight, and the journey is yours to make.',
          'Your adventure is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'There are countless paths waiting beyond the horizon,\neach one carrying a story of its own.',
          'Follow the sparks when they catch your eye.\nYou never know where a little curiosity might lead you.',
          'Some treasures are found by following the road,\nwhile others appear only when you dare to wander from it.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          "And if the way ahead ever seems uncertain,\nkeep watch for the four-leaf clovers along your path.\nPerhaps they know something you don't.",
          'Good luck, Traveler.',
          'May your journey be filled with wonder,\nand your skies with fireworks.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  capricorn: {
    signId: 'capricorn',
    signName: 'Capricorn',
    signSymbol: '',
    characterName: 'Lauma',
    characterKey: 'lauma',
    element: 'Dendro',
    elementKey: 'dendro',
    elementColor: '#059669',
    elementBadge: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #052e16 0%, #03170b 55%, #010a05 100%)',
    videoSrc: charVideo('lauma.mp4'),
    namecardSrc: '/models/character/namecard final/lauma.png',
    musicSrc: '/models/character/chars and audios/Lauma Theme Music EXTENDED - Compassion and Discipline ft. @ceciliamusic _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Capricorn…',
          'You received Lauma.',
          'An ancient presence stirs beyond the path.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Not every secret wishes to be found,\nand not every path reveals where it leads.',
          'Somewhere beyond the familiar lies a world shaped by forgotten stories,\nwhere the quietest places may hold the greatest mysteries.',
          'Walk with patience.\nLook beyond what is placed before you,\nfor the answers you seek may be hidden in the smallest details.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And when the path seems to disappear,\nwatch for the four-leaf clovers growing where you least expect them.\nThey may be the first sign that you are getting closer.',
          'Good luck, Traveler.',
          'May the old paths guide your steps,\nand may every mystery bring you closer to the unknown.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  aquarius: {
    signId: 'aquarius',
    signName: 'Aquarius',
    signSymbol: '',
    characterName: 'Xiao',
    characterKey: 'xiao',
    element: 'Air',
    elementKey: 'anemo',
    elementColor: '#14b8a6',
    elementBadge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #042630 0%, #02141a 55%, #01090d 100%)',
    videoSrc: charVideo('xiao.mp4'),
    namecardSrc: '/models/character/namecard final/xiao.png',
    musicSrc: '/models/character/chars and audios/Path of Yaksha_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Aquarius…',
          'You received Xiao.',
          'A lone guardian watches from beyond the clouds.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Not every journey is meant to follow a familiar path.\nSome roads lead far beyond what was ever expected.',
          'Walk freely.\nTrust your instincts, follow your own direction,\nand do not be afraid to wander where others would not.',
          'There are places hidden beyond the obvious,\nwaiting for those willing to look past the world they already know.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'And should the path grow quiet,\nkeep watch for the four-leaf clovers hidden along the way.\nPerhaps they will remind you that even the loneliest roads have their own kind of luck.',
          'Good luck, Traveler.',
          'May the wind carry you beyond the familiar,\nand may you find something worth remembering along the way.',
          'Your journey begins now.',
        ],
      },
    ],
  },

  pisces: {
    signId: 'pisces',
    signName: 'Pisces',
    signSymbol: '',
    characterName: 'Skirk',
    characterKey: 'skirk',
    element: 'Water',
    elementKey: 'hydro',
    elementColor: '#8b5cf6',
    elementBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bgGradient: 'radial-gradient(ellipse 120% 100% at 50% 30%, #051b38 0%, #030f21 55%, #010712 100%)',
    videoSrc: charVideo('skirk.mp4'),
    namecardSrc: '/models/character/namecard final/skirk.png',
    musicSrc: '/models/character/chars and audios/Skirk Theme Music - Lament of a Ruined World (tnbee mix) ft. @ceciliamusic _ Genshin Impact_320k.mp3',
    dialogue: [
      {
        stage: 1,
        paragraphs: [
          'Since you chose the sign of Pisces…',
          'You received Skirk.',
          'The boundary between the known and the unknown grows thin.',
          'Your journey is about to begin, Traveler.',
          "Welcome to Drishti's Portfolio.",
        ],
      },
      {
        stage: 2,
        paragraphs: [
          'Beyond the world you know,\nthere are paths that lead somewhere deeper, somewhere stranger.',
          'Perhaps this journey is not meant to be understood all at once.\nLet curiosity pull you forward,\nand let the unknown reveal itself one piece at a time.',
          'There are stories hidden beneath the surface,\nwaiting quietly for someone willing to venture beyond the familiar.',
          'If you find yourself drawn toward a path with no clear destination,\ndo not turn away just yet.',
        ],
      },
      {
        stage: 3,
        paragraphs: [
          'Look for the four-leaf clovers hidden along the way.\nThey may be the only sign that you are heading in the right direction.',
          'Good luck, Traveler.',
          'May you find your way through the unknown,\nand may the journey reveal more than you ever expected.',
          'Your journey begins now.',
        ],
      },
    ],
  },
}

export function getCharacterDetails(signId) {
  const normalized = (signId || 'taurus').toLowerCase().trim()
  return CHARACTER_DETAILS[normalized] || CHARACTER_DETAILS.taurus
}
