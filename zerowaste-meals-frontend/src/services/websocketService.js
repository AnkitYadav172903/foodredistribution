import storage from '../utils/storage'
import { WS_BASE_URL, WS_NOTIFICATION_DESTINATION } from '../utils/constants'

/**
 * STOMP client used for real-time notifications.
 *
 * The JWT travels in the CONNECT frame because a browser cannot set headers on a WebSocket
 * handshake; the backend validates it before binding a principal to the session. Reconnection is
 * handled by @stomp/stompjs with exponential backoff, so a Render cold start or a dropped socket
 * recovers on its own without polling.
 *
 * The SockJS/STMP modules are imported dynamically so their ~80 kB only lands in a separate chunk
 * once a signed-in user actually connects, keeping them out of the initial bundle.
 */

let client = null
let subscription = null
let currentHandlers = null
let loadPromise = null

function loadSocketLibs() {
  if (!loadPromise) {
    loadPromise = Promise.all([import('@stomp/stompjs'), import('sockjs-client')])
      .then(([stomp, sockjs]) => ({
        Client: stomp.Client,
        SockJS: sockjs.default ?? sockjs,
      }))
      .catch((err) => {
        loadPromise = null
        throw err
      })
  }
  return loadPromise
}

function buildClient({ Client, SockJS }, handlers) {
  const token = storage.getToken()

  const instance = new Client({
    webSocketFactory: () => new SockJS(WS_BASE_URL),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    maxReconnectDelay: 30000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
    onConnect: () => {
      subscription = instance.subscribe(WS_NOTIFICATION_DESTINATION, (message) => {
        let payload
        try {
          payload = JSON.parse(message.body)
        } catch {
          return
        }
        currentHandlers?.onNotification?.(payload)
      })
      handlers.onStatusChange?.('connected')
    },
    onWebSocketClose: () => {
      currentHandlers?.onStatusChange?.('reconnecting')
    },
    onStompError: (frame) => {
      // A rejected CONNECT (missing/expired JWT) will never succeed on retry, so surface it and
      // stop rather than hammering the server.
      if (frame?.headers?.message?.includes('Access denied')) {
        currentHandlers?.onStatusChange?.('unauthorized')
        instance.deactivate()
        return
      }
      currentHandlers?.onStatusChange?.('error')
    },
  })

  return instance
}

export const websocketService = {
  async connect(handlers = {}) {
    if (client?.active || client?.connected) return
    currentHandlers = handlers

    let libs
    try {
      libs = await loadSocketLibs()
    } catch {
      currentHandlers?.onStatusChange?.('error')
      return
    }

    // The socket may have been torn down while the libraries were loading.
    if (currentHandlers !== handlers) return

    client = buildClient(libs, handlers)
    client.activate()
  },

  disconnect() {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
    if (client) {
      client.deactivate()
      client = null
    }
    currentHandlers = null
  },

  isConnected() {
    return Boolean(client?.connected)
  },
}

export default websocketService
