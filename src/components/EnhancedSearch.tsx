import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

// Phase 3: Enhanced search with analytics + debounce + relevance + autocomplete
// This component is generic and can be embedded in shop/article/community areas

// Input schema for client-side validation
const querySchema = z.object({
  q: z
    .string()
    .trim()
    .max(100, 'Query too long')
    .transform((s) => s.replace(/[\n\r\t]+/g, ' '))
    .refine((s) => /[\p{L}\p{N}]/u.test(s), {
      message: 'Enter at least one letter or number',
    }),
  area: z.enum(['shop', 'articles', 'community']).default('shop'),
})

// Lightweight client-side rate limit (per tab)
const RATE_LIMIT_WINDOW_MS = 10_000
const RATE_LIMIT_MAX = 10

function useRateLimit(key: string) {
  const [allowed, setAllowed] = useState(true)
  const historyRef = useRef<number[]>([])

  const check = useCallback(() => {
    const now = Date.now()
    historyRef.current = historyRef.current.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    setAllowed(historyRef.current.length < RATE_LIMIT_MAX)
  }, [])

  const mark = useCallback(() => {
    historyRef.current.push(Date.now())
    check()
  }, [check])

  useEffect(() => {
    const id = setInterval(check, 2000)
    return () => clearInterval(id)
  }, [check])

  return { allowed, mark }
}

// Debounce helper
function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// Basic client-side relevance function
function scoreItem(q: string, item: { title?: string; tags?: string[]; snippet?: string }) {
  const query = q.toLowerCase()
  const title = (item.title || '').toLowerCase()
  const snippet = (item.snippet || '').toLowerCase()
  const tags = (item.tags || []).map((t) => (t || '').toLowerCase())
  let score = 0
  if (title.includes(query)) score += 5
  if (snippet.includes(query)) score += 2
  for (const t of tags) if (t.includes(query)) score += 1
  // shorter distance bonus
  score += Math.max(0, 3 - Math.abs(title.length - query.length) / 20)
  return score
}

// Analytics event sender (to Supabase edge function or table)
async function trackSearchEvent(payload: {
  q: string
  area: 'shop' | 'articles' | 'community'
  type: 'input' | 'submit' | 'suggestion_click'
  suggestion?: string
}) {
  try {
    // Prefer Edge Function if available
    const res = await fetch('/api/analytics/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, ts: new Date().toISOString() }),
      keepalive: true,
    })
    if (!res.ok) {
      // fallback: direct supabase insert (anonymous, RLS-secured)
      await supabase.from('search_events').insert({
        query: payload.q,
        area: payload.area,
        event_type: payload.type,
        suggestion: payload.suggestion ?? null,
      })
    }
  } catch (e) {
    // swallow errors; analytics should never block UX
    console.debug('analytics error', e)
  }
}

// Fetch suggestions across areas via RPC or views
async function fetchSuggestions(q: string, area: 'shop' | 'articles' | 'community') {
  if (!q) return [] as any[]
  // Example RPC names: search_shop_suggestions, search_article_suggestions, search_forum_suggestions
  const rpc =
    area === 'shop'
      ? 'search_shop_suggestions'
      : area === 'articles'
      ? 'search_article_suggestions'
      : 'search_forum_suggestions'

  const { data, error } = await supabase.rpc(rpc, { q })
  if (error) throw error
  return data as Array<{ id: string; title: string; tags?: string[]; snippet?: string; url: string }>
}

export type EnhancedSearchProps = {
  area: 'shop' | 'articles' | 'community'
  placeholder?: string
  onSelect?: (item: { id: string; title: string; url: string }) => void
  className?: string
}

export default function EnhancedSearch({ area, placeholder, onSelect, className }: EnhancedSearchProps) {
  const [input, setInput] = useState('')
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const { allowed, mark } = useRateLimit(`search-${area}`)

  const debounced = useDebouncedValue(input, 300)

  const validResult = useMemo(() => {
    const parsed = querySchema.safeParse({ q: debounced, area })
    return parsed.success ? parsed.data : null
  }, [debounced, area])

  const { data: rawSuggestions = [], isFetching, refetch } = useQuery({
    queryKey: ['search-suggest', area, validResult?.q],
    queryFn: () => fetchSuggestions(validResult!.q, area),
    enabled: !!validResult?.q && allowed,
    staleTime: 30_000,
  })

  const suggestions = useMemo(() => {
    if (!validResult?.q) return [] as typeof rawSuggestions
    const scored = rawSuggestions
      .map((it) => ({ it, score: scoreItem(validResult.q, it) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.it)
    return scored
  }, [rawSuggestions, validResult])

  // Track typing events lightly (debounced value change)
  useEffect(() => {
    if (validResult?.q) trackSearchEvent({ q: validResult.q, area, type: 'input' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validResult?.q])

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!allowed) return
      const parsed = querySchema.safeParse({ q: input, area })
      if (!parsed.success) return
      mark()
      trackSearchEvent({ q: parsed.data.q, area, type: 'submit' })
      // Navigate to dedicated results page if available
      const base = area === 'shop' ? '/shop/search' : area === 'articles' ? '/articles/search' : '/community/search'
      window.location.assign(`${base}?q=${encodeURIComponent(parsed.data.q)}`)
    },
    [input, area, allowed, mark]
  )

  const onSuggestionClick = useCallback(
    (s: { id: string; title: string; url: string }) => {
      trackSearchEvent({ q: input, area, type: 'suggestion_click', suggestion: s.title })
      if (onSelect) onSelect(s)
      else window.location.assign(s.url)
    },
    [area, input, onSelect]
  )

  // Keyboard navigation in list
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions.length) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((p) => (p + 1) % suggestions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((p) => (p - 1 + suggestions.length) % suggestions.length)
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        const s = suggestions[focusedIndex]
        onSuggestionClick(s)
      }
    },
    [suggestions, focusedIndex, onSuggestionClick]
  )

  return (
    <div className={`relative ${className ?? ''}`}>
      <form onSubmit={onSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-controls="enhanced-suggest"
          placeholder={placeholder ?? 'Search pets, products, guides, discussions...'}
          className="w-full rounded-md border border-input bg-background pl-9 pr-10 py-2 focus:ring-2 focus:ring-primary theme-transition"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 press disabled:opacity-50"
          disabled={!allowed || !!validResult === false}
          aria-disabled={!allowed}
          title={!allowed ? 'Please wait a moment' : 'Search'}
        >
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go'}
        </button>
      </form>

      {validResult?.q && suggestions.length > 0 && (
        <ul
          id="enhanced-suggest"
          role="listbox"
          className="absolute z-50 mt-2 w-full glass-card bg-gradient-to-b from-background/80 to-background/40 border shadow-medium rounded-md overflow-hidden"
        >
          {suggestions.map((s, idx) => (
            <li
              key={s.id}
              role="option"
              aria-selected={idx === focusedIndex}
              onMouseEnter={() => setFocusedIndex(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSuggestionClick(s)}
              className={`px-3 py-2 cursor-pointer hover:bg-muted/60 ${idx === focusedIndex ? 'bg-muted/60' : ''}`}
            >
              <div className="text-sm font-medium">{s.title}</div>
              {s.snippet && <div className="text-xs text-muted-foreground line-clamp-1">{s.snippet}</div>}
            </li>
          ))}
        </ul>
      )}

      {!allowed && (
        <p className="mt-2 text-xs text-destructive-foreground bg-destructive/10 rounded px-2 py-1">You're searching too fast. Please wait a few seconds.</p>
      )}
    </div>
  )
}
