import clsx from 'clsx'

const variants = {
  primary: 'bg-accent-500 hover:bg-accent-600 text-white',
  secondary: 'bg-primary-500 hover:bg-primary-600 text-white',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}

export default function Button({
  children,
  variant = 'primary',
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={clsx(
        'min-h-[56px] px-6 rounded-xl font-semibold text-base transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98] flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
