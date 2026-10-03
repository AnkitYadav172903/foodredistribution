import { Link } from 'react-router-dom'
import { SkeletonCard } from '../common/Skeleton'
import EmptyNotification from './EmptyNotification'
import NotificationItem from './NotificationItem'

/**
 * Panel that opens under the bell showing the most recent notifications.
 */
export function NotificationDropdown({ notifications, unreadCount, loading, onRead, onMarkAllRead, onClose }) {
  const recent = notifications.slice(0, 8)

  return (
    <div className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] animate-slide-in overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lift sm:w-96">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-br from-brand-50 to-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Notifications</p>
          <p className="text-xs text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-white"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 divide-y divide-gray-50 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="space-y-2 p-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : recent.length === 0 ? (
          <div className="p-3">
            <EmptyNotification
              compact
              title="Nothing new"
              description="Updates about your donations and claims will appear here."
            />
          </div>
        ) : (
          recent.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onRead={onRead} />
          ))
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/60 p-1.5">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-brand-700 transition hover:bg-white"
        >
          View all notifications
        </Link>
      </div>
    </div>
  )
}

export default NotificationDropdown
