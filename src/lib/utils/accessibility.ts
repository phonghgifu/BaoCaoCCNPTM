/**
 * Accessibility Utilities
 * 
 * Helpers for improving keyboard navigation and screen reader support
 */

/**
 * Handle keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
 * Useful for dropdowns, menus, and lists
 */
export function handleArrowKeyNavigation(
  event: React.KeyboardEvent,
  {
    currentIndex,
    itemCount,
    onSelectItem,
    onEscape,
  }: {
    currentIndex: number
    itemCount: number
    onSelectItem: (index: number) => void
    onEscape?: () => void
  }
) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = (currentIndex + 1) % itemCount
      onSelectItem(nextIndex)
      break

    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : itemCount - 1
      onSelectItem(prevIndex)
      break

    case 'Enter':
      event.preventDefault()
      onSelectItem(currentIndex)
      break

    case 'Escape':
      event.preventDefault()
      onEscape?.()
      break
  }
}

/**
 * Focus trap hook for modals, dialogs, etc.
 * Keeps focus within an element and cycles on Tab/Shift+Tab
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !containerRef.current) return

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  return handleKeyDown
}

/**
 * Generate unique ID for form labels and inputs (a11y)
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Skip to main content helper
 * Allows users to skip navigation with keyboard (often Ctrl+1)
 */
export function SkipToMainLink({ href = '#main' }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only fixed top-2 left-2 z-50 bg-blue-600 text-white px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      🔗 Nhảy đến nội dung chính
    </a>
  )
}

/**
 * Announce important updates to screen readers
 * Useful for dynamic content changes (toast notifications, form errors, etc.)
 */
export function useAnnounce() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div')
    el.setAttribute('role', 'status')
    el.setAttribute('aria-live', priority)
    el.setAttribute('aria-atomic', 'true')
    el.className = 'sr-only'
    el.textContent = message
    document.body.appendChild(el)

    // Auto-remove after announcement
    setTimeout(() => el.remove(), 1000)
  }

  return { announce }
}

/**
 * CSS classes for screen reader-only content
 * Use className="sr-only" for content that should only be visible to screen readers
 */
export const srOnlyStyles = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: auto;
}
`
