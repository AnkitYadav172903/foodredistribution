import { useEffect, useRef, useState } from 'react'
import { useNotificationsContext } from '../../context/NotificationContext'
import NotificationBadge from './NotificationBadge'
import NotificationDropdown from './NotificationDropdown'

/**
 * Notification bell with live unread badge and a dropdown of recent activity.
 *
 * Badge count is driven entirely by WebSocket pushes and REST state — there is no polling.
 */
export function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotificationsContext()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition ${
          open ? 'bg-brand-50 ring-brand-200' : 'bg-gray-50 ring-gray-200 hover:bg-gray-100'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <NotificationBadge count={unreadCount} />
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

export default NotificationBell
