import type { SupabaseClient } from '@supabase/supabase-js'
import { deriveTags, type ContentPost } from '@/lib/content'
import type { Post, PostStatus, UserRole } from '@/types/database'
import type { SearchPostResult } from '@/types/app'

const SEARCH_LIMIT = 100

type PostEditorInput = {
  title: string
  content?: string | null
  excerpt?: string | null
  image_url?: string | null
  status?: PostStatus
}

function isElevatedRole(role?: UserRole | null) {
  return role === 'admin' || role === 'editor'
}

export function generatePostSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function getCurrentUserRole(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) throw error
  return (data?.role ?? 'user') as UserRole
}

function normalizeQuery(query: string) {
  return query
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSearchSpace(post: Pick<ContentPost, 'title' | 'excerpt' | 'content' | 'slug'>) {
  return normalizeQuery([post.title, post.excerpt, post.content, post.slug].filter(Boolean).join(' '))
}

function matchesTagSearch(post: Pick<ContentPost, 'title' | 'excerpt' | 'content' | 'slug'>, normalizedQuery: string) {
  return deriveTags(post).some((tag) => {
    const normalizedTag = tag.toLowerCase()
    return normalizedTag.includes(normalizedQuery) || normalizedQuery.includes(normalizedTag)
  })
}

function matchesTextSearch(post: Pick<ContentPost, 'title' | 'excerpt' | 'content' | 'slug'>, normalizedQuery: string) {
  return getSearchSpace(post).includes(normalizedQuery)
}

export async function searchPublishedPosts(client: SupabaseClient, query: string, limit = SEARCH_LIMIT) {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    const { data, error } = await client
      .from('posts')
      .select(`
        *,
        profiles (
          display_name,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data ?? []) as SearchPostResult[]
  }

  const { data: rpcData, error: rpcError } = await client.rpc('search_posts', {
    search_query: query,
  })

  if (!rpcError && Array.isArray(rpcData)) {
    return (rpcData as SearchPostResult[]).slice(0, limit)
  }

  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return ((data ?? []) as SearchPostResult[]).filter((post) => {
    return (
      matchesTextSearch(post, normalizedQuery) ||
      matchesTagSearch(post, normalizedQuery)
    )
  })
}

export async function getPublishedPostsPage(
  client: SupabaseClient,
  page = 1,
  pageSize = 6,
  sort: 'latest' | 'oldest' = 'latest',
) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  return client
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: sort === 'oldest' })
    .range(from, to)
}

export async function getPostBySlug(client: SupabaseClient, slug: string) {
  return client
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
}

export async function getPostById(client: SupabaseClient, id: string, authorId?: string) {
  let query = client.from('posts').select('*').eq('id', id)

  if (authorId) {
    query = query.eq('author_id', authorId)
  }

  return query.single()
}

export function toSlug(text: string) {
  return generatePostSlug(text)
}

export async function getDashboardPosts(client: SupabaseClient, userId: string): Promise<Post[]> {
  const role = await getCurrentUserRole(client, userId)

  let query = client
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url,
        role
      )
    `)
    .order('created_at', { ascending: false })

  if (!isElevatedRole(role)) {
    query = query.eq('author_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Post[]
}

export async function getEditablePostById(client: SupabaseClient, id: string, userId: string): Promise<Post> {
  const role = await getCurrentUserRole(client, userId)

  let query = client.from('posts').select('*').eq('id', id)

  if (!isElevatedRole(role)) {
    query = query.eq('author_id', userId)
  }

  const { data, error } = await query.single()

  if (error) throw error
  return data as Post
}

export async function savePost(client: SupabaseClient, input: PostEditorInput, postId?: string) {
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('Bạn cần đăng nhập để lưu bài viết')

  const role = await getCurrentUserRole(client, user.id)
  const payload = {
    title: input.title,
    slug: generatePostSlug(input.title),
    content: input.content ?? null,
    excerpt: input.excerpt ?? null,
    image_url: input.image_url ?? null,
    status: input.status ?? 'draft',
    author_id: user.id,
    published_at: input.status === 'published' ? new Date().toISOString() : null,
  }

  if (postId) {
    let query = client.from('posts').update(payload).eq('id', postId)

    if (!isElevatedRole(role)) {
      query = query.eq('author_id', user.id)
    }

    const { data, error } = await query.select('*').single()
    if (error) throw error
    return data
  }

  const { data, error } = await client.from('posts').insert(payload).select('*').single()
  if (error) throw error
  return data
}

export async function deletePost(client: SupabaseClient, id: string) {
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('Bạn cần đăng nhập để xóa bài viết')

  const role = await getCurrentUserRole(client, user.id)

  let query = client.from('posts').delete().eq('id', id)

  if (!isElevatedRole(role)) {
    query = query.eq('author_id', user.id)
  }

  const { error } = await query
  if (error) throw error

  return { success: true }
}
