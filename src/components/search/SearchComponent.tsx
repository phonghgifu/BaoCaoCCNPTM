'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SearchSuggestion {
  id: string
  title: string
  type: 'post' | 'project'
}

/**
 * Debounced Search Component with Autocomplete
 * 
 * Features:
 * - Debounced API calls (300ms delay)
 * - Real-time autocomplete suggestions
 * - Keyboard navigation support
 * - Click-outside to close
 */
export function SearchComponent() {
  const router = useRouter()
  const supabase = createClient()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Debounced search function
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)

      try {
        // Search in posts
        const { data: posts } = await supabase
          .from('posts')
          .select('id, title')
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
          .limit(3)

        // Search in projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(3)

        const results: SearchSuggestion[] = [
          ...(posts || []).map((p: any) => ({ ...p, type: 'post' as const })),
          ...(projects || []).map((p: any) => ({ ...p, type: 'project' as const })),
        ]

        setSuggestions(results)
        setIsOpen(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  // Debounce timer
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const href = suggestion.type === 'post' ? `/posts/${suggestion.id}` : `/portfolio/${suggestion.id}`
    router.push(href)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSearch(e as any)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <input
            type="search"
            placeholder="Tìm bài viết, dự án..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 pr-12 text-sm placeholder-gray-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            aria-label="Tìm kiếm"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
          </svg>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border-2 border-gray-200 bg-white shadow-xl"
            role="listbox"
          >
            {isLoading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  Đang tìm kiếm...
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={`${suggestion.type}-${suggestion.id}`}
                    className={`transition ${
                      index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left text-sm transition hover:bg-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{suggestion.title}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {suggestion.type === 'post' ? '📝 Bài viết' : '🎯 Dự án'}
                          </p>
                        </div>
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Không tìm thấy kết quả nào
              </div>
            )}
          </div>
        )}
      </form>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
