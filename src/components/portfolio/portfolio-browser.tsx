'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/portfolio/project-card'

type Project = {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string | null
  link: string | null
}

interface Props {
  projects: Project[]
}

export function PortfolioBrowser({ projects }: Props) {
  const [selectedTech, setSelectedTech] = useState('Tất cả')

  const technologies = useMemo(() => {
    const unique = new Set<string>()

    projects.forEach((project) => {
      project.technologies.forEach((tech) => unique.add(tech))
    })

    return ['Tất cả', ...Array.from(unique).sort()]
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (selectedTech === 'Tất cả') return projects

    return projects.filter((project) => project.technologies.includes(selectedTech))
  }, [projects, selectedTech])

  return (
    <>
      <section className="mb-12 rounded-[2rem] surface-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Lọc Theo Công Nghệ</p>
            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">Chọn công nghệ bạn muốn xem</h2>
          </div>
          <p className="text-sm text-[var(--surface-muted)]">{technologies.length - 1} nhóm công nghệ</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
          {technologies.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSelectedTech(tech)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedTech === tech
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200/40'
                  : 'bg-[var(--surface-soft)] text-[var(--page-fg)] hover:bg-blue-600 hover:text-white'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-black text-gray-900">Dự Án</h2>
          <p className="text-sm text-[var(--surface-muted)]">
            {filteredProjects.length} dự án
          </p>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-[2rem] border-dashed border-gray-300 p-10 text-center text-gray-600">
            Không có dự án nào phù hợp với công nghệ đang lọc.
          </div>
        )}
      </section>
    </>
  )
}