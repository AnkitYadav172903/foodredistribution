import { useMemo, useState } from 'react'
import { useNotificationsContext } from '../../context/NotificationContext'
import { NOTIFICATION_FILTERS } from '../../utils/constants'
import { SkeletonCard } from '../common/Skeleton'
import EmptyNotification from './EmptyNotification'
import NotificationCard from './NotificationCard'

const TABS = [
  { key: NOTIFICATION_FILTERS.ALL, label: 'All' },
  { key: NOTIFICATION_FILTERS.UNREAD, label: 'Unread' },
  { key: NOTIFICATION_FILTERS.READ, label: 'Read' },
]

/**
 * Full notification history with All / Unread / Read filtering. Shared by the donor and NGO
 * notification pages, which differ only in where their notifications point.
 */
export function NotificationCenter({ emptyActionLabel, onEmptyAction }) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, remove, filterBy } =
    useNotificationsContext()
  const [filter, setFilter] = useState(NOTIFICATION_FILTERS.ALL)

  const visible = useMemo(() => filterBy(filter), [filterBy, filter])

  const counts = useMemo(
    () => ({
      [NOTIFICATION_FILTERS.ALL]: notifications.length,
      [NOTIFICATION_FILTERS.UNREAD]: notifications.filter((n) => n.status === 'UNREAD').length,
      [NOTIFICATION_FILTERS.READ]: notifications.filter((n) => n.status === 'READ').length,
    }),
    [notifications],
  )

  const handleDelete = async (id) => {
    await remove(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
              : 'You are all caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : visible.length === 0 ? (
        <EmptyNotification
          title={filter === NOTIFICATION_FILTERS.UNREAD ? 'No unread notifications' : 'No notifications yet'}
          description={
            filter === NOTIFICATION_FILTERS.UNREAD
              ? 'You have read everything for now.'
              : 'Activity on your donations and claims will show up here in real time.'
          }
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      ) : (
        <div className="space-y-3">
          {visible.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
