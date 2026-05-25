import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CommentForm } from '@/components/posts/comment-form'
import { CommentList } from '@/components/posts/comment-list'
import { LikeButton } from '@/components/posts/like-button'
import { PostActions } from '@/components/posts/post-actions'
import { deriveCategory, deriveTags, estimateReadTime, getRelatedPosts } from '@/lib/content'

/* eslint-disable @next/next/no-img-element */

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return {
    title: post?.title || 'Bài viết',
    description: post?.excerpt || '',
    openGraph: {
      title: post?.title || 'Bài viết',
      description: post?.excerpt || '',
      type: 'article',
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
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

  if (error || !post) {
    notFound()
  }

  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post.id)

  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('post_id', post.id)
    .order('created_at', { ascending: true })

  const { data: recentPosts } = await supabase
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
    .limit(12)

  const { data: { user } } = await supabase.auth.getUser()

  const tags = deriveTags(post)
  const readTime = estimateReadTime(post)
  const relatedPosts = getRelatedPosts(post, recentPosts || [], 3)

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-(--surface-border) bg-(--page-bg) bg-opacity-95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            ← Quay lại
          </Link>
        </div>
      </nav>

      <main>
        <article>
          {/* Hero Image Section */}
          <div className="relative min-h-125 w-full overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 sm:min-h-150">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content overlay */}
            <div className="relative flex h-full flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-4xl">
                {/* Tags on image */}
                {tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm border border-white/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Title on image */}
                <h1 className="text-4xl font-black leading-tight text-white drop-shadow-lg sm:text-5xl">
                  {post.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Author & Actions Section */}
          <div className="border-b border-(--surface-border) bg-(--page-bg)">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                {/* Author info */}
                <div className="flex items-center gap-4">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles?.display_name || 'Tác giả'}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-lg">
                      {post.profiles?.display_name?.[0] || 'A'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{post.profiles?.display_name || 'Ẩn danh'}</p>
                    <p className="text-sm text-gray-500">
                      <time>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : ''}
                      </time>
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <PostActions />
              </div>

              {/* Meta info */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>{readTime} phút đọc</span>
                <span>•</span>
                <span>{comments?.length || 0} bình luận</span>
              </div>
            </div>
          </div>

          {/* Post Content Section */}
          <div className="bg-(--page-bg)">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="space-y-6 text-lg leading-8 text-gray-700">
                {post.content?.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3 border-t border-(--surface-border) pt-8">
                <LikeButton postId={post.id} userId={user?.id || null} initialLikeCount={likeCount || 0} />
                <a href="#comments" className="rounded-2xl border border-(--surface-border) px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-(--surface-soft)">
                  Đi tới bình luận
                </a>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-(--page-bg) px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <section id="comments" className="rounded-4xl surface-card p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Discussion</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Bình luận ({comments?.length || 0})</h2>
                  </div>
                  <p className="text-sm text-gray-500">Tương tác realtime giúp bài viết sống động hơn.</p>
                </div>

                <div className="mt-6">
                  {user ? (
                    <CommentForm postId={post.id} />
                  ) : (
                    <p className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-gray-500">
                      <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                        Đăng nhập
                      </a>
                      {' '}để bình luận.
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <CommentList comments={comments || []} />
                </div>
              </section>
            </div>
          </div>

          {/* Related Posts Section */}
          <div className="border-t border-(--surface-border) bg-(--page-bg) px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-4xl surface-card p-6 sm:p-8 lg:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Bài viết liên quan</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">Đọc tiếp nội dung gần chủ đề này</h3>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.length > 0 ? relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/posts/${relatedPost.slug}`} className="group overflow-hidden rounded-2xl border border-(--surface-border) p-4 transition hover:border-blue-300 hover:bg-(--surface-soft)">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{deriveCategory(relatedPost)}</p>
                      <h4 className="mt-2 line-clamp-2 font-semibold text-gray-900 group-hover:text-blue-600">{relatedPost.title}</h4>
                      {relatedPost.excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{relatedPost.excerpt}</p>}
                    </Link>
                  )) : (
                    <p className="col-span-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      Chưa có bài viết liên quan phù hợp.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}