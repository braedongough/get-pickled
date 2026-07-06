# Get Pickled 🥒

Small-batch pickle tracking. Every jar tracked from brine day to best-by — so nothing under-picks, over-sits, or quietly goes off at the back of the fridge.

![The shelf — hero](docs/screenshots/shelf.png)

## What it does

**The Shelf** is home. Your active batches sit on a 3D rotating shelf — drag it to spin, click a jar to bring it forward, or use the arrows, dots, and keyboard. The front jar's full details live in the panel below: jarred date, ready date, best-before, pickling progress, and notes, plus actions to mark a batch eaten, tossed, or deleted. Finished jars land in the pickle log, where they can be revived back onto the shelf.

![A jar on the shelf with its detail panel](docs/screenshots/batch-detail.png)

Each batch moves through four phases derived from its timing, with no manual bookkeeping:

| Phase | Meaning |
| --- | --- |
| Still picklin' | Brine is doing its work; progress bar shows how far along |
| Ready to eat | Past its ready date, plenty of shelf life left |
| Eat soon! | Within a week of its best-before date |
| Past its best | Beyond best-before — time to let go |

Below the shelf, a daily rotating suggestion nudges you toward something you haven't pickled yet, with one click pre-filling the batch form.

**The Pickle Guide** covers 15 ingredients — 12 vegetables plus watermelon rind, grapes, and peaches — with ready times and refrigerated shelf lives for both quick (vinegar) pickling and lacto-fermentation, prep notes, tips, and a short food-safety primer. Starting a batch pulls timing from the guide automatically; override it if you know better.

![The pickle guide](docs/screenshots/guide.png)

**Brines & Recipes** ships six house brines (classic dill, bread & butter, fiery escabeche, amazu, a 3.5% fermentation brine, and 2% dry-salt sauerkraut) and lets you write your own. Custom recipes appear alongside the house brines and show up in the batch form's brine picker.

![Brines and recipes](docs/screenshots/recipes.png)

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19 with file-based routing
- [Convex](https://convex.dev) for the database and live-syncing backend (`batches` and `recipes` tables)
- Tailwind CSS v4 with a custom theme (Fraunces + Plus Jakarta Sans, single pickle-green accent)
- The 3D shelf is plain CSS `perspective`/`preserve-3d` with pointer-event dragging — no animation library

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts Convex and Vite together. On first run, Convex provisions a local anonymous deployment and writes its URL to `.env.local` — no account needed. Run `npx convex login` if you want to link the project to a Convex cloud deployment instead.

The app runs at [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run lint     # typecheck + eslint
npm run build    # production build (vite build && tsc --noEmit)
npm run format   # prettier
```

## Project layout

```
convex/
  schema.ts            # batches + recipes tables
  batches.ts           # list / create / setStatus / remove
  recipes.ts           # list / create / remove
src/
  routes/
    index.tsx          # the shelf: hero, 3D carousel, batch detail, form, log
    guide.tsx          # ingredient reference
    recipes.tsx        # house brines + custom recipe builder
  components/
    ShelfCarousel.tsx  # draggable 3D jar ring
  data/
    pickleGuide.ts     # ingredient timing/shelf-life reference data
    recipes.ts         # the six house brines
  lib/
    batchTiming.ts     # phase + progress math
    useReveal.tsx      # scroll-entry reveal hook
```

## House rules

Keep it submerged, keep it cold, and when in doubt, throw it out.
