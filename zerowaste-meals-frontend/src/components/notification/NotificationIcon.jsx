/**
 * Type-driven icon for a notification. Uses inline SVG so it inherits the accent colour of the
 * surrounding badge and stays crisp at any size.
 */

const PATHS = {
  donate: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-4.35-7-9a4 4 0 017-2.65A4 4 0 0119 12c0 4.65-7 9-7 9z"
      />
    </>
  ),
  claim: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7.5 4v5c0 4.5-3 7.7-7.5 9-4.5-1.3-7.5-4.5-7.5-9V7L12 3z"
      />
    </>
  ),
  location: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
    </>
  ),
  upload: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </>
  ),
  alert: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.3 4.3L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z"
      />
    </>
  ),
}

export function NotificationIcon({ name = 'alert', className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      {PATHS[name] || PATHS.alert}
    </svg>
  )
}

export default NotificationIcon
