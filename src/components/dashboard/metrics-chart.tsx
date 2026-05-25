type BreakdownItem = {
  label: string
  count: number
}

interface MetricsChartProps {
  title: string
  subtitle?: string
  items: BreakdownItem[]
}

export function MetricsChart({ title, subtitle, items }: MetricsChartProps) {
  const max = Math.max(1, ...items.map((item) => item.count))

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600">Analytics</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h3>
        </div>
        {subtitle && <p className="max-w-xs text-right text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => {
            const width = Math.max(8, Math.round((item.count / max) * 100))

            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-blue-600 via-cyan-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          Chưa có đủ dữ liệu để hiển thị biểu đồ.
        </div>
      )}
    </section>
  )
}
