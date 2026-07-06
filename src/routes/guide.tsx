import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { GuideEntry } from '~/data/pickleGuide'
import { METHOD_LABELS, PICKLE_GUIDE } from '~/data/pickleGuide'
import { Reveal } from '~/lib/useReveal'

export const Route = createFileRoute('/guide')({
  component: Guide,
})

type CategoryFilter = 'all' | 'vegetable' | 'fruit'

const FILTERS: Array<[CategoryFilter, string]> = [
  ['all', 'Everything'],
  ['vegetable', 'Vegetables'],
  ['fruit', 'Fruit'],
]

function Guide() {
  const [filter, setFilter] = React.useState<CategoryFilter>('all')
  const entries = PICKLE_GUIDE.filter(
    (entry) => filter === 'all' || entry.category === filter,
  )

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-36 sm:px-6">
      <Reveal>
        <h1 className="text-balance max-w-xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink-950">
          The pickle guide
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-500">
          How long each vegetable — and the occasional brave fruit — takes to
          pickle, and how long it keeps in the fridge once it's there.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-8 flex w-max gap-1 rounded-full bg-cream-100 p-1 ring-1 ring-ink-950/[0.05]">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`ease-lux rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-300 ${
                filter === value
                  ? 'bg-ink-950 text-cream-50 shadow-sm'
                  : 'text-ink-500 hover:text-ink-950'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {entries.map((entry, index) => (
          <Reveal key={entry.id} delay={(index % 2) * 80}>
            <GuideCard entry={entry} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <aside className="bezel mt-16">
          <div className="bezel-core px-7 py-7 sm:px-9 sm:py-8">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink-950">
              Pickle safety, briefly
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 text-sm leading-relaxed text-ink-700 sm:grid-cols-2">
              <li>
                <strong className="text-ink-950">
                  Quick pickles live in the fridge.
                </strong>{' '}
                They're not shelf-stable unless processed in a water-bath
                canner with a tested recipe.
              </li>
              <li>
                <strong className="text-ink-950">
                  Keep everything under the brine.
                </strong>{' '}
                Anything poking above the surface is an invitation to mold.
              </li>
              <li>
                <strong className="text-ink-950">Ferments:</strong> cloudy
                brine and bubbles are normal. Fuzzy mold, pink slime, or a
                rotten (not sour) smell are not — toss the batch.
              </li>
              <li>
                <strong className="text-ink-950">
                  When in doubt, throw it out.
                </strong>{' '}
                A jar of radishes costs less than a bad week.
              </li>
            </ul>
          </div>
        </aside>
      </Reveal>

      <Reveal>
        <div className="mt-16 flex flex-col items-center gap-5 text-center">
          <p className="text-balance max-w-md font-display text-2xl font-medium tracking-tight text-ink-950">
            Read enough. Something in your crisper drawer is waiting.
          </p>
          <Link
            to="/"
            className="ease-lux group flex items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-sm font-semibold text-cream-50 transition-all duration-500 hover:bg-pickle-800 active:scale-[0.98]"
          >
            Start a batch
            <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </div>
      </Reveal>
    </main>
  )
}

function GuideCard({ entry }: { entry: GuideEntry }) {
  return (
    <div className="bezel h-full">
      <div className="bezel-core h-full px-7 py-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 text-3xl ring-1 ring-ink-950/[0.04]">
            {entry.emoji}
          </span>
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight text-ink-950">
              {entry.name}
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pickle-600">
              {entry.category}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {Object.entries(entry.methods).map(([method, info]) => (
            <div
              key={method}
              className="rounded-xl bg-cream-100/70 px-4 py-3 text-sm ring-1 ring-ink-950/[0.03]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-ink-950">
                  {METHOD_LABELS[method as keyof typeof METHOD_LABELS]}
                </span>
                <span className="text-xs font-medium tabular-nums text-ink-400">
                  ready ~{info.readyDays}d · keeps ~{info.shelfLifeDays}d
                </span>
              </div>
              <p className="mt-1 leading-relaxed text-ink-500">{info.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          <span className="font-semibold text-ink-950">Prep:</span>{' '}
          {entry.prep}
        </p>
        <p className="mt-3 border-l-2 border-pickle-300 pl-3 text-sm italic leading-relaxed text-ink-500">
          {entry.tip}
        </p>
      </div>
    </div>
  )
}
