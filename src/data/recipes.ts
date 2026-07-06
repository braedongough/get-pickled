import type { PicklingMethod } from './pickleGuide'

export type BrineRecipe = {
  id: string
  name: string
  method: PicklingMethod
  emoji: string
  description: string
  ingredients: Array<string>
  steps: Array<string>
  goodFor: Array<string>
}

export const BRINE_RECIPES: Array<BrineRecipe> = [
  {
    id: 'classic-dill',
    name: 'Classic Dill Brine',
    method: 'quick',
    emoji: '🌿',
    description:
      'The all-purpose deli-style brine. Sharp, garlicky, and herbaceous — if in doubt, use this one.',
    ingredients: [
      '1 cup (240 ml) white vinegar, 5% acidity',
      '1 cup (240 ml) water',
      '1 tbsp kosher salt',
      '2 tsp sugar (optional, rounds the edge)',
      '2 cloves garlic, smashed',
      '2 sprigs fresh dill (or 1 tsp dill seed)',
      '1 tsp black peppercorns',
      '1/2 tsp yellow mustard seed',
    ],
    steps: [
      'Bring vinegar, water, salt, and sugar to a simmer, stirring until dissolved.',
      'Pack vegetables into a clean jar with the garlic, dill, and spices.',
      'Pour the hot brine over, leaving 1/2" headspace. Everything should be submerged.',
      'Cool to room temperature with the lid loose, then seal and refrigerate.',
    ],
    goodFor: ['cucumber', 'green-bean', 'carrot', 'cauliflower', 'radish'],
  },
  {
    id: 'bread-and-butter',
    name: 'Bread & Butter Brine',
    method: 'quick',
    emoji: '🍯',
    description:
      'Sweet, tangy, and golden with turmeric. The sandwich pickle your grandmother was right about.',
    ingredients: [
      '1 cup (240 ml) apple cider vinegar',
      '1/2 cup (120 ml) water',
      '3/4 cup (150 g) sugar',
      '1 tbsp kosher salt',
      '1 tsp yellow mustard seed',
      '1/2 tsp celery seed',
      '1/2 tsp ground turmeric',
      '1/4 tsp whole cloves (optional)',
    ],
    steps: [
      'Salt sliced vegetables and let stand 1 hour, then drain (keeps them crisp).',
      'Bring all brine ingredients to a boil, stirring until sugar dissolves.',
      'Add the vegetables to the pot, return just to a simmer, and kill the heat.',
      'Ladle into jars, cool, then refrigerate.',
    ],
    goodFor: ['cucumber', 'red-onion', 'cauliflower', 'watermelon-rind'],
  },
  {
    id: 'fiery-escabeche',
    name: 'Fiery Escabeche Brine',
    method: 'quick',
    emoji: '🔥',
    description:
      'Mexican taquería-style. Hot, oreganoed, and slightly oily — the jar everyone fights over.',
    ingredients: [
      '1 cup (240 ml) white vinegar',
      '1 cup (240 ml) water',
      '1 tbsp kosher salt',
      '1 tsp sugar',
      '2 tbsp olive oil',
      '3 cloves garlic, halved',
      '1 tsp dried oregano (Mexican if you have it)',
      '1 bay leaf',
      '1/2 tsp cumin seed',
    ],
    steps: [
      'Warm the oil and briefly sizzle the garlic, oregano, bay, and cumin.',
      'Add vinegar, water, salt, and sugar; bring to a simmer.',
      'Pour over jalapeños, carrots, and onions packed in a jar.',
      'Cool, seal, refrigerate. Ready in 24 hours, better in three days.',
    ],
    goodFor: ['jalapeno', 'carrot', 'red-onion', 'cauliflower'],
  },
  {
    id: 'amazu',
    name: 'Amazu (Rice Vinegar) Brine',
    method: 'quick',
    emoji: '🍚',
    description:
      'The gentle Japanese sweet-and-sour brine behind sushi ginger. Delicate, clean, never harsh.',
    ingredients: [
      '1 cup (240 ml) unseasoned rice vinegar',
      '1/2 cup (120 ml) water',
      '1/3 cup (65 g) sugar',
      '1 tsp fine sea salt',
      'Optional: 1 strip kombu for depth',
    ],
    steps: [
      'Heat everything gently until the sugar dissolves — do not boil hard.',
      'Salt thin-cut vegetables 30 minutes first, squeeze dry.',
      'Pour warm brine over and refrigerate.',
      'Ready in a few hours; peak at 2 days.',
    ],
    goodFor: ['ginger', 'radish', 'cucumber', 'turnip'],
  },
  {
    id: 'basic-ferment',
    name: 'Basic Fermentation Brine (3.5%)',
    method: 'fermented',
    emoji: '🫧',
    description:
      'No vinegar at all — salt, water, and time. Wild lactobacillus makes the sourness, plus the fizz and funk vinegar can’t.',
    ingredients: [
      '1 liter water, non-chlorinated (boil and cool, or use filtered)',
      '35 g fine sea salt (3.5% by weight — use a scale)',
      'Aromatics: garlic, dill, bay, chile, peppercorns',
      'Optional: grape, oak, or horseradish leaf for crunch (tannins)',
    ],
    steps: [
      'Dissolve the salt completely in the water.',
      'Pack vegetables and aromatics tightly in a jar; pour brine to cover fully.',
      'Weigh everything down below the brine. Exposure to air = mold.',
      'Cover loosely (or use an airlock) at 18–22°C away from sunlight.',
      'Taste from day 5. Cloudy brine and bubbles are good signs. Move to the fridge when it’s sour enough for you.',
    ],
    goodFor: [
      'cucumber',
      'green-bean',
      'jalapeno',
      'radish',
      'turnip',
      'garlic',
      'cauliflower',
      'carrot',
    ],
  },
  {
    id: 'kraut-dry-salt',
    name: 'Sauerkraut Dry Salt (2%)',
    method: 'fermented',
    emoji: '🥬',
    description:
      'No brine to make — shredded cabbage releases its own. The oldest trick in the pickle book.',
    ingredients: [
      '1 head cabbage, shredded (weigh it)',
      'Fine sea salt at 2% of the cabbage weight (20 g per kg)',
      'Optional: 1 tbsp caraway seed, or juniper berries',
    ],
    steps: [
      'Toss cabbage with salt and massage 5–10 minutes until dripping wet.',
      'Pack into a jar hard, pressing until brine rises above the cabbage.',
      'Weigh it down, cover loosely, keep at cool room temperature.',
      'Taste weekly from week 2. Fridge it when you love it (usually 3–6 weeks).',
    ],
    goodFor: ['cabbage'],
  },
]

export function getBrineRecipe(id: string): BrineRecipe | undefined {
  return BRINE_RECIPES.find((recipe) => recipe.id === id)
}
