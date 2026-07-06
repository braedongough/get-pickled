import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Get Pickled — small-batch pickle tracking',
      },
      {
        name: 'description',
        content:
          'Track every jar from brine day to best-by. Timing, shelf life, brines, and recipes for people who pickle.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
      },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-6xl">🫙</span>
      <h1 className="font-display text-3xl text-ink-950">
        This jar is empty
      </h1>
      <p className="text-ink-500">The page you're after isn't on the shelf.</p>
      <Link
        to="/"
        className="ease-lux mt-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-cream-50 transition-all duration-300 hover:bg-ink-700 active:scale-[0.98]"
      >
        Back to the shelf
      </Link>
    </div>
  ),
  component: RootComponent,
})

const NAV_LINKS = [
  { to: '/', label: 'Shelf' },
  { to: '/guide', label: 'Guide' },
  { to: '/recipes', label: 'Recipes' },
] as const

function RootComponent() {
  return (
    <RootDocument>
      <div className="noise-overlay" aria-hidden />
      <div className="flex min-h-[100dvh] flex-col">
        <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-5">
          <div className="pointer-events-auto flex w-max items-center gap-1 rounded-full bg-white/75 py-1.5 pl-4 pr-1.5 shadow-[var(--shadow-soft)] ring-1 ring-ink-950/[0.06] backdrop-blur-xl">
            <Link to="/" className="group mr-3 flex items-center gap-2">
              <span className="ease-lux text-lg transition-transform duration-500 group-hover:-rotate-[20deg]">
                🥒
              </span>
              <span className="font-display text-[17px] font-medium tracking-tight text-ink-950">
                Get Pickled
              </span>
            </Link>
            <nav className="flex items-center gap-0.5 text-[13px] font-semibold">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="ease-lux rounded-full px-3.5 py-2 text-ink-500 transition-all duration-300 hover:text-ink-950"
                  activeProps={{
                    className:
                      'ease-lux rounded-full px-3.5 py-2 bg-ink-950 text-cream-50 transition-all duration-300',
                  }}
                  activeOptions={{ exact: link.to === '/' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="flex-1">
          <Outlet />
        </div>

        <footer className="border-t border-ink-950/[0.06] py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center">
            <p className="font-display text-ink-950">
              Get Pickled — in a good way
            </p>
            <p className="text-sm text-ink-500">
              Keep it submerged, keep it cold, and when in doubt, throw it out.
            </p>
          </div>
        </footer>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
