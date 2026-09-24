const SIZES = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

export function Loader({ size = 'md', label, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <span
        role="status"
        aria-label="Loading"
        className={`${SIZES[size]} inline-block animate-spin rounded-full border-brand-600 border-t-transparent`}
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}

export default Loader