import { useCallback, useEffect, useMemo, useState } from 'react'
import notificationService from '../services/notificationService'
import { NOTIFICATION_FILTERS } from '../utils/constants'

/**
 * Notification list state plus the read/delete mutations.
 *
 * Kept separate from NotificationContext so the dropdown and the full page can drive the same
 * behaviour, and so a pushed notification can update both without duplicating fetch logic.
 *
 * The list and the unread count live in one state object rather than two. Every mutation touches
 * both, and a single atomic update is what stops a WebSocket push that races the initial REST
 * fetch from inserting a duplicate row while still bumping the badge.
 */
export function useNotifications({ enabled = true } = {}) {
  const [state, setState] = useState({ notifications: [], unreadCount: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { notifications, unreadCount } = state

  const refresh = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const [list, count] = await Promise.all([
        notificationService.getAll({ limit: 50 }),
        notificationService.getUnreadCount(),
      ])
      setState({
        notifications: Array.isArray(list) ? list : [],
        unreadCount: count ?? 0,
      })
      setError(null)
    } catch (err) {
      setError(err.message || 'Could not load notifications.')
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) refresh()
  }, [enabled, refresh])

  const markAsRead = useCallback(async (id) => {
    let updated = null
    try {
      updated = await notificationService.markAsRead(id)
    } catch (err) {
      setError(err.message || 'Could not mark notification as read.')
      return
    }

    setState((prev) => {
      const target = prev.notifications.find((n) => n.id === id)
      // Only spend a count if the notification was actually unread, so a repeated call on an
      // already-read row cannot drive the badge below the server's value.
      if (!target || target.status !== 'UNREAD') return prev
      return {
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, ...(updated || {}), status: 'READ' } : n,
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }
    })
  }, [])

  const markAllAsRead = useCallback(async () => {
    const previous = state
    // Optimistic: the badge should clear immediately, and roll back if the call fails.
    setState((prev) => ({
      notifications: prev.notifications.map((n) => ({ ...n, status: 'READ' })),
      unreadCount: 0,
    }))

    try {
      await notificationService.markAllAsRead()
    } catch (err) {
      setState(previous)
      setError(err.message || 'Could not mark all notifications as read.')
    }
  }, [state])

  const remove = useCallback(async (id) => {
    const snapshot = state
    setState((prev) => {
      const target = prev.notifications.find((n) => n.id === id)
      return {
        notifications: prev.notifications.filter((n) => n.id !== id),
        unreadCount:
          target?.status === 'UNREAD' ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
      }
    })

    try {
      await notificationService.remove(id)
    } catch (err) {
      setState(snapshot)
      setError(err.message || 'Could not delete notification.')
    }
  }, [state])

  const applyIncoming = useCallback((notification) => {
    if (!notification?.id) return
    setState((prev) => {
      if (prev.notifications.some((n) => n.id === notification.id)) return prev
      return {
        notifications: [notification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1,
      }
    })
  }, [])

  const filterBy = useCallback(
    (filter) => {
      if (filter === NOTIFICATION_FILTERS.UNREAD) {
        return notifications.filter((n) => n.status === 'UNREAD')
      }
      if (filter === NOTIFICATION_FILTERS.READ) {
        return notifications.filter((n) => n.status === 'READ')
      }
      return notifications
    },
    [notifications],
  )

  return useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      refresh,
      markAsRead,
      markAllAsRead,
      remove,
      applyIncoming,
      filterBy,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      refresh,
      markAsRead,
      markAllAsRead,
      remove,
      applyIncoming,
      filterBy,
    ],
  )
}

export default useNotifications
