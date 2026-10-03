import { useNavigate } from 'react-router-dom'
import { NOTIFICATION_TYPE_META, NOTIFICATION_TYPES } from '../../utils/constants'
import { timeAgo } from '../../utils/formatDate'
import NotificationIcon from './NotificationIcon'

/**
 * Single row used inside the notification dropdown. Compact, click-through, and marks itself read
 * before navigating to the notification's target.
 */
export function NotificationItem({ notification, onRead }) {
  const navigate = useNavigate()
  const meta = NOTIFICATION_TYPE_META[notification.type] || NOTIFICATION_TYPE_META[NOTIFICATION_TYPES.SYSTEM_ALERT]
  const isUnread = notification.status === 'UNREAD'

  const handleClick = () => {
    if (isUnread) onRead?.(notification.id)
    if (notification.actionUrl) navigate(notification.actionUrl)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition hover:bg-gray-50 ${
        isUnread ? `${meta.accent} border-l-brand-500` : 'border-l-transparent bg-white'
      }`}
    >
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.iconBg}`}>
        <NotificationIcon name={meta.icon} className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`truncate text-sm ${
              isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
            }`}
          >
            {notification.title}
          </span>
          {isUnread && <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />}
        </span>
        <span className="mt-0.5 block line-clamp-2 text-xs text-gray-500">{notification.message}</span>
        <span className="mt-1 block text-[11px] text-gray-400">{timeAgo(notification.createdAt)}</span>
      </span>
    </button>
  )
}

export default NotificationItem
