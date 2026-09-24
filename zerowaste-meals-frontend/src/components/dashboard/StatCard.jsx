import { StatCounter } from '../common/StatCounter'

export function StatCard({ image, label, value, suffix = '', prefix = '', trend }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-24 overflow-hidden">
        <img
          src={image}
          alt=""
          aria-hidden
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>
      <div className="relative -mt-8 px-6 pb-6">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-gray-900">
          <StatCounter value={value} suffix={suffix} prefix={prefix} />
        </p>
        {trend && <p className="mt-1.5 text-xs font-medium text-brand-600">{trend}</p>}
      </div>
    </div>
  )
}

export default StatCard