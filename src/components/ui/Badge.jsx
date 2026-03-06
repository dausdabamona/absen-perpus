import clsx from 'clsx'

const colorMap = {
  taruna: 'bg-blue-100 text-blue-700',
  dosen: 'bg-purple-100 text-purple-700',
  staf: 'bg-green-100 text-green-700',
  tamu: 'bg-gray-100 text-gray-700',
  aktif: 'bg-yellow-100 text-yellow-700',
  selesai: 'bg-green-100 text-green-700',
  online: 'bg-green-100 text-green-700',
  offline: 'bg-red-100 text-red-700',
}

export default function Badge({ children, type, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        colorMap[type] || 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  )
}
