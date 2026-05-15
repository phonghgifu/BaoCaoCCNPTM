'use client'

export function PostActions() {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-2xl border border-(--surface-border) bg-(--surface-soft) px-4 py-2.5 text-gray-700 transition hover:bg-(--surface-solid)"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          alert('Đã sao chép liên kết!')
        }}
      >
        <span>🔗</span>
        <span className="text-sm font-medium">Chia sẻ</span>
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-2xl border border-(--surface-border) bg-(--surface-soft) px-4 py-2.5 text-gray-700 transition hover:bg-(--surface-solid)"
      >
        <span>🔖</span>
        <span className="text-sm font-medium">Lưu</span>
      </button>
    </div>
  )
}
