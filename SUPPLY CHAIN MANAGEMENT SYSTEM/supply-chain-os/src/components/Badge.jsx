export default function Badge({ variant = 'info', children, size = 'sm' }) {
    const variantClasses = {
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
    };

    const sizeClasses = {
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-sm px-3 py-1',
    };

    return (
        <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]}`}>
            {children}
        </span>
    );
}
