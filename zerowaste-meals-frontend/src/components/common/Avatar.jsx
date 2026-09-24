import userIcon from '../../assets/icons/user.png'

export function Avatar({ src, alt = '', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md ${sizes[size]} ${className}`}
    >
      <img
        src={src || userIcon}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = userIcon
        }}
      />
    </span>
  )
}

export default Avatar