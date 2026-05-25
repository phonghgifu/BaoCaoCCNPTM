import type { SupabaseClient } from '@supabase/supabase-js'
import { deriveCategory } from '@/lib/content'
import type { UserRole } from '@/types/database'
import type { DashboardOverview } from '@/types/app'

function canManageAllContent(role?: UserRole) {
  return role === 'admin' || role === 'editor'
}

export async function getDashboardOverview(client: SupabaseClient, userId?: string, role: UserRole = 'user'): Promise<DashboardOverview> {
  const postQuery = client
    .from('posts')
    .select('id, title, content, excerpt, slug, status, author_id, created_at, published_at, profiles(display_name, avatar_url)')

  if (userId && !canManageAllContent(role)) {
    postQuery.eq('author_id', userId)
  }

  const [postsResult, commentsResult, usersResult] = await Promise.all([
    postQuery.order('created_at', { ascending: false }),
    canManageAllContent(role)
      ? client.from('comments').select('id', { count: 'exact', head: true })
      : client
          .from('comments')
          .select('id, posts!inner(author_id)', { count: 'exact', head: true })
          .eq('posts.author_id', userId ?? ''),
    canManageAllContent(role)
      ? client.from('profiles').select('id', { count: 'exact', head: true })
      : client.from('profiles').select('id', { count: 'exact', head: true }).eq('id', userId ?? ''),
  ])

  const posts = (postsResult.data ?? []) as Array<{
    id: string
    title: string
    content: string | null
    excerpt: string | null
    slug: string
    status: 'draft' | 'published'
  }>

  const totalPosts = posts.length
  const publishedPosts = posts.filter((post) => post.status === 'published').length
  const draftPosts = posts.filter((post) => post.status === 'draft').length
  const totalComments = commentsResult.count ?? 0
  const totalUsers = usersResult.count ?? 0

  const latestTitles = posts.slice(0, 5).map((post) => post.title)

  const categoryBreakdownMap = posts.reduce<Record<string, number>>((accumulator, post) => {
    const category = deriveCategory(post)
    accumulator[category] = (accumulator[category] ?? 0) + 1
    return accumulator
  }, {})

  const categoryBreakdown = Object.entries(categoryBreakdownMap)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalComments,
    totalUsers,
    latestTitles,
    categoryBreakdown,
  }
}
