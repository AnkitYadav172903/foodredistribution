import { useEffect, useRef } from 'react'
import websocketService from '../services/websocketService'

/**
 * Subscribes to the STOMP notification queue for as long as the component is mounted.
 *
 * @param {string|null} token  JWT; the socket is only opened while a token exists
 * @param {(notification: object) => void} onNotification called for each pushed notification
 * @param {(status: string) => void} [onStatusChange] 'connected' | 'reconnecting' | 'unauthorized' | 'error'
 */
export function useWebSocket(token, onNotification, onStatusChange) {
  const notificationRef = useRef(onNotification)
  const statusRef = useRef(onStatusChange)

  useEffect(() => {
    notificationRef.current = onNotification
  }, [onNotification])

  useEffect(() => {
    statusRef.current = onStatusChange
  }, [onStatusChange])

  useEffect(() => {
    if (!token) {
      websocketService.disconnect()
      return undefined
    }

    websocketService.connect({
      onNotification: (payload) => notificationRef.current?.(payload),
      onStatusChange: (status) => statusRef.current?.(status),
    })

    return () => websocketService.disconnect()
  }, [token])
}

export default useWebSocket
