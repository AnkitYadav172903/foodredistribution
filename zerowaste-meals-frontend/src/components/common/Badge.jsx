const COLORS = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
  brand: 'bg-brand-100 text-brand-800',
}

const DOTS = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-400',
  brand: 'bg-brand-500',
}

export function Badge({ color = 'gray', children, className = '', dot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${COLORS[color]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOTS[color]}`} />}
      {children}
    </span>
  )
}

export default Badge