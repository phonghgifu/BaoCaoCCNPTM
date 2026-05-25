import type { ContentPost } from '@/lib/content'

export type UserRole = 'admin' | 'editor' | 'user'
export type ThemeMode = 'light' | 'dark'
export type SearchScope = 'title' | 'tag' | 'content' | 'all'

export type SearchPostResult = Omit<ContentPost, 'profiles'> & {
  profiles?: {
    display_name?: string | null
    avatar_url?: string | null
  } | null
}

export interface DashboardMetric {
  label: string
  value: number | string
  helper?: string
  icon?: string
  tone?: 'blue' | 'emerald' | 'amber' | 'violet' | 'slate'
}

export interface DashboardBreakdownItem {
  label: string
  count: number
}

export interface DashboardOverview {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalComments: number
  totalUsers: number
  latestTitles: string[]
  categoryBreakdown: DashboardBreakdownItem[]
}
