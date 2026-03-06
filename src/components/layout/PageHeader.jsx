export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  )
}
