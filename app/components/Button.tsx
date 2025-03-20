'use client'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  children?: React.ReactNode
  onClick?: () => void
  secondary?: boolean
  danger?: boolean
  disabled?: boolean
  outline?: boolean
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
  outline,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        flex
        justify-center
        rounded-lg
        px-3
        py-2
        text-sm
        font-semibold
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        ${disabled && 'opacity-50 cursor-default'}
        ${fullWidth && 'w-full'}
        ${secondary ? 'text-gray-900' : 'text-white'}
        ${danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600'}
        ${!secondary && !danger && !outline && 'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'}
        ${outline && 'bg-white border-2 border-black text-black hover:bg-neutral-100'}
      `}
    >
      {children}
    </button>
  )
}

export default Button 