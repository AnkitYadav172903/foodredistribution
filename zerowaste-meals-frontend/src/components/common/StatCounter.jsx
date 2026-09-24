import { useEffect, useRef, useState } from 'react'

const EASE_OUT = (t) => 1 - Math.pow(1 - t, 3)

export function useCountUp(target, { duration = 1600, decimals = 0, start = 0 } = {}) {
  const [value, setValue] = useState(start)
  const frame = useRef(0)
  const from = useRef(start)

  useEffect(() => {
    from.current = start
    const startTime = performance.now()
    const diff = target - from.current

    if (diff === 0) {
      setValue(target)
      return undefined
    }

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = EASE_OUT(progress)
      setValue(from.current + diff * eased)
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration, start])

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en-IN')

  return formatted
}

export function StatCounter({ value, suffix = '', prefix = '', decimals = 0, className = '' }) {
  const display = useCountUp(value, { decimals })
  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export default StatCounter