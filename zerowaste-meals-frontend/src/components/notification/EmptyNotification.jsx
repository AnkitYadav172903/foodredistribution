import emptyIllustration from '../../assets/illustrations/notification.png'
import Button from '../common/Button'

/**
 * Empty state for the notification dropdown and the notifications page.
 */
export function EmptyNotification({
  title = 'No notifications yet',
  description = 'Activity on your donations and claims will show up here.',
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center ${
        compact ? 'px-5 py-10' : 'px-6 py-16'
      }`}
    >
      <img
        src={emptyIllustration}
        alt=""
        className={`object-contain opacity-90 ${compact ? 'mb-3 h-20 w-20' : 'mb-5 h-40 w-40'}`}
      />
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-xs text-xs text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyNotification
