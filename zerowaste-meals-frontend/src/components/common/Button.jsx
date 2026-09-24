import { useRef, useState } from 'react'

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-glow',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-brand-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50 focus:ring-brand-500',
  outline: 'border border-brand-600 text-brand-700 hover:bg-brand-50 focus:ring-brand-500',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

let rippleId = 0

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ripple = true,
  ...props
}) {
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  const handleMouseDown = (e) => {
    if (!ripple || disabled) return undefined
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return undefined
    const size = Math.max(rect.width, rect.height)
    const id = ++rippleId
    setRipples((prev) => [
      ...prev,
      {
        id,
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
        size,
      },
    ])
    return undefined
  }

  return (
    <button
      ref={buttonRef}
      className={`btn-ripple inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          onAnimationEnd={() =>
            setRipples((prev) => prev.filter((item) => item.id !== r.id))
          }
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  )
}

export default Button