export default function Button({
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    children,
    className = '',
    type = 'button'
}) {
    const baseClasses = 'btn';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            {children}
        </button>
    );
}
