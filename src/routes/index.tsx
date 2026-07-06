import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import type { PicklingMethod } from '~/data/pickleGuide'
import { METHOD_LABELS, PICKLE_GUIDE, getGuideEntry } from '~/data/pickleGuide'
import { BRINE_RECIPES, getBrineRecipe } from '~/data/recipes'
import { PHASE_LABELS, formatDate, getBatchTiming } from '~/lib/batchTiming'
import { Reveal } from '~/lib/useReveal'
import { ShelfCarousel } from '~/components/ShelfCarousel'

export const Route = createFileRoute('/')({
  component: ShelfPage,
})

function resolveBrineName({
  brineId,
  customRecipes,
}: {
  brineId: string
  customRecipes: Array<Doc<'recipes'>>
}): string | undefined {
  const builtIn = getBrineRecipe(brineId)
  if (builtIn) {
    return builtIn.name
  }
  if (brineId === 'custom') {
    return 'My own brine'
  }
  return customRecipes.find((recipe) => recipe._id === brineId)?.name
}

function ShelfPage() {
  const { data: batches } = useSuspenseQuery(convexQuery(api.batches.list, {}))
  const { data: customRecipes } = useSuspenseQuery(
    convexQuery(api.recipes.list, {}),
  )

  const [showForm, setShowForm] = React.useState(false)
  const [formIngredient, setFormIngredient] = React.useState('cucumber')
  const [frontIndex, setFrontIndex] = React.useState(0)
  const formAnchor = React.useRef<HTMLDivElement>(null)

  const active = batches.filter((batch) => batch.status === 'active')
  const archived = batches.filter((batch) => batch.status !== 'active')
  const eatenCount = batches.filter((batch) => batch.status === 'eaten').length
  const readyCount = active.filter((batch) => {
    const phase = getBatchTiming(batch).phase
    return phase === 'ready' || phase === 'eat-soon'
  }).length

  const frontBatch = active[Math.min(frontIndex, active.length - 1)]

  const openForm = (ingredientId?: string) => {
    if (ingredientId) {
      setFormIngredient(ingredientId)
    }
    setShowForm(true)
    requestAnimationFrame(() => {
      formAnchor.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-36 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(113,140,71,0.10),rgba(113,140,71,0)_65%)]"
        />
        <Reveal>
          <h1 className="text-balance max-w-2xl font-display text-5xl font-medium leading-[1.04] tracking-tight text-ink-950 sm:text-6xl">
            Good pickles take time.
            <br />
            <span className="text-pickle-600">We keep it.</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-500">
            Every jar tracked from brine day to best-by — so nothing under-picks,
            over-sits, or quietly goes off at the back of the fridge.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button
              onClick={() => (showForm ? setShowForm(false) : openForm())}
              className="ease-lux group flex items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-sm font-semibold text-cream-50 transition-all duration-500 hover:bg-pickle-800 active:scale-[0.98]"
            >
              {showForm ? 'Close the lid' : 'Start a batch'}
              <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105">
                {showForm ? '×' : '↗'}
              </span>
            </button>
            <div className="flex items-center gap-5 text-sm">
              <Stat value={active.length} label="on the shelf" />
              <Stat value={readyCount} label="ready now" accent />
              <Stat value={eatenCount} label="devoured" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* New batch form */}
      <div ref={formAnchor} className="scroll-mt-28">
        {showForm && (
          <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
            <NewBatchForm
              key={formIngredient}
              initialIngredientId={formIngredient}
              customRecipes={customRecipes}
              onDone={() => setShowForm(false)}
            />
          </section>
        )}
      </div>

      {/* The rotating shelf */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6">
        {active.length === 0 ? (
          <EmptyShelf onStart={() => openForm()} />
        ) : (
          <Reveal>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink-950">
                The shelf
              </h2>
              {active.length > 1 && (
                <p className="text-xs font-medium text-ink-400">
                  drag to spin · click a jar to bring it forward
                </p>
              )}
            </div>
            <div className="mt-4">
              <ShelfCarousel batches={active} onFrontChange={setFrontIndex} />
            </div>
            <BatchDetail
              key={frontBatch._id}
              batch={frontBatch}
              customRecipes={customRecipes}
            />
          </Reveal>
        )}
      </section>

      {/* Motivation: what to pickle next */}
      <NextBatchNudge batches={batches} onPickle={openForm} />

      {/* History */}
      {archived.length > 0 && <PickleLog batches={archived} />}
    </main>
  )
}

function Stat({
  value,
  label,
  accent = false,
}: {
  value: number
  label: string
  accent?: boolean
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span
        className={`font-display text-2xl font-medium tabular-nums ${
          accent && value > 0 ? 'text-pickle-600' : 'text-ink-950'
        }`}
      >
        {value}
      </span>
      <span className="text-xs font-medium text-ink-400">{label}</span>
    </span>
  )
}

function EmptyShelf({ onStart }: { onStart: () => void }) {
  return (
    <Reveal>
      <div className="bezel">
        <div className="bezel-core flex flex-col items-center px-6 py-20 text-center">
          <span className="animate-drift text-7xl">🫙</span>
          <h2 className="text-balance mt-8 max-w-md font-display text-3xl font-medium tracking-tight text-ink-950">
            An empty shelf is just a shelf. Fill it.
          </h2>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-500">
            Your first batch takes five minutes to jar and a few days to become
            the best thing in your fridge.
          </p>
          <button
            onClick={onStart}
            className="ease-lux group mt-8 flex items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-sm font-semibold text-cream-50 transition-all duration-500 hover:bg-pickle-800 active:scale-[0.98]"
          >
            Jar something
            <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5">
              ↗
            </span>
          </button>
        </div>
      </div>
    </Reveal>
  )
}

function BatchDetail({
  batch,
  customRecipes,
}: {
  batch: Doc<'batches'>
  customRecipes: Array<Doc<'recipes'>>
}) {
  const entry = getGuideEntry(batch.ingredientId)
  const timing = getBatchTiming(batch)
  const brineName = resolveBrineName({ brineId: batch.brineId, customRecipes })
  const setStatus = useMutation(api.batches.setStatus)
  const remove = useMutation(api.batches.remove)

  return (
    <div className="bezel mx-auto mt-10 max-w-3xl">
      <div className="bezel-core px-7 py-6 sm:px-9 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight text-ink-950">
              {batch.name}
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {entry?.name ?? batch.ingredientId} ·{' '}
              {METHOD_LABELS[batch.method]}
              {brineName ? ` · ${brineName}` : ''}
            </p>
          </div>
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              timing.phase === 'pickling'
                ? 'bg-amber-100 text-amber-800'
                : timing.phase === 'ready'
                  ? 'bg-pickle-100 text-pickle-700'
                  : timing.phase === 'eat-soon'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
            }`}
          >
            {PHASE_LABELS[timing.phase]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailStat label="Jarred" value={formatDate(batch.startedAt)} />
          <DetailStat
            label={timing.phase === 'pickling' ? 'Ready on' : 'Ready since'}
            value={formatDate(timing.readyAt)}
          />
          <DetailStat
            label="Best before"
            value={formatDate(timing.expiresAt)}
          />
          <DetailStat
            label={timing.phase === 'pickling' ? 'Days to go' : 'Days left'}
            value={
              timing.phase === 'pickling'
                ? `${timing.daysUntilReady}`
                : timing.phase === 'gone-off'
                  ? '—'
                  : `${timing.daysUntilExpiry}`
            }
          />
        </div>

        {timing.phase === 'pickling' && (
          <div className="mt-6">
            <div className="h-1.5 overflow-hidden rounded-full bg-cream-200">
              <div
                className="ease-lux h-full rounded-full bg-pickle-500 transition-all duration-1000"
                style={{ width: `${Math.round(timing.progress * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium tabular-nums text-ink-400">
              {Math.round(timing.progress * 100)}% pickled
            </p>
          </div>
        )}

        {batch.notes && (
          <p className="mt-5 border-l-2 border-pickle-300 pl-4 text-sm italic leading-relaxed text-ink-500">
            {batch.notes}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-ink-950/[0.06] pt-5">
          <button
            onClick={() => void setStatus({ id: batch._id, status: 'eaten' })}
            className="ease-lux rounded-full bg-pickle-100 px-4 py-2 text-xs font-semibold text-pickle-700 transition-all duration-300 hover:bg-pickle-200 active:scale-[0.97]"
          >
            😋 We ate it
          </button>
          <button
            onClick={() =>
              void setStatus({ id: batch._id, status: 'discarded' })
            }
            className="ease-lux rounded-full bg-cream-100 px-4 py-2 text-xs font-semibold text-ink-700 transition-all duration-300 hover:bg-cream-200 active:scale-[0.97]"
          >
            Toss it
          </button>
          <button
            onClick={() => void remove({ id: batch._id })}
            className="ease-lux ml-auto rounded-full px-3 py-2 text-xs font-semibold text-red-800/50 transition-all duration-300 hover:bg-red-50 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-medium tabular-nums text-ink-950">
        {value}
      </p>
    </div>
  )
}

function NextBatchNudge({
  batches,
  onPickle,
}: {
  batches: Array<Doc<'batches'>>
  onPickle: (ingredientId: string) => void
}) {
  const pickled = new Set(batches.map((batch) => batch.ingredientId))
  const untried = PICKLE_GUIDE.filter((entry) => !pickled.has(entry.id))
  if (untried.length === 0) {
    return null
  }

  const dayOfYear = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
  const suggestion = untried[dayOfYear % untried.length]
  const info =
    suggestion.methods.quick ?? Object.values(suggestion.methods)[0]

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-balance font-display text-4xl font-medium leading-tight tracking-tight text-ink-950">
              {suggestion.emoji} Never pickled{' '}
              {suggestion.name.toLowerCase()}? Ready in ~{info.readyDays}
              &nbsp;day{info.readyDays === 1 ? '' : 's'}.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              {info.note} {suggestion.tip}
            </p>
          </div>
          <button
            onClick={() => onPickle(suggestion.id)}
            className="ease-lux group flex shrink-0 items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-ink-950 ring-1 ring-ink-950/[0.08] shadow-[var(--shadow-soft)] transition-all duration-500 hover:ring-pickle-400 active:scale-[0.98]"
          >
            Pickle it
            <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-pickle-100 text-pickle-700 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5">
              ↗
            </span>
          </button>
        </div>
      </Reveal>
    </section>
  )
}

function PickleLog({ batches }: { batches: Array<Doc<'batches'>> }) {
  const remove = useMutation(api.batches.remove)
  const setStatus = useMutation(api.batches.setStatus)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
      <Reveal>
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink-950">
          The pickle log
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Jars that have gone to a better place.
        </p>
        <ul className="mt-6 overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-ink-950/[0.06] shadow-[var(--shadow-soft)]">
          {batches.map((batch) => {
            const entry = getGuideEntry(batch.ingredientId)
            return (
              <li
                key={batch._id}
                className="flex flex-wrap items-center gap-3 border-b border-ink-950/[0.04] px-6 py-4 text-sm last:border-0"
              >
                <span className="text-xl">{entry?.emoji ?? '🥒'}</span>
                <span className="font-semibold text-ink-950">
                  {batch.name}
                </span>
                <span className="text-ink-400">
                  jarred {formatDate(batch.startedAt)}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                    batch.status === 'eaten'
                      ? 'bg-pickle-100 text-pickle-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {batch.status === 'eaten' ? 'Eaten' : 'Tossed'}
                </span>
                <span className="ml-auto flex gap-4">
                  <button
                    onClick={() =>
                      void setStatus({ id: batch._id, status: 'active' })
                    }
                    className="text-xs font-semibold text-pickle-600 hover:text-pickle-800"
                  >
                    Back on the shelf
                  </button>
                  <button
                    onClick={() => void remove({ id: batch._id })}
                    className="text-xs font-semibold text-red-800/50 hover:text-red-800"
                  >
                    Delete
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}

function NewBatchForm({
  initialIngredientId,
  customRecipes,
  onDone,
}: {
  initialIngredientId: string
  customRecipes: Array<Doc<'recipes'>>
  onDone: () => void
}) {
  const create = useMutation(api.batches.create)

  const [ingredientId, setIngredientId] = React.useState(initialIngredientId)
  const entry = getGuideEntry(ingredientId)
  const availableMethods = Object.keys(
    entry?.methods ?? {},
  ) as Array<PicklingMethod>

  const [method, setMethod] = React.useState<PicklingMethod>('quick')
  const effectiveMethod = availableMethods.includes(method)
    ? method
    : availableMethods[0]
  const methodInfo = entry?.methods[effectiveMethod]

  const compatibleBrines = BRINE_RECIPES.filter(
    (recipe) => recipe.method === effectiveMethod,
  )
  const compatibleCustom = customRecipes.filter(
    (recipe) => recipe.method === effectiveMethod,
  )
  const [brineId, setBrineId] = React.useState('classic-dill')
  const brineIsValid =
    compatibleBrines.some((recipe) => recipe.id === brineId) ||
    compatibleCustom.some((recipe) => recipe._id === brineId) ||
    brineId === 'custom'
  const effectiveBrineId = brineIsValid
    ? brineId
    : (compatibleBrines[0]?.id ?? 'custom')

  const [name, setName] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [startDate, setStartDate] = React.useState(
    () => new Date().toISOString().slice(0, 10),
  )
  const [readyDays, setReadyDays] = React.useState<number | ''>('')
  const [shelfLifeDays, setShelfLifeDays] = React.useState<number | ''>('')
  const [saving, setSaving] = React.useState(false)

  const resolvedReadyDays = readyDays === '' ? methodInfo?.readyDays : readyDays
  const resolvedShelfLife =
    shelfLifeDays === '' ? methodInfo?.shelfLifeDays : shelfLifeDays
  const placeholderName = entry
    ? `${METHOD_LABELS[effectiveMethod].split(' ')[0]} pickled ${entry.name.toLowerCase()}s`
    : ''

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (
      !entry ||
      resolvedReadyDays === undefined ||
      resolvedShelfLife === undefined
    ) {
      return
    }
    setSaving(true)
    try {
      await create({
        name: name.trim() || placeholderName,
        ingredientId,
        method: effectiveMethod,
        brineId: effectiveBrineId,
        startedAt: new Date(`${startDate}T12:00:00`).getTime(),
        readyDays: resolvedReadyDays,
        shelfLifeDays: resolvedShelfLife,
        notes: notes.trim() || undefined,
      })
      onDone()
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'ease-lux w-full rounded-xl border-0 bg-cream-100 px-3.5 py-2.5 text-sm text-ink-950 ring-1 ring-transparent transition-all duration-300 focus:bg-white focus:ring-pickle-400 outline-none'
  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400 mb-1.5'

  return (
    <Reveal>
      <div className="bezel">
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="bezel-core px-7 py-7 sm:px-9 sm:py-8"
        >
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-950">
            Start a new batch
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Pick your produce — we'll fill in the timing from the guide.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="ingredient" className={labelClass}>
                What are you pickling?
              </label>
              <select
                id="ingredient"
                value={ingredientId}
                onChange={(event) => setIngredientId(event.target.value)}
                className={inputClass}
              >
                {PICKLE_GUIDE.map((guideEntry) => (
                  <option key={guideEntry.id} value={guideEntry.id}>
                    {guideEntry.emoji} {guideEntry.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="method" className={labelClass}>
                Method
              </label>
              <select
                id="method"
                value={effectiveMethod}
                onChange={(event) =>
                  setMethod(event.target.value as PicklingMethod)
                }
                className={inputClass}
              >
                {availableMethods.map((availableMethod) => (
                  <option key={availableMethod} value={availableMethod}>
                    {METHOD_LABELS[availableMethod]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="brine" className={labelClass}>
                Brine
              </label>
              <select
                id="brine"
                value={effectiveBrineId}
                onChange={(event) => setBrineId(event.target.value)}
                className={inputClass}
              >
                <optgroup label="House brines">
                  {compatibleBrines.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.emoji} {recipe.name}
                    </option>
                  ))}
                </optgroup>
                {compatibleCustom.length > 0 && (
                  <optgroup label="Your recipes">
                    {compatibleCustom.map((recipe) => (
                      <option key={recipe._id} value={recipe._id}>
                        📓 {recipe.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                <option value="custom">✍️ Freestyle brine</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className={labelClass}>
                Batch name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={placeholderName}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="startDate" className={labelClass}>
                Jarred on
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="readyDays" className={labelClass}>
                  Days to ready
                </label>
                <input
                  id="readyDays"
                  type="number"
                  min={0}
                  value={
                    readyDays === '' ? (methodInfo?.readyDays ?? '') : readyDays
                  }
                  onChange={(event) =>
                    setReadyDays(
                      event.target.value === ''
                        ? ''
                        : Number(event.target.value),
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="shelfLifeDays" className={labelClass}>
                  Shelf life
                </label>
                <input
                  id="shelfLifeDays"
                  type="number"
                  min={1}
                  value={
                    shelfLifeDays === ''
                      ? (methodInfo?.shelfLifeDays ?? '')
                      : shelfLifeDays
                  }
                  onChange={(event) =>
                    setShelfLifeDays(
                      event.target.value === ''
                        ? ''
                        : Number(event.target.value),
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={2}
                placeholder="Extra garlic this time. Used the good vinegar."
                className={inputClass}
              />
            </div>
          </div>

          {methodInfo && (
            <p className="mt-6 rounded-xl bg-pickle-50 px-4 py-3 text-sm leading-relaxed text-ink-700 ring-1 ring-pickle-200/60">
              <span className="font-semibold text-pickle-700">
                From the guide:
              </span>{' '}
              {methodInfo.note} {entry.tip}
            </p>
          )}

          <div className="mt-7 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="ease-lux group flex items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-sm font-semibold text-cream-50 transition-all duration-500 hover:bg-pickle-800 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Jarring…' : 'Jar it'}
              <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5">
                🫙
              </span>
            </button>
            <button
              type="button"
              onClick={onDone}
              className="text-sm font-semibold text-ink-400 transition-colors duration-300 hover:text-ink-950"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Reveal>
  )
}
