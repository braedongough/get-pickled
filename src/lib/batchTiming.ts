const DAY_MS = 24 * 60 * 60 * 1000

export type BatchPhase = 'pickling' | 'ready' | 'eat-soon' | 'gone-off'

export type BatchTiming = {
  phase: BatchPhase
  progress: number
  readyAt: number
  expiresAt: number
  daysUntilReady: number
  daysUntilExpiry: number
}

const EAT_SOON_WINDOW_DAYS = 7

export function getBatchTiming(batch: {
  startedAt: number
  readyDays: number
  shelfLifeDays: number
}): BatchTiming {
  const now = Date.now()
  const readyAt = batch.startedAt + batch.readyDays * DAY_MS
  const expiresAt = readyAt + batch.shelfLifeDays * DAY_MS
  const progress = Math.min(
    1,
    Math.max(0, (now - batch.startedAt) / (readyAt - batch.startedAt || 1)),
  )

  let phase: BatchPhase = 'pickling'
  if (now >= expiresAt) {
    phase = 'gone-off'
  } else if (now >= expiresAt - EAT_SOON_WINDOW_DAYS * DAY_MS) {
    phase = 'eat-soon'
  } else if (now >= readyAt) {
    phase = 'ready'
  }

  return {
    phase,
    progress,
    readyAt,
    expiresAt,
    daysUntilReady: Math.ceil((readyAt - now) / DAY_MS),
    daysUntilExpiry: Math.ceil((expiresAt - now) / DAY_MS),
  }
}

export const PHASE_LABELS: Record<BatchPhase, string> = {
  pickling: 'Still picklin’',
  ready: 'Ready to eat',
  'eat-soon': 'Eat soon!',
  'gone-off': 'Past its best',
}

// Locale is pinned: server-rendered HTML must match the client exactly,
// otherwise React hydration fails on every date.
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
