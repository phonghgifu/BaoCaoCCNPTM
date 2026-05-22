import { PostForm } from '@/components/dashboard/post-form'

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="section-shell surface-card overflow-hidden">
        <div className="border-b border-[var(--surface-border)] bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-6 py-8 text-slate-100 sm:px-8 lg:px-10">
          <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">Dashboard</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Viết bài mới</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Soạn nội dung trong bố cục rộng, nhẹ và đồng bộ với giao diện mới của blog.
          </p>
        </div>

        <div className="bg-[var(--surface-solid)] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <PostForm />
        </div>
      </div>
    </main>
  )
}
