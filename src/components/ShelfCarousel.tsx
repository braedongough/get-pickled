import * as React from 'react'
import type { Doc } from '../../convex/_generated/dataModel'
import type { BatchPhase } from '~/lib/batchTiming'
import { getGuideEntry } from '~/data/pickleGuide'
import { PHASE_LABELS, getBatchTiming } from '~/lib/batchTiming'

const DRAG_DEG_PER_PX = 0.28
const CLICK_TOLERANCE_PX = 7

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360
}

function shortestDelta({ from, to }: { from: number; to: number }): number {
  return ((to - from) % 360 + 540) % 360 - 180
}

const PHASE_DOT: Record<BatchPhase, string> = {
  pickling: 'bg-amber-400',
  ready: 'bg-pickle-500',
  'eat-soon': 'bg-orange-500',
  'gone-off': 'bg-red-500',
}

export function ShelfCarousel({
  batches,
  onFrontChange,
}: {
  batches: Array<Doc<'batches'>>
  onFrontChange: (index: number) => void
}) {
  const count = batches.length
  const step = 360 / count
  const radius =
    count === 1 ? 0 : Math.max(300, Math.ceil((count * 250) / (2 * Math.PI)))

  const [rotation, setRotation] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const rotationRef = React.useRef(0)
  const dragState = React.useRef({ startX: 0, startRotation: 0, moved: 0 })
  const stageRef = React.useRef<HTMLDivElement>(null)

  const frontIndex = normalizeDeg(-rotation) / step
  const settledFront = ((Math.round(frontIndex) % count) + count) % count

  const applyRotation = (next: number) => {
    rotationRef.current = next
    setRotation(next)
    const index =
      ((Math.round(normalizeDeg(-next) / step) % count) + count) % count
    onFrontChange(index)
  }

  // Keep rotation valid when jars are added or removed
  React.useEffect(() => {
    rotationRef.current = 0
    setRotation(0)
    onFrontChange(0)
  }, [count, onFrontChange])

  const rotateToIndex = (index: number) => {
    const current = rotationRef.current
    applyRotation(current + shortestDelta({ from: current, to: -index * step }))
  }

  const rotateBy = (direction: 1 | -1) => {
    const snapped = Math.round(rotationRef.current / step) * step
    applyRotation(snapped - direction * step)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (count < 2) {
      return
    }
    setDragging(true)
    dragState.current = {
      startX: event.clientX,
      startRotation: rotationRef.current,
      moved: 0,
    }

    const onMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragState.current.startX
      dragState.current.moved = Math.max(
        dragState.current.moved,
        Math.abs(deltaX),
      )
      rotationRef.current =
        dragState.current.startRotation + deltaX * DRAG_DEG_PER_PX
      setRotation(rotationRef.current)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setDragging(false)
      applyRotation(Math.round(rotationRef.current / step) * step)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      rotateBy(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      rotateBy(-1)
    }
  }

  const wasDrag = () => dragState.current.moved > CLICK_TOLERANCE_PX

  return (
    <div className="relative">
      <div
        ref={stageRef}
        role="listbox"
        aria-label="Your jars — drag or use arrow keys to spin the shelf"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className={`shelf-stage relative mx-auto h-[420px] w-full max-w-4xl select-none touch-pan-y ${
          count > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
      >
        <div
          className={`shelf-ring absolute inset-0 ${dragging ? '' : 'shelf-ring-settle'}`}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {batches.map((batch, index) => {
            const angle = normalizeDeg(index * step + rotation)
            const frontness = Math.cos((angle * Math.PI) / 180)
            const presence = Math.pow((frontness + 1) / 2, 1.6)
            const isFront = index === settledFront
            // Jars past the side of the ring face away — fade them out
            // entirely so labels never show mirrored through the back.
            const hidden = frontness < -0.05

            return (
              <div
                key={batch._id}
                className="jar-item absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
                }}
              >
                <button
                  type="button"
                  aria-label={`View ${batch.name}`}
                  aria-selected={isFront}
                  role="option"
                  onClick={() => {
                    if (!wasDrag()) {
                      rotateToIndex(index)
                    }
                  }}
                  className="ease-lux transition-[opacity,transform] duration-500"
                  style={{
                    opacity: hidden ? 0 : 0.25 + 0.75 * presence,
                    pointerEvents: hidden ? 'none' : undefined,
                    transform: `scale(${0.84 + 0.16 * presence})`,
                  }}
                >
                  <JarVisual batch={batch} featured={isFront} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Soft floor shadow anchoring the scene */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto h-14 w-[68%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(35,38,28,0.16),rgba(35,38,28,0)_68%)]" />
      </div>

      {count > 1 && (
        <div className="mt-2 flex items-center justify-center gap-5">
          <ShelfArrow direction="left" onClick={() => rotateBy(-1)} />
          <div className="flex items-center gap-1.5">
            {batches.map((batch, index) => (
              <button
                key={batch._id}
                type="button"
                aria-label={`Jar ${index + 1} of ${count}`}
                onClick={() => rotateToIndex(index)}
                className={`ease-lux h-1.5 rounded-full transition-all duration-500 ${
                  index === settledFront
                    ? 'w-6 bg-pickle-500'
                    : 'w-1.5 bg-ink-950/15 hover:bg-ink-950/30'
                }`}
              />
            ))}
          </div>
          <ShelfArrow direction="right" onClick={() => rotateBy(1)} />
        </div>
      )}
    </div>
  )
}

function ShelfArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Previous jar' : 'Next jar'}
      onClick={onClick}
      className="ease-lux group flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-ink-950/[0.07] shadow-[var(--shadow-soft)] transition-all duration-300 hover:ring-pickle-300 active:scale-[0.94]"
    >
      <span
        className={`ease-lux text-ink-700 transition-transform duration-300 ${
          direction === 'left'
            ? 'group-hover:-translate-x-0.5'
            : 'group-hover:translate-x-0.5'
        }`}
      >
        {direction === 'left' ? '←' : '→'}
      </span>
    </button>
  )
}

function JarVisual({
  batch,
  featured,
}: {
  batch: Doc<'batches'>
  featured: boolean
}) {
  const entry = getGuideEntry(batch.ingredientId)
  const timing = getBatchTiming(batch)
  const emoji = entry?.emoji ?? '🥒'
  const fillPercent = Math.round(34 + timing.progress * 54)

  return (
    <div className="w-[190px] sm:w-[215px]">
      {/* Lid */}
      <div className="jar-lid mx-auto h-5 w-[70%] rounded-t-[14px]" />
      <div className="jar-lid mx-auto -mt-px h-2 w-[78%] rounded-[3px]" />

      {/* Glass body */}
      <div className="jar-glass relative h-[248px] overflow-hidden rounded-b-[3rem] rounded-t-[10px] ring-1 ring-ink-950/[0.06]">
        <div
          className="jar-brine absolute inset-x-0 bottom-0"
          style={{ height: `${fillPercent}%` }}
        >
          {featured && timing.phase === 'pickling' && (
            <>
              <span className="animate-bubble absolute bottom-3 left-[22%] h-1.5 w-1.5 rounded-full bg-white/70" />
              <span
                className="animate-bubble absolute bottom-6 left-[58%] h-1 w-1 rounded-full bg-white/60"
                style={{ animationDelay: '1.2s' }}
              />
              <span
                className="animate-bubble absolute bottom-2 left-[76%] h-2 w-2 rounded-full bg-white/50"
                style={{ animationDelay: '2.1s' }}
              />
            </>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-around text-[26px]">
          <span className="animate-bob">{emoji}</span>
          <span className="animate-bob" style={{ animationDelay: '1s' }}>
            {emoji}
          </span>
          <span className="animate-bob" style={{ animationDelay: '2s' }}>
            {emoji}
          </span>
        </div>

        {/* Minimal label — details live in the panel below the shelf */}
        <div className="absolute inset-x-4 top-8 rounded-xl bg-white/90 px-3.5 py-3 text-center shadow-[var(--shadow-soft)] ring-1 ring-ink-950/[0.05]">
          <p className="font-display text-[17px] leading-snug text-ink-950">
            {batch.name}
          </p>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-ink-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${PHASE_DOT[timing.phase]}`}
            />
            {timing.phase === 'pickling'
              ? `${Math.round(timing.progress * 100)}% there`
              : PHASE_LABELS[timing.phase]}
          </p>
        </div>
      </div>
    </div>
  )
}
