/**
 * Unread count bubble for the notification bell. Renders nothing when there is nothing unread.
 */
export function NotificationBadge({ count = 0, max = 99, className = '' }) {
  if (!count || count <= 0) return null

  const label = count > max ? `${max}+` : String(count)

  return (
    <span
      className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white ${className}`}
    >
      {label}
    </span>
  )
}

export default NotificationBadge
