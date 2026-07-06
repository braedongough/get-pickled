export type PicklingMethod = 'quick' | 'fermented'

export type MethodInfo = {
  readyDays: number
  shelfLifeDays: number
  note: string
}

export type GuideEntry = {
  id: string
  name: string
  category: 'vegetable' | 'fruit'
  emoji: string
  methods: Partial<Record<PicklingMethod, MethodInfo>>
  prep: string
  tip: string
}

export const METHOD_LABELS: Record<PicklingMethod, string> = {
  quick: 'Quick (vinegar)',
  fermented: 'Fermented (lacto)',
}

// Ready times and shelf lives assume refrigerator storage after the pickle
// is ready. Quick pickles are not shelf-stable unless properly canned.
export const PICKLE_GUIDE: Array<GuideEntry> = [
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'vegetable',
    emoji: '🥒',
    methods: {
      quick: {
        readyDays: 2,
        shelfLifeDays: 60,
        note: 'Edible in 24h, best flavor after 2–3 days in the fridge.',
      },
      fermented: {
        readyDays: 21,
        shelfLifeDays: 120,
        note: 'Half-sours in ~1 week, full-sours in 3–4 weeks at room temp.',
      },
    },
    prep: 'Use small, firm pickling cucumbers (Kirby). Trim 1/8" off the blossom end — it holds enzymes that turn pickles mushy.',
    tip: 'A grape leaf, black tea bag, or pinch of calcium chloride keeps them crunchy.',
  },
  {
    id: 'radish',
    name: 'Radish',
    category: 'vegetable',
    emoji: '🌶️',
    methods: {
      quick: {
        readyDays: 1,
        shelfLifeDays: 42,
        note: 'Ready overnight, peak flavor at 2–3 weeks.',
      },
      fermented: {
        readyDays: 7,
        shelfLifeDays: 90,
        note: 'Ferment 5–10 days. Mellows dramatically with time.',
      },
    },
    prep: 'Slice into thin coins or halve small radishes. Daikon works beautifully cut into batons.',
    tip: 'Fermenting radishes smell strongly sulfurous for the first few days — totally normal, it fades.',
  },
  {
    id: 'red-onion',
    name: 'Red onion',
    category: 'vegetable',
    emoji: '🧅',
    methods: {
      quick: {
        readyDays: 1,
        shelfLifeDays: 21,
        note: 'Usable in 30 minutes, proper pickle after a day.',
      },
    },
    prep: 'Slice into thin half-moons. Pour the hot brine straight over — no cooking needed.',
    tip: 'They turn a brilliant pink within hours. Best texture in the first 2–3 weeks.',
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'vegetable',
    emoji: '🥕',
    methods: {
      quick: {
        readyDays: 2,
        shelfLifeDays: 30,
        note: 'Best after 48 hours so the brine penetrates the dense flesh.',
      },
      fermented: {
        readyDays: 10,
        shelfLifeDays: 90,
        note: 'Ferment 1–2 weeks. Stays satisfyingly crunchy.',
      },
    },
    prep: 'Cut into sticks or coins. Blanching 1 minute first helps the brine soak in.',
    tip: 'Great with Mexican-style escabeche: jalapeños, onion, oregano, bay.',
  },
  {
    id: 'jalapeno',
    name: 'Jalapeño',
    category: 'vegetable',
    emoji: '🌶️',
    methods: {
      quick: {
        readyDays: 1,
        shelfLifeDays: 60,
        note: 'Ready in a day; heat mellows slightly as they sit.',
      },
      fermented: {
        readyDays: 14,
        shelfLifeDays: 120,
        note: 'Ferment 2 weeks — the base for proper hot sauce.',
      },
    },
    prep: 'Slice into rings, seeds in for heat or out for mild. Wear gloves.',
    tip: 'Leftover jalapeño brine is liquid gold for marinades and micheladas.',
  },
  {
    id: 'beet',
    name: 'Beet',
    category: 'vegetable',
    emoji: '🫜',
    methods: {
      quick: {
        readyDays: 3,
        shelfLifeDays: 90,
        note: 'Cook before pickling. Best after 3 days, keeps ~3 months.',
      },
      fermented: {
        readyDays: 14,
        shelfLifeDays: 120,
        note: 'Ferment raw slices 2 weeks, or make beet kvass in ~1 week.',
      },
    },
    prep: 'Roast or boil until fork-tender, slip off skins, slice. Raw beets ferment; cooked beets quick-pickle.',
    tip: 'Everything the brine touches turns fuchsia. Pickle some eggs in the leftover brine.',
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    category: 'vegetable',
    emoji: '🥦',
    methods: {
      quick: {
        readyDays: 3,
        shelfLifeDays: 30,
        note: 'Needs 2–3 days for brine to reach the core of the florets.',
      },
      fermented: {
        readyDays: 14,
        shelfLifeDays: 90,
        note: 'Ferment 1–3 weeks. A giardiniera classic.',
      },
    },
    prep: 'Break into small, even florets. Blanch 1 minute for a more tender pickle, or keep raw for crunch.',
    tip: 'Add turmeric to the brine for golden, ballpark-style cauliflower.',
  },
  {
    id: 'green-bean',
    name: 'Green bean',
    category: 'vegetable',
    emoji: '🫛',
    methods: {
      quick: {
        readyDays: 2,
        shelfLifeDays: 60,
        note: 'Classic "dilly beans." Best after 48 hours.',
      },
      fermented: {
        readyDays: 14,
        shelfLifeDays: 90,
        note: 'Ferment 1–2 weeks with dill and garlic.',
      },
    },
    prep: 'Trim stem ends, leave whole, pack vertically in the jar like little soldiers.',
    tip: 'Blanch 30 seconds for a brighter green that holds its color.',
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'vegetable',
    emoji: '🥬',
    methods: {
      quick: {
        readyDays: 1,
        shelfLifeDays: 14,
        note: 'Curtido-style quick slaw, ready overnight.',
      },
      fermented: {
        readyDays: 21,
        shelfLifeDays: 180,
        note: 'Sauerkraut: 2–6 weeks at cool room temp. Longer = tangier.',
      },
    },
    prep: 'Shred finely, salt at 2% by weight, and massage until it drowns in its own liquid.',
    tip: 'For kraut, keep the cabbage submerged under its brine — use a weight or a folded outer leaf.',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'vegetable',
    emoji: '🧄',
    methods: {
      quick: {
        readyDays: 14,
        shelfLifeDays: 120,
        note: 'Needs a full 2 weeks to mellow from raw harshness.',
      },
      fermented: {
        readyDays: 30,
        shelfLifeDays: 240,
        note: 'Ferment whole cloves 3–4 weeks. Also the base of honey-fermented garlic.',
      },
    },
    prep: 'Peel whole cloves; don’t crush. Blanching 30 seconds tames the bite.',
    tip: 'Cloves sometimes turn blue-green in acid. Startling, but completely harmless.',
  },
  {
    id: 'turnip',
    name: 'Turnip',
    category: 'vegetable',
    emoji: '🫚',
    methods: {
      quick: {
        readyDays: 3,
        shelfLifeDays: 30,
        note: 'Crisp and peppery after 3 days.',
      },
      fermented: {
        readyDays: 7,
        shelfLifeDays: 60,
        note: 'Lebanese pink turnips: ferment ~1 week with a slice of beet.',
      },
    },
    prep: 'Peel and cut into batons. Add one slice of raw beet per jar for the classic pink color.',
    tip: 'The essential companion to shawarma and falafel.',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'vegetable',
    emoji: '🫚',
    methods: {
      quick: {
        readyDays: 2,
        shelfLifeDays: 60,
        note: 'Sushi-style gari: ready in 2 days, keeps 2 months.',
      },
    },
    prep: 'Use young ginger if you can find it. Shave paper-thin with a peeler, salt 30 minutes, then brine.',
    tip: 'Young ginger blushes pink naturally in rice vinegar; mature ginger stays golden.',
  },
  {
    id: 'watermelon-rind',
    name: 'Watermelon rind',
    category: 'fruit',
    emoji: '🍉',
    methods: {
      quick: {
        readyDays: 2,
        shelfLifeDays: 30,
        note: 'A Southern classic. Best after 2 days, keeps a month.',
      },
    },
    prep: 'Peel off the green skin, leave a thin blush of pink, cube the white rind, simmer in brine until translucent.',
    tip: 'Sweet brine with cinnamon, clove, and a strip of lemon peel is traditional.',
  },
  {
    id: 'grape',
    name: 'Grape',
    category: 'fruit',
    emoji: '🍇',
    methods: {
      quick: {
        readyDays: 1,
        shelfLifeDays: 21,
        note: 'Ready in a day. Astonishing on a cheese board.',
      },
    },
    prep: 'Leave whole, prick each grape once with a skewer so the brine gets inside.',
    tip: 'Try with cinnamon stick, black peppercorns, and a splash of red wine vinegar.',
  },
  {
    id: 'peach',
    name: 'Peach',
    category: 'fruit',
    emoji: '🍑',
    methods: {
      quick: {
        readyDays: 2,
        shelfLifeDays: 21,
        note: 'Ready in 2 days. Eat within 3 weeks — stone fruit softens fast.',
      },
    },
    prep: 'Use firm, slightly underripe peaches. Blanch, peel, and quarter. Sweet cider-vinegar brine.',
    tip: 'Pickled peaches with bourbon and vanilla bean is a Southern showstopper.',
  },
]

export function getGuideEntry(id: string): GuideEntry | undefined {
  return PICKLE_GUIDE.find((entry) => entry.id === id)
}
