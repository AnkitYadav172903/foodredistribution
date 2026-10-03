import { useNavigate } from 'react-router-dom'
import { NOTIFICATION_TYPE_META, NOTIFICATION_TYPES } from '../../utils/constants'
import { formatDateTime, timeAgo } from '../../utils/formatDate'
import NotificationIcon from './NotificationIcon'

/**
 * Full notification row for the notifications page: type chip, absolute timestamp, delete control
 * and an explicit action button.
 */
export function NotificationCard({ notification, onRead, onDelete }) {
  const navigate = useNavigate()
  const meta = NOTIFICATION_TYPE_META[notification.type] || NOTIFICATION_TYPE_META[NOTIFICATION_TYPES.SYSTEM_ALERT]
  const isUnread = notification.status === 'UNREAD'

  const handleAction = () => {
    if (isUnread) onRead?.(notification.id)
    if (notification.actionUrl) navigate(notification.actionUrl)
  }

  return (
    <article
      className={`relative rounded-2xl border p-4 shadow-card transition sm:p-5 ${
        isUnread ? meta.accent : 'border-gray-100 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}>
          <NotificationIcon name={meta.icon} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.iconBg}`}
            >
              {meta.label}
            </span>
            {isUnread && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-700">
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                New
              </span>
            )}
          </div>

          <h3
            className={`mt-2 text-sm sm:text-base ${
              isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
            }`}
          >
            {notification.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <time
              className="text-xs text-gray-400"
              dateTime={notification.createdAt}
              title={formatDateTime(notification.createdAt)}
            >
              {timeAgo(notification.createdAt)}
            </time>

            {notification.actionUrl && (
              <button
                type="button"
                onClick={handleAction}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
              >
                View
              </button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => onDelete?.(notification.id)}
            className="rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Delete notification"
            title="Delete"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7V5h6v2m-9 0l1 13h10l1-13" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

export default NotificationCard
