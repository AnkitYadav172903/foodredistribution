export function EmptyState({ image, icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
      {image && <img src={image} alt="" className="mb-5 h-44 w-44 object-contain opacity-90" />}
      {icon && <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState