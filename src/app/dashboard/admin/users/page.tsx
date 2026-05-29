import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRoleManager } from '@/components/admin/user-role-manager'
import type { Profile } from '@/types/database'

export const metadata = {
  title: 'Quản trị người dùng',
  description: 'Cập nhật role cho admin, editor và user',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = false

  if (!isAdmin) {
    redirect('/dashboard')
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-6 py-8 text-slate-100 sm:px-8 lg:px-10">
          <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">
            Admin
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Quản trị người dùng</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Cập nhật role thật cho admin, editor và user ngay trong dashboard.
          </p>
        </div>

        <div className="bg-slate-50 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <UserRoleManager profiles={(profiles ?? []) as Profile[]} />
        </div>
      </div>
    </main>
  )
}
