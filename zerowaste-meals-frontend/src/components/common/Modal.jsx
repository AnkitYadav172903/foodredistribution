import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, children, title, className = '' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 animate-fade-in bg-brand-900/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg animate-fade-in-up overflow-hidden rounded-3xl bg-white shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-display text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <div className={`p-5 ${className}`}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function ImagePreviewModal({ open, onClose, src, alt = '' }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} className="bg-transparent p-0" title={alt}>
      <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-2">
        <img
          src={src}
          alt={alt}
          className="max-h-[70vh] w-auto rounded-xl object-contain shadow-soft"
        />
      </div>
    </Modal>
  )
}

export default Modal