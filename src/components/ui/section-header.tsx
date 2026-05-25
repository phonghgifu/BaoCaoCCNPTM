interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  variant?: 'default' | 'inverse'
}

export function SectionHeader({ eyebrow, title, description, variant = 'default' }: SectionHeaderProps) {
  const isInverse = variant === 'inverse'

  return (
    <div className="space-y-3">
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${isInverse ? 'text-blue-100' : 'text-blue-600'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-black tracking-tight sm:text-4xl ${isInverse ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-2xl text-sm leading-7 sm:text-base ${isInverse ? 'text-blue-50' : 'text-slate-600 dark:text-slate-400'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
