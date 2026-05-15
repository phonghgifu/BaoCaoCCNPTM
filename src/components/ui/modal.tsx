'use client'

import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus management & simple tab trap
  useEffect(() => {
    if (!open) return

    const container = document.getElementById('modal-container')
    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    const focusables = container ? Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)) : []
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (first) first.focus()

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleTab)

    return () => {
      window.removeEventListener('keydown', handleTab)
      if (previouslyFocused) previouslyFocused.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div id="modal-container" role="dialog" aria-modal="true" aria-label={title || 'Modal'} className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6">
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        <div>{children}</div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
