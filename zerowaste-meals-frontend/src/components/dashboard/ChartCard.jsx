import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: '1px solid #e2e8f0',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 30px -12px rgba(6,78,59,0.25)',
  fontSize: '12px',
  fontWeight: 500,
}

export function ChartCard({ title, subtitle, children, wide = false }) {
  return (
    <div
      className={`rounded-3xl border border-gray-100 bg-white p-6 shadow-card transition duration-300 hover:shadow-soft ${
        wide ? 'sm:col-span-2' : ''
      }`}
    >
      <div className="mb-4">
        <h3 className="font-display text-base font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="h-56">{children}</div>
    </div>
  )
}

export function SurplusTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="surplus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area
          type="monotone"
          dataKey="donations"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#surplus)"
        />
        <Area type="monotone" dataKey="claims" stroke="#34d399" strokeWidth={1.5} fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function DonationAnalyticsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={26}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
        <Bar dataKey="donations" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={['#10b981', '#064e3b', '#34d399', '#059669', '#6ee7b7'][index % 5]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function WeeklyActivityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
        <Bar dataKey="listed" name="Listed" radius={[6, 6, 0, 0]} fill="#34d399" />
        <Bar dataKey="claimed" name="Claimed" radius={[6, 6, 0, 0]} fill="#065f46" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthlyImpactChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          strokeWidth={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={['#10b981', '#34d399', '#059669', '#a7f3d0', '#064e3b'][index % 5]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ChartCard