'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/types/database'

interface UserRoleManagerProps {
  profiles: Profile[]
}

export function UserRoleManager({ profiles }: UserRoleManagerProps) {
  const router = useRouter()
  const supabase = createClient()
  const [pendingRoles, setPendingRoles] = useState<Record<string, UserRole>>(
    Object.fromEntries(profiles.map((profile) => [profile.id, profile.role])) as Record<string, UserRole>,
  )
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateRole = async (profile: Profile) => {
    const nextRole = pendingRoles[profile.id] ?? profile.role

    setSavingId(profile.id)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: nextRole,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật role')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name || 'User avatar'}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                    {(profile.display_name || 'U').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{profile.display_name || 'Ẩn danh'}</p>
                  <p className="text-sm text-slate-500">{profile.id}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role hiện tại: {profile.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:w-72">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Chọn role mới
                </label>
                <select
                  value={pendingRoles[profile.id] ?? profile.role}
                  onChange={(event) =>
                    setPendingRoles((current) => ({
                      ...current,
                      [profile.id]: event.target.value as UserRole,
                    }))
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                >
                  <option value="user">user</option>
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  type="button"
                  onClick={() => updateRole(profile)}
                  disabled={savingId === profile.id || (pendingRoles[profile.id] ?? profile.role) === profile.role}
                  className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingId === profile.id ? 'Đang lưu...' : 'Cập nhật role'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
