export interface ContentProfile {
  display_name?: string | null
  avatar_url?: string | null
}

export interface ContentPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  status?: string
  created_at?: string
  published_at?: string | null
  author_id?: string
  profiles?: ContentProfile
}

const CATEGORY_RULES: Array<{ label: string; terms: string[] }> = [
  { label: 'Supabase & Backend', terms: ['supabase', 'database', 'auth', 'rls', 'postgres', 'storage'] },
  { label: 'Frontend & UI', terms: ['ui', 'ux', 'react', 'next', 'tailwind', 'component', 'design'] },
  { label: 'Productivity', terms: ['workflow', 'product', 'project', 'dashboard', 'admin'] },
  { label: 'Portfolio', terms: ['portfolio', 'cv', 'profile', 'career', 'job'] },
  { label: 'Engineering', terms: ['api', 'performance', 'seo', 'testing', 'debug', 'architecture'] },
]

const TAG_RULES: Array<{ label: string; terms: string[] }> = [
  { label: 'Next.js', terms: ['next', 'app router', 'server action'] },
  { label: 'React', terms: ['react', 'component', 'client component'] },
  { label: 'Supabase', terms: ['supabase', 'postgres', 'rls', 'storage'] },
  { label: 'UI/UX', terms: ['ui', 'ux', 'design', 'layout'] },
  { label: 'SEO', terms: ['seo', 'metadata', 'open graph', 'og'] },
  { label: 'Realtime', terms: ['realtime', 'subscription', 'notification'] },
]

const STOPWORDS = new Set([
  'and', 'the', 'for', 'with', 'from', 'into', 'this', 'that', 'your', 'you', 'và', 'cho', 'của', 'theo', 'một', 'những', 'các',
])

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSearchSpace(post: Pick<ContentPost, 'title' | 'excerpt' | 'content' | 'slug'>) {
  return normalize([post.title, post.excerpt, post.content, post.slug].filter(Boolean).join(' '))
}

export function deriveCategory(post: Pick<ContentPost, 'title' | 'excerpt' | 'content' | 'slug'>) {
  const searchSpace = getSearchSpace(post)

  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((term) => searchSpace.includes(term))) {
      return rule.label
    }
  }

  return 'General'
}

export function deriveTags(post: Pick<ContentPost, 'title' | 'excerpt' | 'content' | 'slug'>) {
  const searchSpace = getSearchSpace(post)
  const tags = new Set<string>()

  for (const rule of TAG_RULES) {
    if (rule.terms.some((term) => searchSpace.includes(term))) {
      tags.add(rule.label)
    }
  }

  const words = normalize(post.title)
    .split(' ')
    .filter((word) => word.length > 3 && !STOPWORDS.has(word))
    .slice(0, 3)

  words.forEach((word) => tags.add(word.charAt(0).toUpperCase() + word.slice(1)))

  return Array.from(tags).slice(0, 4)
}

export function estimateReadTime(post: Pick<ContentPost, 'content' | 'excerpt'>) {
  const source = [post.content, post.excerpt].filter(Boolean).join(' ')
  const words = source.trim() ? source.trim().split(/\s+/).length : 0
  return Math.max(1, Math.ceil(words / 180))
}

export function getRelatedPosts(currentPost: ContentPost, posts: ContentPost[], limit = 3) {
  const currentCategory = deriveCategory(currentPost)
  const currentTags = deriveTags(currentPost).map((tag) => tag.toLowerCase())
  const currentTokens = normalize(currentPost.title)
    .split(' ')
    .filter((word) => word.length > 3)

  return posts
    .filter((post) => post.id !== currentPost.id && post.status === 'published')
    .map((post) => {
      const candidateCategory = deriveCategory(post)
      const candidateTags = deriveTags(post).map((tag) => tag.toLowerCase())
      const candidateText = normalize([post.title, post.excerpt, post.content].filter(Boolean).join(' '))

      let score = 0

      if (candidateCategory === currentCategory) score += 4
      if (post.author_id && currentPost.author_id && post.author_id === currentPost.author_id) score += 2

      score += candidateTags.filter((tag) => currentTags.includes(tag)).length * 2
      score += currentTokens.filter((token) => candidateText.includes(token)).length

      return { post, score }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.post)
}
