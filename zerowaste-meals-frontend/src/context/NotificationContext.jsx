import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useNotifications from '../hooks/useNotifications'
import useWebSocket from '../hooks/useWebSocket'
import storage from '../utils/storage'
import { primeNotificationSound, playNotificationSound } from '../utils/notificationSound'

export const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const token = isAuthenticated ? storage.getToken() : null

  const {
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
  } = useNotifications({ enabled: Boolean(isAuthenticated) })

  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  const handleIncoming = useCallback(
    (notification) => {
      applyIncoming(notification)
      playNotificationSound()
    },
    [applyIncoming],
  )

  const handleStatusChange = useCallback((status) => setConnectionStatus(status), [])

  useWebSocket(token, handleIncoming, handleStatusChange)

  // Browsers only allow audio after a gesture; unlock on the first interaction.
  useEffect(() => {
    if (!isAuthenticated) return undefined
    const unlock = () => primeNotificationSound()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [isAuthenticated])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      refresh,
      markAsRead,
      markAllAsRead,
      remove,
      filterBy,
      // Derived rather than read straight off the socket status, so signing out always reports
      // "disconnected" even though the last status the socket sent was "connected".
      isConnected: isAuthenticated && connectionStatus === 'connected',
      connectionStatus,
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
      filterBy,
      isAuthenticated,
      connectionStatus,
    ],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotificationsContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationProvider')
  }
  return context
}

export default NotificationProvider
