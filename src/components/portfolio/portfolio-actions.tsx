'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'
import { ProjectForm } from '@/components/portfolio/project-form'

export function PortfolioActions() {
  const [showCreate, setShowCreate] = useState(false)
  const router = useRouter()

  const handleCreated = () => {
    setShowCreate(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowCreate(true)}
          className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
        >
          Thêm Dự Án
        </button>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Tạo dự án mới">
        <ProjectForm onCreated={handleCreated} />
      </Modal>
    </>
  )
}
